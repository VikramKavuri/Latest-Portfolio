import React, { useRef, useState, useEffect, useCallback } from 'react';

const SNIPPETS = [
  {
    label: 'pipeline.py',
    lines: [
      { text: '$ python run_pipeline.py --env prod', type: 'command' },
      { text: '>>> Connecting to Snowflake warehouse...', type: 'info' },
      { text: '>>> Extracting 2.4M records from source...', type: 'info' },
      { text: '>>> Transform: bronze → silver → gold', type: 'info' },
      { text: '>>> Loading to analytics schema... done.', type: 'info' },
      { text: '>>> Pipeline completed in 47.3s ✓', type: 'success' },
    ],
  },
  {
    label: 'query.sql',
    lines: [
      { text: 'SELECT customer_segment,', type: 'keyword' },
      { text: '       COUNT(*) as total,', type: 'default' },
      { text: '       AVG(lifetime_value) as ltv,', type: 'default' },
      { text: '       SUM(revenue) as revenue', type: 'default' },
      { text: 'FROM analytics.customer_360', type: 'keyword' },
      { text: 'GROUP BY customer_segment', type: 'keyword' },
      { text: 'ORDER BY revenue DESC;', type: 'keyword' },
      { text: '-- 7 rows returned (0.34s)', type: 'success' },
    ],
  },
];

const TYPE_COLORS = {
  command: '#B8860B',
  keyword: '#B8860B',
  info: '#C5CAD9',
  success: '#5CB85C',
  default: '#C5CAD9',
};

const TYPING_SPEED = 28;
const LINE_DELAY = 350;
const SNIPPET_PAUSE = 3000;

export default function LiveCodeTerminal({ className = '' }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timerRef = useRef(null);

  // IntersectionObserver to start
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const snippet = SNIPPETS[snippetIndex];

  // Typing effect
  useEffect(() => {
    if (!started) return;

    const lines = snippet.lines;

    if (currentLineIdx >= lines.length) {
      // All lines typed, pause then move to next snippet
      timerRef.current = setTimeout(() => {
        const next = (snippetIndex + 1) % SNIPPETS.length;
        setSnippetIndex(next);
        setCompletedLines([]);
        setCurrentLineText('');
        setCurrentLineIdx(0);
      }, SNIPPET_PAUSE);
      return () => clearTimeout(timerRef.current);
    }

    const line = lines[currentLineIdx].text;
    let charIdx = 0;

    const typeChar = () => {
      if (charIdx <= line.length) {
        setCurrentLineText(line.slice(0, charIdx));
        charIdx++;
        timerRef.current = setTimeout(typeChar, TYPING_SPEED);
      } else {
        // Line complete
        setCompletedLines((prev) => [...prev, lines[currentLineIdx]]);
        setCurrentLineText('');
        timerRef.current = setTimeout(() => {
          setCurrentLineIdx((prev) => prev + 1);
        }, LINE_DELAY);
      }
    };

    timerRef.current = setTimeout(typeChar, LINE_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [started, snippetIndex, currentLineIdx, snippet]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  const currentLineType =
    currentLineIdx < snippet.lines.length ? snippet.lines[currentLineIdx].type : 'default';

  return (
    <div ref={ref} className={`${className}`}>
      <div
        className="overflow-hidden"
        style={{ background: '#1a2744', border: '1px solid rgba(44,74,114,0.3)' }}
      >
        {/* Terminal chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-4 px-3 py-0.5 text-[10px] font-body text-gold/70 bg-white/5 tracking-wide">
            {snippet.label}
          </div>
        </div>

        {/* Terminal body */}
        <div className="p-4 min-h-[180px] font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
          {/* Completed lines */}
          {completedLines.map((line, i) => (
            <div key={i} style={{ color: TYPE_COLORS[line.type] || TYPE_COLORS.default }}>
              {line.text}
            </div>
          ))}

          {/* Current typing line */}
          {currentLineIdx < snippet.lines.length && (
            <div style={{ color: TYPE_COLORS[currentLineType] }}>
              {currentLineText}
              <span
                className="inline-block w-[7px] h-[14px] ml-px align-middle"
                style={{
                  background: '#B8860B',
                  opacity: showCursor ? 1 : 0,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
