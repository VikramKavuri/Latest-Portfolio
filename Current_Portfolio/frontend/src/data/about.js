// Story content for the About section.
// Copy follows the approved About-section proof.

export const about = {
  openingEyebrow: 'Data Analytics Engineer',
  opening: 'Thousands of engineers can move data. I make it agree — then make it answer.',

  portrait: '/portrait/vikram.webp',
  portraitInitials: 'VK',

  chapters: [
    {
      id: 'fragmented-systems',
      kicker: 'The problem',
      visual: 'fragmented-systems',
      headline: "Your data doesn't disagree with reality. It disagrees with itself.",
      body: [
        'Client records live in the EHR, dollars in the ERP, staffing in the HRIS — three systems, three versions of the same person, no shared key. Each one is locally correct. Join them without resolving identity first and every dashboard downstream inherits the contradiction.',
      ],
    },
    {
      id: 'reconciled-records',
      kicker: 'The fix',
      visual: 'reconciled-records',
      headline: 'First, I make the records agree.',
      body: [
        'I pull all three through REST APIs into Airflow-orchestrated ELT that resolves identity, declares a grain, and deduplicates before anything lands. Conflicting sources become one conformed record of what actually happened — and the same person carries the same key in every table.',
      ],
    },
    {
      id: 'trusted-business-view',
      kicker: 'What I build',
      visual: 'trusted-business-view',
      headline: 'One model. One definition. Fifty people querying it.',
      body: [
        'A dimensional warehouse in Snowflake — star schemas, incremental loads, clustering on the keys people actually filter by — serving 50+ concurrent users. Every KPI resolves to exactly one definition, so finance and program leadership stop walking into the same meeting with different numbers.',
      ],
    },
    {
      id: 'faster-decisions',
      kicker: 'The result',
      visual: 'faster-decisions',
      headline: 'Fast enough to ask the follow-up question.',
      body: [
        "A Fortune 500 retailer's PySpark pipelines moved millions of records a day; materialized views cut their four-hour morning executive report to 45 minutes. On the warehouse side, query tuning and right-sized compute made ad-hoc Snowflake queries 85% faster for the teams who live in them all day. When an answer returns before you lose your train of thought, people stop settling for the first one.",
      ],
      proof: [
        { value: '85%', label: 'Faster ad-hoc queries' },
        { value: '4h→45m', label: 'Executive report runtime' },
        { value: '40%', label: 'Billing backlog cut' },
      ],
    },
    {
      id: 'audit-ready-confidence',
      kicker: 'Trust',
      visual: 'audit-ready-confidence',
      headline: "Fast is worthless if it can't survive an audit.",
      body: [
        'Healthcare data means HIPAA and FERPA governance is not a later phase — access controls, PHI handling, and traceability from source system to dashboard ship with the pipeline. Both audits closed with zero findings.',
        'That same constraint is why the model I fine-tuned for form extraction runs on-premise: LoRA on Qwen2.5-VL, 87% field accuracy across 10,000 handwritten documents, and not one page left the building.',
      ],
      proof: [
        { value: '0', label: 'HIPAA & FERPA audit findings' },
        { value: '87%', label: 'Field accuracy, 10K forms' },
      ],
    },
    {
      id: 'optimal-insight',
      kicker: 'Why me',
      visual: 'optimal-insight',
      headline: "Tools are cheap. Judgment isn't.",
      body: [
        'SQL, Python, Spark, Snowflake, Airflow — table stakes. The judgment is knowing that a report read once at 8am should be pre-computed overnight rather than queried live, and that the identical choice would be wrong for a billing queue someone works all day. Same warehouse, opposite answer.',
        "I don't stop at \"it works\" when \"optimal\" is still on the table.",
      ],
    },
  ],

  close: 'Optimal insights. Nothing less.',
  closeHint: 'Keep scrolling — the work speaks next.',
};
