from pathlib import Path

# Paths
BACKEND_DIR = Path(__file__).parent.parent
DATA_DIR = BACKEND_DIR / "data"
CHROMA_DIR = BACKEND_DIR / "chroma_db"
RESUME_PDF_PATH = DATA_DIR / "Resume.pdf"
CANDIDATE_DATA_PATH = DATA_DIR / "candidate_data.json"

# Embedding model (runs locally, no API key needed)
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# ChromaDB
COLLECTION_NAME = "portfolio_chunks"

# Retrieval
TOP_K = 8

# Groq LLM API
LLM_API_URL = "https://api.groq.com/openai/v1/chat/completions"
LLM_MODEL = "llama-3.3-70b-versatile"
LLM_API_KEY_ENV = "GROQ_API_KEY"
MAX_TOKENS = 2500
TEMPERATURE = 0.3
