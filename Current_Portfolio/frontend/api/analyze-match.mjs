import profile from '../../backend/data/candidate_data.json' with { type: 'json' };

export const maxDuration = 60;

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const REQUEST_LIMIT = 6;
const REQUEST_WINDOW_MS = 60_000;
const requestBuckets = new Map();

const SKILL_ALIASES = new Map(Object.entries({
  'amazon web services': 'aws',
  'microsoft azure': 'azure',
  'google cloud platform': 'gcp',
  'google cloud': 'gcp',
  postgres: 'postgresql',
  mssql: 'sql server',
  't-sql': 'sql',
  tsql: 'sql',
  'structured query language': 'sql',
  redshift: 'aws redshift',
  sklearn: 'scikit-learn',
  'scikit learn': 'scikit-learn',
  powerbi: 'power bi',
  'power-bi': 'power bi',
  'apache spark': 'pyspark',
  spark: 'pyspark',
  airflow: 'apache airflow',
  'data factory': 'azure data factory',
  adf: 'azure data factory',
  elt: 'etl',
  cicd: 'ci/cd',
  'machine learning': 'ml',
  'deep learning': 'ml',
  'natural language processing': 'nlp',
  'large language models': 'llm',
  llms: 'llm',
  genai: 'generative ai',
  'gen ai': 'generative ai',
  'data modelling': 'data modeling',
  'data warehousing': 'data warehouse',
  github: 'git',
  'rest api': 'rest apis',
  'restful api': 'rest apis',
  'restful apis': 'rest apis',
}));

const KNOWN_SKILLS = [
  'python', 'sql', 'r', 'java', 'scala', 'javascript', 'typescript', 'bash',
  'powershell', 'go', 'rust', 'c++', 'c#', 'pyspark', 't-sql', 'aws',
  'azure', 'gcp', 'google cloud', 'amazon web services', 'microsoft azure',
  'google cloud platform', 'databricks', 'snowflake', 'redshift', 'bigquery',
  'synapse', 'apache airflow', 'airflow', 'apache spark', 'spark', 'kafka',
  'hadoop', 'hive', 'dbt', 'azure data factory', 'data factory', 'adf',
  'ssis', 'ssrs', 'informatica', 'docker', 'kubernetes', 'terraform',
  'ci/cd', 'git', 'github', 'tableau', 'power bi', 'powerbi', 'qlik sense',
  'looker', 'apache superset', 'excel', 'postgresql', 'postgres', 'mysql',
  'sql server', 'mongodb', 'redis', 'oracle', 'neo4j', 'scikit-learn',
  'sklearn', 'tensorflow', 'pytorch', 'xgboost', 'keras', 'mlflow', 'pandas',
  'numpy', 'prophet', 'arima', 'etl', 'elt', 'data warehouse',
  'data warehousing', 'data modeling', 'data modelling', 'data pipeline',
  'data lake', 'lakehouse', 'medallion', 'machine learning', 'deep learning',
  'nlp', 'natural language processing', 'generative ai', 'genai', 'gen ai',
  'llm', 'llms', 'data governance', 'data quality', 'a/b testing',
  'statistical analysis', 'regression', 'classification', 'clustering',
  'rest api', 'restful api', 'agile', 'scrum', 'jira', 'hipaa', 'gdpr',
  'ferpa', 'data visualization', 'reporting',
];

const STOP_WORDS = new Set([
  'about', 'ability', 'after', 'also', 'based', 'building', 'company',
  'develop', 'each', 'ensure', 'experience', 'have', 'including', 'join',
  'knowledge', 'looking', 'must', 'other', 'position', 'preferred',
  'qualifications', 'required', 'requirements', 'responsibilities', 'role',
  'should', 'strong', 'support', 'team', 'their', 'these', 'this', 'using',
  'well', 'where', 'which', 'will', 'with', 'within', 'work', 'working',
  'would', 'years', 'your',
]);

const normalizeSkill = (skill) => {
  const normalized = String(skill).toLowerCase().trim();
  return SKILL_ALIASES.get(normalized) || normalized;
};

const tokenize = (text) => String(text)
  .toLowerCase()
  .replace(/[^a-z0-9+#./-]+/g, ' ')
  .split(/\s+/)
  .filter((term) => term.length > 2 && !STOP_WORDS.has(term));

const includesPhrase = (text, phrase) => {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = phrase.length <= 3
    ? new RegExp(`\\b${escaped}\\b`, 'i')
    : new RegExp(escaped, 'i');
  return pattern.test(text);
};

const buildProfileIndex = () => {
  const chunks = [];
  const explicitSkills = new Set();

  Object.values(profile.skills || {}).flat().forEach((skill) => {
    explicitSkills.add(normalizeSkill(skill));
  });

  for (const experience of profile.experiences || []) {
    (experience.technologies || []).forEach((skill) => explicitSkills.add(normalizeSkill(skill)));
    for (const highlight of experience.highlights || []) {
      chunks.push({
        category: 'experience',
        label: `${experience.title} at ${experience.company}`,
        text: `${experience.title} at ${experience.company} (${experience.period}): ${highlight}`,
      });
    }
  }

  for (const project of profile.projects || []) {
    (project.technologies || []).forEach((skill) => explicitSkills.add(normalizeSkill(skill)));
    chunks.push({
      category: 'project',
      label: project.title,
      text: [
        `${project.title}: ${project.description || ''}`,
        ...(project.features || []),
        project.keyMetric ? `Key result: ${project.keyMetric}` : '',
        `Technologies: ${(project.technologies || []).join(', ')}`,
      ].filter(Boolean).join(' '),
    });
  }

  for (const education of profile.education || []) {
    chunks.push({
      category: 'education',
      label: education.degree,
      text: `${education.degree}, ${education.institution}, ${education.period}; GPA ${education.gpa}`,
    });
  }

  for (const certification of profile.certifications || []) {
    chunks.push({
      category: 'certification',
      label: certification.name,
      text: `${certification.name}, ${certification.issuer}, ${certification.date}`,
    });
  }

  chunks.push({
    category: 'skills',
    label: 'Technical toolkit',
    text: Object.entries(profile.skills || {})
      .map(([category, skills]) => `${category}: ${skills.join(', ')}`)
      .join('. '),
  });

  return {
    chunks,
    explicitSkills,
    fullText: chunks.map((chunk) => chunk.text).join(' ').toLowerCase(),
  };
};

const profileIndex = buildProfileIndex();

const extractJobRequirements = (jobDescription) => {
  const found = new Set();
  for (const skill of KNOWN_SKILLS) {
    if (includesPhrase(jobDescription, skill)) found.add(normalizeSkill(skill));
  }

  const yearMatches = [...jobDescription.toLowerCase().matchAll(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience)?/g)];
  const yearsRequired = yearMatches.length
    ? Math.max(...yearMatches.map((match) => Number(match[1])))
    : 0;

  const education = [];
  if (/bachelor|\bbs\b|\bb\.s\./i.test(jobDescription)) education.push('bachelor');
  if (/master|\bms\b|\bm\.s\.|mba/i.test(jobDescription)) education.push('master');
  if (/computer science/i.test(jobDescription)) education.push('computer science');
  if (/data science/i.test(jobDescription)) education.push('data science');

  return { skills: [...found], yearsRequired, education };
};

const computeAtsScore = (jobDescription) => {
  const requirements = extractJobRequirements(jobDescription);
  const matchedSkills = requirements.skills.filter((skill) => (
    profileIndex.explicitSkills.has(skill) || includesPhrase(profileIndex.fullText, skill)
  ));
  const missingSkills = requirements.skills.filter((skill) => !matchedSkills.includes(skill));

  let skillRatio = requirements.skills.length
    ? matchedSkills.length / requirements.skills.length
    : 0;
  const wordCount = tokenize(jobDescription).length;
  if (requirements.skills.length <= 2 && wordCount > 40) skillRatio *= 0.15;
  else if (requirements.skills.length <= 4 && wordCount > 50) skillRatio *= 0.4;

  const jobTerms = [...new Set(tokenize(jobDescription))];
  const contextualHits = jobTerms.filter((term) => profileIndex.fullText.includes(term)).length;
  const contextRatio = jobTerms.length ? contextualHits / jobTerms.length : 0;

  const skillScore = skillRatio * 60;
  const contextScore = Math.min(contextRatio * 1.5, 1) * 25;
  const educationScore = requirements.education.length
    ? (requirements.education.filter((term) => profileIndex.fullText.includes(term)).length / requirements.education.length) * 10
    : 8;
  const candidateYears = 6;
  const experienceScore = requirements.yearsRequired
    ? Math.min(candidateYears / requirements.yearsRequired, 1) * 5
    : 4;

  return {
    score: Math.max(0, Math.min(100, Math.round(skillScore + contextScore + educationScore + experienceScore))),
    matchedSkills,
    missingSkills,
    breakdown: {
      skills: Math.round(skillScore * 10) / 10,
      context: Math.round(contextScore * 10) / 10,
      education: Math.round(educationScore * 10) / 10,
      experience: Math.round(experienceScore * 10) / 10,
    },
  };
};

const retrieveRelevantChunks = (jobDescription, limit = 9) => {
  const queryTerms = new Set(tokenize(jobDescription));
  const jobLower = jobDescription.toLowerCase();

  return profileIndex.chunks
    .map((chunk) => {
      const chunkTerms = new Set(tokenize(chunk.text));
      let score = [...queryTerms].reduce((total, term) => total + (chunkTerms.has(term) ? 1 : 0), 0);
      for (const skill of KNOWN_SKILLS) {
        if (includesPhrase(jobLower, skill) && includesPhrase(chunk.text, normalizeSkill(skill))) score += 4;
      }
      if (chunk.category === 'experience') score += 0.25;
      return { ...chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const parseGroqJson = (content) => {
  try {
    return JSON.parse(content);
  } catch {}

  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch {}
  }

  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start !== -1 && end > start) return JSON.parse(content.slice(start, end + 1));
  throw new Error('Groq returned an unreadable response.');
};

const normalizeAnalysis = (result, ats, chunks) => {
  const bestFitPoints = Array.isArray(result.bestFitPoints)
    ? result.bestFitPoints.filter((point) => typeof point === 'string' && point.trim()).slice(0, 6)
    : [];
  const allowedSkills = new Set(ats.matchedSkills.map(normalizeSkill));
  const topSkills = Array.isArray(result.topSkills)
    ? result.topSkills
      .filter((item) => item && typeof item.skill === 'string' && typeof item.context === 'string')
      .filter((item) => !allowedSkills.size || allowedSkills.has(normalizeSkill(item.skill)))
      .slice(0, 6)
    : [];

  if (!bestFitPoints.length) {
    bestFitPoints.push(...chunks.slice(0, 5).map((chunk) => chunk.text));
  }
  if (!topSkills.length) {
    const fallbackSkills = ats.matchedSkills.length
      ? ats.matchedSkills
      : [...profileIndex.explicitSkills].filter((skill) => includesPhrase(chunks.map((chunk) => chunk.text).join(' '), skill));
    topSkills.push(...fallbackSkills.slice(0, 6).map((skill) => ({
      skill,
      context: chunks.find((chunk) => includesPhrase(chunk.text, skill))?.text || 'Demonstrated across Vikram’s portfolio experience and projects.',
    })));
  }

  return {
    matchScore: ats.score,
    bestFitPoints: bestFitPoints.slice(0, 6),
    topSkills: topSkills.slice(0, 6),
  };
};

const checkRateLimit = (request) => {
  const clientId = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'anonymous';
  const now = Date.now();
  const bucket = requestBuckets.get(clientId);
  if (!bucket || now - bucket.startedAt >= REQUEST_WINDOW_MS) {
    requestBuckets.set(clientId, { count: 1, startedAt: now });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= REQUEST_LIMIT;
};

const jsonResponse = (payload, status = 200) => Response.json(payload, {
  status,
  headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
});

export function GET() {
  return jsonResponse({
    status: 'ok',
    service: 'portfolio-rag',
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
  });
}

export async function POST(request) {
  if (!checkRateLimit(request)) {
    return jsonResponse({ detail: 'Too many analyses. Please wait a minute and try again.' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ detail: 'The request body must be valid JSON.' }, 400);
  }

  const jobDescription = typeof body?.job_description === 'string'
    ? body.job_description.trim()
    : '';
  if (jobDescription.length < 50 || jobDescription.length > 10_000) {
    return jsonResponse({ detail: 'Paste a job description between 50 and 10,000 characters.' }, 422);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse({
      detail: 'The AI analyzer is not configured yet. Add GROQ_API_KEY to this Vercel project and redeploy.',
      code: 'GROQ_API_KEY_MISSING',
    }, 503);
  }

  const ats = computeAtsScore(jobDescription);
  const chunks = retrieveRelevantChunks(jobDescription);
  const matched = ats.matchedSkills.join(', ') || 'No direct tool match detected';
  const missing = ats.missingSkills.join(', ') || 'None detected';
  const context = chunks.map((chunk) => `[${chunk.category.toUpperCase()}] ${chunk.text}`).join('\n\n');

  const systemPrompt = [
    'You are a careful career advisor producing a grounded job-match analysis.',
    'Use only the candidate context supplied. Never invent experience, metrics, or skills.',
    'The deterministic ATS score is authoritative and must be returned unchanged.',
    'Return only valid JSON with matchScore, bestFitPoints, and topSkills.',
  ].join(' ');

  const userPrompt = `DETERMINISTIC ATS RESULT\nMatch score: ${ats.score}%\nMatched skills: ${matched}\nMissing skills: ${missing}\nScore breakdown: ${JSON.stringify(ats.breakdown)}\n\nJOB DESCRIPTION\n${jobDescription}\n\nRETRIEVED PORTFOLIO CONTEXT\n${context}\n\nReturn this exact JSON shape:\n{\n  "matchScore": ${ats.score},\n  "bestFitPoints": ["5-6 concise, specific, grounded points"],\n  "topSkills": [{"skill": "a matched skill", "context": "specific proof from the retrieved context"}]\n}\nUse only matched skills in topSkills. If the match is weak, be candid and describe transferable evidence without fabricating a direct match.`;

  let groqResponse;
  try {
    groqResponse = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.25,
        max_tokens: 1800,
        response_format: { type: 'json_object' },
      }),
      signal: request.signal,
    });
  } catch (error) {
    console.error('Groq network error', error);
    return jsonResponse({ detail: 'The AI service could not be reached. Please try again.' }, 502);
  }

  if (!groqResponse.ok) {
    const diagnostic = await groqResponse.text();
    console.error(`Groq API error ${groqResponse.status}: ${diagnostic.slice(0, 240)}`);
    if (groqResponse.status === 401 || groqResponse.status === 403) {
      return jsonResponse({ detail: 'The Groq API key is invalid or inactive. Update GROQ_API_KEY in Vercel and redeploy.' }, 502);
    }
    if (groqResponse.status === 429) {
      return jsonResponse({ detail: 'The AI service is busy or the Groq quota is exhausted. Please try again shortly.' }, 429);
    }
    return jsonResponse({ detail: 'The AI service returned an error. Please try again.' }, 502);
  }

  try {
    const data = await groqResponse.json();
    const parsed = parseGroqJson(data?.choices?.[0]?.message?.content || '');
    return jsonResponse(normalizeAnalysis(parsed, ats, chunks));
  } catch (error) {
    console.error('Groq response parsing error', error);
    return jsonResponse({ detail: 'The AI response could not be validated. Please try again.' }, 502);
  }
}
