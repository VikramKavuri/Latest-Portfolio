"""
Deterministic ATS-style keyword scorer.

Extracts required skills/keywords from the job description,
matches them against the candidate's full profile, and returns
a grounded score with detailed match breakdowns.
"""

import json
import re
from pathlib import Path
from rag.config import CANDIDATE_DATA_PATH


# ── Load candidate data once ──
_candidate_data = None

def _get_candidate_data() -> dict:
    global _candidate_data
    if _candidate_data is None:
        with open(CANDIDATE_DATA_PATH, "r", encoding="utf-8") as f:
            _candidate_data = json.load(f)
    return _candidate_data


# ── Build the candidate's full keyword set (lowercased) ──
def _build_candidate_keywords() -> dict:
    """
    Returns a dict with:
      - skills: set of all explicit skill strings
      - technologies: set of all technologies from experiences + projects
      - highlights: list of all highlight/feature strings (for contextual matching)
      - titles: set of job titles held
      - certifications: set of cert names
      - education: set of degree keywords
    """
    data = _get_candidate_data()

    skills = set()
    for category, skill_list in data.get("skills", {}).items():
        for s in skill_list:
            skills.add(s.lower().strip())

    technologies = set()
    highlights = []
    titles = set()

    for exp in data.get("experiences", []):
        titles.add(exp["title"].lower().strip())
        for t in exp.get("technologies", []):
            technologies.add(t.lower().strip())
        for h in exp.get("highlights", []):
            highlights.append(h.lower())

    for proj in data.get("projects", []):
        for t in proj.get("technologies", []):
            technologies.add(t.lower().strip())
        for f in proj.get("features", []):
            highlights.append(f.lower())
        if proj.get("description"):
            highlights.append(proj["description"].lower())

    certifications = set()
    for cert in data.get("certifications", []):
        certifications.add(cert["name"].lower().strip())

    education = set()
    for edu in data.get("education", []):
        education.add(edu["degree"].lower().strip())
        education.add(edu["institution"].lower().strip())

    return {
        "skills": skills | technologies,  # merge both
        "technologies": technologies,
        "highlights": highlights,
        "titles": titles,
        "certifications": certifications,
        "education": education,
    }


# ── Common tech synonyms / aliases ──
SKILL_ALIASES = {
    "amazon web services": "aws",
    "microsoft azure": "azure",
    "google cloud platform": "gcp",
    "google cloud": "gcp",
    "postgres": "postgresql",
    "ms sql": "sql server",
    "mssql": "sql server",
    "t-sql": "sql",
    "tsql": "sql",
    "pl/sql": "sql",
    "structured query language": "sql",
    "amazon redshift": "aws redshift",
    "redshift": "aws redshift",
    "sci-kit learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "powerbi": "power bi",
    "power-bi": "power bi",
    "apache spark": "pyspark",
    "spark": "pyspark",
    "airflow": "apache airflow",
    "data factory": "azure data factory",
    "adf": "azure data factory",
    "etl": "etl",
    "elt": "etl",
    "ci/cd": "ci/cd",
    "cicd": "ci/cd",
    "docker containers": "docker",
    "containerization": "docker",
    "machine learning": "ml",
    "deep learning": "ml",
    "artificial intelligence": "ai",
    "natural language processing": "nlp",
    "large language models": "llm",
    "llms": "llm",
    "genai": "generative ai",
    "gen ai": "generative ai",
    "data visualization": "data visualization",
    "data modelling": "data modeling",
    "data warehousing": "data warehouse",
    "data visualization": "tableau",
    "data visualisation": "tableau",
    "dbt": "dbt",
    "great expectations": "great_expectations",
    "numpy": "numpy",
    "excel": "excel",
    "microsoft excel": "excel",
    "jira": "jira",
    "git": "git",
    "github": "git",
    "rest api": "rest apis",
    "restful api": "rest apis",
    "restful apis": "rest apis",
}


def _normalize_skill(skill: str) -> str:
    """Normalize a skill string via alias lookup."""
    s = skill.lower().strip()
    return SKILL_ALIASES.get(s, s)


# ── Extract keywords from job description ──
def _extract_jd_keywords(job_description: str) -> dict:
    """
    Extract structured keyword sets from a job description.
    Returns dict with: required_skills, preferred_skills, experience_keywords,
                        years_experience, education_keywords
    """
    jd_lower = job_description.lower()

    # ── Known tech/tool patterns to look for ──
    KNOWN_SKILLS = [
        # Languages
        "python", "sql", "r", "java", "scala", "javascript", "typescript",
        "bash", "shell", "powershell", "go", "golang", "rust", "c++", "c#",
        "pyspark", "t-sql",
        # Cloud
        "aws", "azure", "gcp", "google cloud", "amazon web services",
        "microsoft azure", "google cloud platform",
        "databricks", "snowflake", "redshift", "bigquery", "synapse",
        # Data tools
        "apache airflow", "airflow", "apache spark", "spark",
        "kafka", "hadoop", "hive", "dbt", "nifi",
        "azure data factory", "data factory", "adf",
        "ssis", "ssrs", "ssas", "informatica", "talend",
        "docker", "kubernetes", "terraform", "jenkins",
        "ci/cd", "git", "github", "gitlab",
        # BI
        "tableau", "power bi", "powerbi", "qlik", "qlik sense",
        "looker", "superset", "apache superset", "metabase",
        "excel", "google sheets",
        # Databases
        "postgresql", "postgres", "mysql", "sql server", "mongodb",
        "cassandra", "dynamodb", "redis", "elasticsearch",
        "oracle", "sqlite", "neo4j",
        # ML
        "scikit-learn", "sklearn", "tensorflow", "pytorch",
        "xgboost", "lightgbm", "keras", "mlflow",
        "pandas", "numpy", "scipy", "matplotlib",
        "prophet", "arima",
        # Concepts
        "etl", "elt", "data warehouse", "data warehousing",
        "data modeling", "data modelling", "data pipeline",
        "data lake", "lakehouse", "medallion",
        "machine learning", "deep learning", "nlp",
        "natural language processing",
        "generative ai", "genai", "gen ai", "llm", "llms",
        "data governance", "data quality",
        "a/b testing", "statistical analysis", "statistics",
        "regression", "classification", "clustering",
        "rest api", "restful api", "rest apis",
        "agile", "scrum", "jira",
        "hipaa", "gdpr", "ferpa", "sox",
        "data visualization", "reporting",
    ]

    # Find which known skills appear in the JD
    found_skills = set()
    for skill in KNOWN_SKILLS:
        # Use word boundary matching for short terms
        if len(skill) <= 3:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, jd_lower):
                found_skills.add(_normalize_skill(skill))
        else:
            if skill in jd_lower:
                found_skills.add(_normalize_skill(skill))

    # Extract years of experience requirements
    years_patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)',
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:in|with|of)',
    ]
    years_required = 0
    for pattern in years_patterns:
        matches = re.findall(pattern, jd_lower)
        if matches:
            years_required = max(years_required, max(int(m) for m in matches))

    # Check for education requirements
    education_keywords = set()
    edu_patterns = [
        (r"(?:bachelor|bs|b\.s\.|ba|b\.a\.)", "bachelors"),
        (r"(?:master|ms|m\.s\.|ma|m\.a\.|mba)", "masters"),
        (r"(?:ph\.?d|doctorate)", "phd"),
        (r"computer science", "computer science"),
        (r"data science", "data science"),
        (r"statistics", "statistics"),
        (r"mathematics", "mathematics"),
    ]
    for pattern, label in edu_patterns:
        if re.search(pattern, jd_lower):
            education_keywords.add(label)

    return {
        "required_skills": found_skills,
        "years_required": years_required,
        "education_keywords": education_keywords,
    }


def compute_ats_score(job_description: str) -> dict:
    """
    Compute a deterministic ATS match score.

    Returns:
        {
            "score": int (0-100),
            "matched_skills": list of matched skill strings,
            "missing_skills": list of unmatched required skills,
            "skill_match_pct": float,
            "experience_match": bool,
            "education_match": bool,
            "contextual_hits": int,
            "breakdown": {
                "skill_score": float,
                "context_score": float,
                "education_score": float,
            }
        }
    """
    jd_info = _extract_jd_keywords(job_description)
    candidate = _build_candidate_keywords()

    required_skills = jd_info["required_skills"]

    if not required_skills:
        # If we couldn't extract any skills, fall back to a basic text overlap
        return _fallback_text_score(job_description, candidate)

    # ── 1. Skill Match (60% weight) ──
    candidate_normalized = {_normalize_skill(s) for s in candidate["skills"]}

    matched = set()
    missing = set()
    for skill in required_skills:
        norm = _normalize_skill(skill)
        if norm in candidate_normalized:
            matched.add(skill)
        else:
            # Check if the skill appears in any highlight text (contextual match)
            found_in_context = False
            for h in candidate["highlights"]:
                if skill in h or norm in h:
                    matched.add(skill)
                    found_in_context = True
                    break
            if not found_in_context:
                missing.add(skill)

    skill_match_pct = len(matched) / len(required_skills) if required_skills else 0

    # Penalty: if we extracted very few skills from a long JD, the role is
    # likely in a domain the candidate has no expertise in. The scanner
    # couldn't even recognise most of the JD's requirements.
    jd_word_count = len(job_description.split())
    extracted_count = len(required_skills)
    if extracted_count <= 2 and jd_word_count > 40:
        # Very few recognisable skills → heavily penalise
        skill_match_pct = skill_match_pct * 0.15  # almost zero credit
    elif extracted_count <= 4 and jd_word_count > 50:
        # Few recognisable skills → moderate penalty
        skill_match_pct = skill_match_pct * 0.4

    skill_score = skill_match_pct * 60  # out of 60

    # ── 2. Contextual relevance (25% weight) ──
    # How many JD keywords appear in candidate's highlights/descriptions
    jd_words = set(re.findall(r'\b[a-z]{4,}\b', job_description.lower()))
    # Remove common stop words
    stop_words = {
        "with", "that", "this", "from", "have", "will", "your", "they",
        "been", "were", "their", "which", "about", "would", "there",
        "what", "some", "could", "other", "than", "then", "them", "each",
        "make", "like", "into", "over", "such", "after", "should", "also",
        "most", "these", "only", "very", "when", "where", "must", "work",
        "able", "well", "need", "role", "team", "join", "plus", "good",
        "year", "years", "strong", "required", "preferred", "including",
        "experience", "working", "understanding", "knowledge", "ability",
        "based", "using", "across", "within", "ensure", "support",
        "develop", "building", "looking", "position", "company",
        "responsibilities", "requirements", "qualifications",
    }
    jd_words -= stop_words

    all_candidate_text = " ".join(candidate["highlights"])
    contextual_hits = 0
    for word in jd_words:
        if word in all_candidate_text:
            contextual_hits += 1

    context_ratio = contextual_hits / len(jd_words) if jd_words else 0
    context_score = min(context_ratio * 1.5, 1.0) * 25  # out of 25, with boost

    # ── 3. Education match (10% weight) ──
    edu_score = 0
    if jd_info["education_keywords"]:
        candidate_edu_text = " ".join(candidate["education"])
        edu_matched = 0
        for kw in jd_info["education_keywords"]:
            if kw in candidate_edu_text:
                edu_matched += 1
        edu_ratio = edu_matched / len(jd_info["education_keywords"])
        edu_score = edu_ratio * 10
    else:
        edu_score = 8  # No education requirement = almost full marks

    # ── 4. Experience years (5% weight) ──
    # Candidate has ~5 years total (2020–present)
    candidate_years = 5
    exp_score = 0
    if jd_info["years_required"] > 0:
        if candidate_years >= jd_info["years_required"]:
            exp_score = 5
        else:
            exp_score = (candidate_years / jd_info["years_required"]) * 5
    else:
        exp_score = 4  # No explicit requirement

    total_score = round(skill_score + context_score + edu_score + exp_score)
    total_score = max(0, min(100, total_score))

    return {
        "score": total_score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "skill_match_pct": round(skill_match_pct * 100, 1),
        "experience_match": candidate_years >= jd_info.get("years_required", 0),
        "education_match": edu_score >= 7,
        "contextual_hits": contextual_hits,
        "breakdown": {
            "skill_score": round(skill_score, 1),
            "context_score": round(context_score, 1),
            "education_score": round(edu_score, 1),
            "experience_score": round(exp_score, 1),
        },
    }


def _fallback_text_score(job_description: str, candidate: dict) -> dict:
    """Fallback when no structured skills could be extracted."""
    jd_lower = job_description.lower()
    all_skills = candidate["skills"]

    matched = set()
    for skill in all_skills:
        if skill in jd_lower:
            matched.add(skill)

    ratio = len(matched) / max(len(all_skills), 1)
    score = round(min(ratio * 3, 1.0) * 70 + 10)  # scale 10-80

    return {
        "score": max(0, min(100, score)),
        "matched_skills": sorted(matched),
        "missing_skills": [],
        "skill_match_pct": round(ratio * 100, 1),
        "experience_match": True,
        "education_match": True,
        "contextual_hits": 0,
        "breakdown": {
            "skill_score": round(score * 0.6, 1),
            "context_score": round(score * 0.25, 1),
            "education_score": round(score * 0.1, 1),
            "experience_score": round(score * 0.05, 1),
        },
    }
