// Story content for the About section.
// Voice: conversational, a little personality, crisp — like I'm talking to you,
// not narrating an article. Each beat's cutout visual on the left matches the words.

export const about = {
  opening: "Look — there are thousands of data engineers. I'm the one you actually want when the decision matters.",

  portrait: '/portrait/vikram.webp',
  portraitInitials: 'VK',

  chapters: [
    {
      id: 'fragmented-systems',
      kicker: 'The problem',
      visual: 'fragmented-systems',
      headline: 'Most companies run on partial truths.',
      body: [
        'Entity records in one place, transactions in another, activity signals somewhere else, and engagement history off to the side. Each system tells the truth locally, but the business still has to decide globally.',
      ],
    },
    {
      id: 'reconciled-records',
      kicker: 'The fix',
      visual: 'reconciled-records',
      headline: 'First, I reconcile the records.',
      body: [
        'The work starts with identity, grain, lineage, and definitions. Customers, accounts, orders, events, tickets, campaigns, payments, claims — different names, one shared record of what happened.',
      ],
    },
    {
      id: 'trusted-business-view',
      kicker: 'What I build',
      visual: 'trusted-business-view',
      headline: 'I make them tell one story.',
      body: [
        'I turn entity, transaction, activity, and engagement data into one trusted business view — the place teams can point to when the number has to be right.',
      ],
    },
    {
      id: 'faster-decisions',
      kicker: 'The result',
      visual: 'faster-decisions',
      headline: 'Then I make it fast.',
      body: [
        'Once the business view is trusted, decisions move faster. Reports that took four hours now take forty-five minutes. Queries that used to crawl run 85% faster.',
      ],
      proof: [
        { value: '85%', label: 'Faster queries' },
        { value: '4h→45m', label: 'Report runtime' },
      ],
    },
    {
      id: 'audit-ready-confidence',
      kicker: 'Trust',
      visual: 'audit-ready-confidence',
      headline: "Fast isn't enough — it has to hold up.",
      body: [
        'The view needs lineage, checks, and explainability built in. Accurate, audit-ready, and calm under pressure — the kind of number you can stake a decision on.',
      ],
      proof: [
        { value: '87%', label: 'ML accuracy, in production' },
        { value: '0', label: 'Audit findings' },
        { value: '40%', label: 'Billing backlog cut' },
      ],
    },
    {
      id: 'optimal-insight',
      kicker: 'Why me',
      visual: 'optimal-insight',
      headline: "Tools are cheap. Judgment isn't.",
      body: [
        'Anyone can stand up a pipeline. I find the insight that actually moves the needle — and I won’t settle for “it works” when “optimal” is still on the table.',
      ],
    },
  ],

  close: 'Optimal insights. Nothing less.',
  closeHint: 'Keep scrolling — the work speaks next.',
};
