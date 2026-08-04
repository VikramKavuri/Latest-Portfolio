"""Build the LLM prompt from retrieved context chunks and ATS score."""


def build_rag_prompt(
    job_description: str,
    retrieved_chunks: list[dict],
    ats_result: dict,
) -> dict:
    """Construct system and user messages using retrieved context and ATS score."""

    # Group chunks by category for structured presentation
    context_sections = {}
    for chunk in retrieved_chunks:
        category = chunk["metadata"].get("category", "other")
        if category not in context_sections:
            context_sections[category] = []
        context_sections[category].append(chunk["text"])

    # Build context string in a logical order
    context_parts = []
    category_order = [
        "experience", "project", "skill", "certification", "education",
    ]
    for cat in category_order:
        if cat in context_sections:
            header = cat.upper()
            items = "\n".join(f"- {item}" for item in context_sections[cat])
            context_parts.append(f"[{header}]\n{items}")

    for cat, items in context_sections.items():
        if cat not in category_order:
            header = cat.upper()
            item_text = "\n".join(f"- {item}" for item in items)
            context_parts.append(f"[{header}]\n{item_text}")

    context_string = "\n\n".join(context_parts)

    # Build ATS analysis summary for the LLM
    matched = ", ".join(ats_result["matched_skills"][:15]) or "none detected"
    missing = ", ".join(ats_result["missing_skills"][:10]) or "none"
    breakdown = ats_result["breakdown"]

    ats_summary = f"""PRE-COMPUTED ATS KEYWORD ANALYSIS (use this exact score):
- MATCH SCORE: {ats_result['score']}% (YOU MUST USE THIS EXACT NUMBER as matchScore)
- Skills matched: {ats_result['skill_match_pct']}% ({len(ats_result['matched_skills'])} of {len(ats_result['matched_skills']) + len(ats_result['missing_skills'])} required)
- Matched skills: {matched}
- Missing skills: {missing}
- Education match: {"Yes" if ats_result['education_match'] else "No"}
- Experience match: {"Yes" if ats_result['experience_match'] else "No"}
- Score breakdown: Skills {breakdown['skill_score']}/60, Context {breakdown['context_score']}/25, Education {breakdown['education_score']}/10, Experience {breakdown['experience_score']}/5"""

    system_message = (
        "You are a professional career advisor writing a job match analysis. "
        "An ATS keyword scanner has already computed the match score. "
        "You MUST use the exact matchScore provided — do NOT calculate your own. "
        "Your job is to write compelling bestFitPoints and topSkills based on "
        "the candidate's actual background and the job requirements. "
        "Only reference skills and achievements that genuinely exist in the candidate data. "
        "Respond ONLY with valid JSON, no extra text."
    )

    user_message = f"""{ats_summary}

JOB DESCRIPTION:
{job_description}

RELEVANT CANDIDATE BACKGROUND:
{context_string}

Return ONLY this JSON (no markdown, no explanation):
{{
  "matchScore": {ats_result['score']},
  "bestFitPoints": [
    "<specific achievement from candidate background that maps to a job requirement — cite metrics>",
    "<another concrete match with numbers/results>",
    "<transferable skill with real example>",
    (5-6 points total, each tied to an actual job requirement)
  ],
  "topSkills": [
    {{
      "skill": "<skill from the MATCHED SKILLS list above>",
      "context": "<1-2 sentence specific example from candidate background proving this skill>"
    }},
    (6 skills, ONLY from matched skills list — never invent skills the candidate doesn't have)
  ]
}}

CRITICAL RULES:
1. matchScore MUST be exactly {ats_result['score']} — do not change it
2. bestFitPoints must reference REAL achievements from the candidate background above
3. topSkills must only list skills from the matched skills: {matched}
4. If missing skills exist, do NOT pretend the candidate has them
5. Be honest — if the match is weak, the bestFitPoints should acknowledge transferable skills rather than fabricate direct matches"""

    return {
        "system": system_message,
        "user": user_message,
    }
