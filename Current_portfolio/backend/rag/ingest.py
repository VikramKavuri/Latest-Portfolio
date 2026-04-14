"""
One-time data ingestion script.
Parses resume PDF + candidate_data.json, chunks by section,
generates embeddings, and stores in ChromaDB.

Usage:
    cd backend
    python -m rag.ingest
"""

import json
import logging
import chromadb
from sentence_transformers import SentenceTransformer
from rag.config import (
    EMBEDDING_MODEL, CHROMA_DIR, COLLECTION_NAME,
    RESUME_PDF_PATH, CANDIDATE_DATA_PATH,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_chunks_from_json(data: dict) -> list[dict]:
    """Create semantically meaningful chunks from structured candidate data."""
    chunks = []

    # Experience chunks — one per role
    for exp in data.get("experiences", []):
        text = (
            f"{exp['title']} at {exp['company']}, {exp.get('location', '')} "
            f"({exp['period']}). "
        )
        text += " ".join(exp["highlights"])
        text += f" Technologies used: {', '.join(exp['technologies'])}."
        chunks.append({
            "text": text,
            "metadata": {
                "category": "experience",
                "entity": exp["company"],
                "source": "structured_data",
            },
        })

    # Project chunks — one per project
    for proj in data.get("projects", []):
        text = (
            f"Project: {proj['title']} ({proj['category']}). "
            f"{proj['description']} "
        )
        text += " ".join(proj.get("features", []))
        text += f" Technologies: {', '.join(proj['technologies'])}."
        text += f" Key metric: {proj['keyMetric']}."
        chunks.append({
            "text": text,
            "metadata": {
                "category": "project",
                "entity": proj["title"],
                "source": "structured_data",
            },
        })

    # Skill chunks — one per category
    for category, skill_list in data.get("skills", {}).items():
        text = f"Skills - {category}: {', '.join(skill_list)}"
        chunks.append({
            "text": text,
            "metadata": {
                "category": "skill",
                "entity": category,
                "source": "structured_data",
            },
        })

    # Certification chunks
    for cert in data.get("certifications", []):
        text = f"Certification: {cert['name']} by {cert['issuer']} ({cert['date']})"
        chunks.append({
            "text": text,
            "metadata": {
                "category": "certification",
                "entity": cert["name"],
                "source": "structured_data",
            },
        })

    # Education chunks
    for edu in data.get("education", []):
        text = (
            f"{edu['degree']} from {edu['institution']}, "
            f"GPA: {edu['gpa']} ({edu['period']})"
        )
        chunks.append({
            "text": text,
            "metadata": {
                "category": "education",
                "entity": edu["institution"],
                "source": "structured_data",
            },
        })

    return chunks


def create_chunks_from_pdf(pdf_path) -> list[dict]:
    """Parse resume PDF and split into section-based chunks."""
    try:
        import pdfplumber
    except ImportError:
        logger.warning("pdfplumber not installed, skipping PDF ingestion")
        return []

    chunks = []
    full_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"

    if not full_text.strip():
        logger.warning("No text extracted from PDF")
        return []

    # Split by common resume section headers
    section_headers = [
        "Technical Skills", "Skills", "Experience", "Education",
        "Projects", "Certifications", "Summary", "Objective",
        "Professional Experience", "Work Experience",
    ]

    lines = full_text.split("\n")
    current_section = "General"
    current_text = []

    for line in lines:
        stripped = line.strip()
        # Check if this line is a section header
        is_header = any(
            stripped.lower().startswith(h.lower()) for h in section_headers
        )
        if is_header and current_text:
            # Save previous section
            section_text = " ".join(current_text).strip()
            if len(section_text) > 30:
                chunks.append({
                    "text": section_text,
                    "metadata": {
                        "category": current_section.lower(),
                        "entity": current_section,
                        "source": "resume_pdf",
                    },
                })
            current_section = stripped
            current_text = []
        else:
            current_text.append(stripped)

    # Don't forget the last section
    if current_text:
        section_text = " ".join(current_text).strip()
        if len(section_text) > 30:
            chunks.append({
                "text": section_text,
                "metadata": {
                    "category": current_section.lower(),
                    "entity": current_section,
                    "source": "resume_pdf",
                },
            })

    return chunks


def ingest():
    """Main ingestion pipeline."""
    logger.info("Loading embedding model: %s", EMBEDDING_MODEL)
    model = SentenceTransformer(EMBEDDING_MODEL)

    logger.info("Initializing ChromaDB at: %s", CHROMA_DIR)
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Delete existing collection if re-ingesting
    try:
        client.delete_collection(COLLECTION_NAME)
        logger.info("Deleted existing collection: %s", COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    all_chunks = []

    # Ingest structured JSON data
    if CANDIDATE_DATA_PATH.exists():
        logger.info("Loading candidate data from: %s", CANDIDATE_DATA_PATH)
        with open(CANDIDATE_DATA_PATH, encoding="utf-8") as f:
            data = json.load(f)
        json_chunks = create_chunks_from_json(data)
        logger.info("Created %d chunks from structured data", len(json_chunks))
        all_chunks.extend(json_chunks)
    else:
        logger.warning("candidate_data.json not found at %s", CANDIDATE_DATA_PATH)

    # Ingest resume PDF
    if RESUME_PDF_PATH.exists():
        logger.info("Parsing resume PDF: %s", RESUME_PDF_PATH)
        pdf_chunks = create_chunks_from_pdf(RESUME_PDF_PATH)
        logger.info("Created %d chunks from resume PDF", len(pdf_chunks))
        all_chunks.extend(pdf_chunks)
    else:
        logger.warning(
            "Resume PDF not found at %s — skipping PDF ingestion. "
            "Place your resume.pdf in backend/data/ and re-run.",
            RESUME_PDF_PATH,
        )

    if not all_chunks:
        logger.error("No chunks to ingest. Check your data sources.")
        return

    # Generate embeddings
    texts = [c["text"] for c in all_chunks]
    logger.info("Generating embeddings for %d chunks...", len(texts))
    embeddings = model.encode(texts).tolist()

    # Store in ChromaDB
    collection.add(
        ids=[f"chunk_{i}" for i in range(len(all_chunks))],
        documents=texts,
        embeddings=embeddings,
        metadatas=[c["metadata"] for c in all_chunks],
    )

    logger.info(
        "Successfully ingested %d chunks into ChromaDB collection '%s'",
        len(all_chunks),
        COLLECTION_NAME,
    )

    # Print summary
    categories = {}
    for c in all_chunks:
        cat = c["metadata"]["category"]
        categories[cat] = categories.get(cat, 0) + 1
    logger.info("Chunk breakdown: %s", categories)


if __name__ == "__main__":
    ingest()
