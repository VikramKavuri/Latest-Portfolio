"""ChromaDB client and retrieval functions."""

import logging
import chromadb
from sentence_transformers import SentenceTransformer
from rag.config import EMBEDDING_MODEL, CHROMA_DIR, COLLECTION_NAME, TOP_K

logger = logging.getLogger(__name__)

# Singletons — loaded once, reused across requests
_model = None
_client = None
_collection = None


def get_model():
    """Load the sentence-transformer model (singleton)."""
    global _model
    if _model is None:
        logger.info("Loading embedding model: %s", EMBEDDING_MODEL)
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def get_collection():
    """Get the ChromaDB collection (singleton)."""
    global _client, _collection
    if _collection is None:
        logger.info("Connecting to ChromaDB at: %s", CHROMA_DIR)
        _client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        _collection = _client.get_collection(COLLECTION_NAME)
        logger.info(
            "Loaded collection '%s' with %d documents",
            COLLECTION_NAME,
            _collection.count(),
        )
    return _collection


def retrieve_relevant_chunks(
    job_description: str, top_k: int = TOP_K
) -> list[dict]:
    """Embed the job description and retrieve the most relevant chunks."""
    model = get_model()
    collection = get_collection()

    query_embedding = model.encode([job_description]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for i in range(len(results["documents"][0])):
        chunks.append({
            "text": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i],
        })

    logger.info(
        "Retrieved %d chunks (categories: %s)",
        len(chunks),
        [c["metadata"].get("category") for c in chunks],
    )

    return chunks
