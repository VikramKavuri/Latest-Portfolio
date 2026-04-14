"""FastAPI router for the RAG-powered job match analysis endpoint."""

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from rag.embeddings import retrieve_relevant_chunks
from rag.prompt_builder import build_rag_prompt
from rag.openrouter_client import call_openrouter
from rag.ats_scorer import compute_ats_score

logger = logging.getLogger(__name__)

rag_router = APIRouter(prefix="/api")


class AnalyzeMatchRequest(BaseModel):
    job_description: str = Field(..., min_length=50, max_length=10000)


class SkillMatch(BaseModel):
    skill: str
    context: str


class AnalyzeMatchResponse(BaseModel):
    matchScore: int
    bestFitPoints: List[str]
    topSkills: List[SkillMatch]


@rag_router.post("/analyze-match", response_model=AnalyzeMatchResponse)
async def analyze_match(request: AnalyzeMatchRequest):
    """
    RAG-powered job match analysis with deterministic ATS scoring.
    1. Compute ATS keyword score (deterministic)
    2. Embed the job description & retrieve relevant chunks
    3. Build prompt with ATS score + retrieved context
    4. Call LLM for qualitative analysis
    5. Enforce ATS score in final response
    """
    try:
        # Step 1: Compute deterministic ATS score
        ats_result = compute_ats_score(request.job_description)
        logger.info(
            "ATS score: %d%% | Matched: %d skills | Missing: %d skills",
            ats_result["score"],
            len(ats_result["matched_skills"]),
            len(ats_result["missing_skills"]),
        )

        # Step 2: Retrieve relevant chunks
        chunks = retrieve_relevant_chunks(request.job_description)
        logger.info("Retrieved %d chunks for analysis", len(chunks))

        # Step 3: Build prompt with ATS score included
        messages = build_rag_prompt(
            request.job_description, chunks, ats_result
        )

        # Step 4: Call LLM
        result = call_openrouter(messages["system"], messages["user"])

        # Step 5: Enforce the ATS score (override LLM if it changed it)
        result["matchScore"] = ats_result["score"]

        # Validate response structure
        required_keys = ("matchScore", "bestFitPoints", "topSkills")
        if not all(k in result for k in required_keys):
            raise ValueError("Incomplete response from LLM")

        return AnalyzeMatchResponse(**result)

    except ValueError as e:
        logger.error("Validation error: %s", e)
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error("Analysis error: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500, detail="Analysis failed. Please try again."
        )
