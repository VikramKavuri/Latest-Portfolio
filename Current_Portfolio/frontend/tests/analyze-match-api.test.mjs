import assert from 'node:assert/strict';
import test from 'node:test';

import { GET, POST } from '../api/analyze-match.mjs';

const jobDescription = `Data Analytics Engineer with 4+ years of experience building Python and SQL data pipelines. The role requires Snowflake, Power BI, data quality, AWS, and stakeholder-facing analytics for healthcare operations.`;

test('health response reports configuration without exposing the key', async () => {
  delete process.env.GROQ_API_KEY;
  const response = GET();
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.service, 'portfolio-rag');
  assert.equal(payload.groqConfigured, false);
  assert.equal('apiKey' in payload, false);
});

test('analysis explains a missing Groq configuration', async () => {
  delete process.env.GROQ_API_KEY;
  const request = new Request('https://portfolio.test/api/analyze-match', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-missing-key' },
    body: JSON.stringify({ job_description: jobDescription }),
  });
  const response = await POST(request);
  const payload = await response.json();

  assert.equal(response.status, 503);
  assert.equal(payload.code, 'GROQ_API_KEY_MISSING');
});

test('analysis calls Groq and enforces the deterministic ATS score', async () => {
  process.env.GROQ_API_KEY = 'test-key';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    return Response.json({
      choices: [{
        message: {
          content: JSON.stringify({
            matchScore: 1,
            bestFitPoints: ['Built governed Python and SQL pipelines supporting operational analytics.'],
            topSkills: [{ skill: 'python', context: 'Used Python for reliable healthcare data pipelines and quality controls.' }],
          }),
        },
      }],
    });
  };

  try {
    const request = new Request('https://portfolio.test/api/analyze-match', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-success' },
      body: JSON.stringify({ job_description: jobDescription }),
    });
    const response = await POST(request);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.ok(payload.matchScore > 1);
    assert.ok(payload.bestFitPoints.length > 0);
    assert.ok(payload.topSkills.length > 0);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GROQ_API_KEY;
  }
});
