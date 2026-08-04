import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const C = {
  paper: '#F3EEDF',
  ink: '#18233A',
  cobalt: '#2E5BFF',
  coral: '#FF5C45',
  teal: '#18B99B',
  gold: '#DDA62E',
  white: '#FFFDF7',
  quiet: '#687286',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const graphNodes = [
  {id: 'goal', x: 94, y: 57, label: 'GOAL', sub: 'Community outings', color: C.teal, delay: 54},
  {id: 'patient', x: 250, y: 130, label: 'P001', sub: 'Daniel Harper', color: C.cobalt, delay: 38, hero: true},
  {id: 'anxiety', x: 410, y: 53, label: 'BARRIER', sub: 'Anxiety', color: C.coral, delay: 69},
  {id: 'note', x: 429, y: 166, label: 'DAILY NOTE', sub: 'Outing refused', color: C.gold, delay: 93},
  {id: 'plan', x: 90, y: 205, label: 'SUPPORT', sub: 'Visual schedule', color: '#845FE8', delay: 108},
  {id: 'intervention', x: 260, y: 244, label: 'ACTION', sub: 'Coping supports', color: C.teal, delay: 122},
];

const graphEdges = [
  {from: 'patient', to: 'goal', delay: 50},
  {from: 'patient', to: 'anxiety', delay: 66},
  {from: 'patient', to: 'note', delay: 90},
  {from: 'patient', to: 'plan', delay: 104},
  {from: 'patient', to: 'intervention', delay: 118},
  {from: 'goal', to: 'anxiety', delay: 82},
  {from: 'goal', to: 'plan', delay: 116},
  {from: 'anxiety', to: 'note', delay: 102},
  {from: 'plan', to: 'intervention', delay: 132},
];

const nodeById = Object.fromEntries(graphNodes.map((node) => [node.id, node]));

const CornerMark = ({right = false, bottom = false}) => (
  <div
    style={{
      position: 'absolute',
      width: 14,
      height: 14,
      [right ? 'right' : 'left']: 10,
      [bottom ? 'bottom' : 'top']: 10,
      borderTop: bottom ? 'none' : `1px solid ${C.ink}`,
      borderBottom: bottom ? `1px solid ${C.ink}` : 'none',
      borderLeft: right ? 'none' : `1px solid ${C.ink}`,
      borderRight: right ? `1px solid ${C.ink}` : 'none',
      opacity: 0.35,
    }}
  />
);

const GraphEdge = ({edge, frame}) => {
  const from = nodeById[edge.from];
  const to = nodeById[edge.to];
  const progress = interpolate(frame, [edge.delay, edge.delay + 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={C.ink}
      strokeWidth="1.25"
      strokeDasharray="1"
      pathLength="1"
      strokeDashoffset={1 - progress}
      opacity={0.18 + progress * 0.3}
    />
  );
};

const GraphNode = ({node, frame, fps}) => {
  const reveal = spring({
    frame: frame - node.delay,
    fps,
    config: {damping: 17, stiffness: 190},
  });
  const focus = interpolate(
    frame,
    [node.delay + 8, node.delay + 18, node.delay + 31],
    [0, 1, 0],
    clamp,
  );
  const width = node.hero ? 92 : 84;
  const height = node.hero ? 58 : 49;

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x - width / 2,
        top: node.y - height / 2,
        width,
        height,
        borderRadius: node.hero ? 16 : 11,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10px',
        boxSizing: 'border-box',
        transform: `scale(${0.68 + reveal * 0.32}) rotate(${(1 - reveal) * -4}deg)`,
        opacity: reveal,
        background: C.white,
        border: `${node.hero ? 2 : 1.5}px solid ${node.color}`,
        boxShadow: `0 8px 0 rgba(24,35,58,0.08), 0 0 ${18 * focus}px ${node.color}44`,
      }}
    >
      <div
        style={{
          color: node.color,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: node.hero ? 11 : 8,
          fontWeight: 800,
          letterSpacing: 1.2,
        }}
      >
        {node.label}
      </div>
      <div
        style={{
          marginTop: 3,
          color: C.ink,
          fontFamily: '"Palatino Linotype", serif',
          fontSize: node.hero ? 11 : 9.5,
          lineHeight: 1.05,
        }}
      >
        {node.sub}
      </div>
    </div>
  );
};

const SearchPulse = ({frame}) => {
  const routes = [
    {from: nodeById.patient, to: nodeById.goal, start: 72, color: C.cobalt},
    {from: nodeById.goal, to: nodeById.anxiety, start: 101, color: C.coral},
    {from: nodeById.anxiety, to: nodeById.note, start: 127, color: C.gold},
  ];

  return routes.map((route, index) => {
    const progress = interpolate(frame, [route.start, route.start + 22], [0, 1], clamp);
    const opacity = interpolate(
      frame,
      [route.start, route.start + 4, route.start + 18, route.start + 22],
      [0, 1, 1, 0],
      clamp,
    );
    const x = route.from.x + (route.to.x - route.from.x) * progress;
    const y = route.from.y + (route.to.y - route.from.y) * progress;

    return (
      <circle
        key={index}
        cx={x}
        cy={y}
        r="5"
        fill={route.color}
        opacity={opacity}
        style={{filter: `drop-shadow(0 0 5px ${route.color})`}}
      />
    );
  });
};

const EvidenceCard = ({number, section, score, text, color, delay, rotation, frame, fps}) => {
  const reveal = spring({
    frame: frame - delay,
    fps,
    config: {damping: 19, stiffness: 170},
  });

  return (
    <div
      style={{
        position: 'relative',
        border: `1.5px solid ${C.ink}`,
        padding: '10px 11px 9px',
        background: C.white,
        boxShadow: '5px 6px 0 rgba(24,35,58,0.11)',
        transform: `translateX(${(1 - reveal) * 75}px) rotate(${rotation * reveal}deg)`,
        opacity: reveal,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 7,
          height: 7,
          borderRadius: '50%',
          top: 7,
          left: '50%',
          background: color,
          border: `1px solid ${C.ink}`,
          boxShadow: '0 2px 0 rgba(24,35,58,0.14)',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: C.quiet,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 7.5,
          letterSpacing: 1.1,
        }}
      >
        <span style={{color, fontWeight: 800}}>[{number}] {section}</span>
        <span>TF-IDF {score}</span>
      </div>
      <div
        style={{
          marginTop: 7,
          color: C.ink,
          fontFamily: '"Palatino Linotype", serif',
          fontSize: 10.5,
          lineHeight: 1.18,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Citation = ({children, number, color, delay, frame}) => {
  const reveal = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
  return (
    <span style={{opacity: reveal}}>
      {children}
      <sup
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          marginLeft: 3,
          width: 15,
          height: 15,
          borderRadius: 4,
          background: color,
          color: C.white,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 7,
          fontWeight: 800,
          verticalAlign: 'top',
        }}
      >
        {number}
      </sup>
    </span>
  );
};

export const GraphRagHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const question = 'Which Life Plan goals are at risk?';
  const typed = question.slice(
    0,
    Math.floor(interpolate(frame, [4, 39], [0, question.length], clamp)),
  );
  const cursor = frame < 45 && Math.floor(frame / 5) % 2 === 0;
  const panelIn = spring({
    frame: frame - 28,
    fps,
    config: {damping: 200},
    durationInFrames: 25,
  });
  const answerIn = spring({
    frame: frame - 188,
    fps,
    config: {damping: 18, stiffness: 160},
  });
  const traceStamp = spring({
    frame: frame - 216,
    fps,
    config: {damping: 13, stiffness: 220},
  });
  const fade = interpolate(frame, [252, 269], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const scanX = interpolate(frame, [46, 178], [28, 548], clamp);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: C.paper,
        color: C.ink,
        opacity: fade,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage:
            'radial-gradient(rgba(24,35,58,0.22) 0.6px, transparent 0.7px)',
          backgroundSize: '5px 5px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 15,
          background: C.cobalt,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 23,
          top: 18,
          color: C.coral,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: 1.8,
        }}
      >
        CASE 001 / ANSWER TRACE
      </div>
      <div
        style={{
          position: 'absolute',
          right: 27,
          top: 17,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 7.5,
          letterSpacing: 1.2,
          color: C.quiet,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: C.teal,
            boxShadow: `0 0 0 4px ${C.teal}22`,
          }}
        />
        SYNTHETIC RECORDS · TRACE MODE ON
      </div>

      <div
        style={{
          position: 'absolute',
          left: 23,
          right: 27,
          top: 39,
          height: 43,
          borderTop: `1px solid ${C.ink}`,
          borderBottom: `1px solid ${C.ink}`,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,253,247,0.56)',
        }}
      >
        <div
          style={{
            width: 78,
            color: C.quiet,
            fontFamily: 'Bahnschrift, sans-serif',
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: 1.4,
          }}
        >
          QUESTION
        </div>
        <div
          style={{
            fontFamily: '"Palatino Linotype", serif',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: -0.3,
          }}
        >
          {typed}
          <span style={{color: C.cobalt, opacity: cursor ? 1 : 0}}>▌</span>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            padding: '5px 9px',
            border: `1px solid ${C.ink}`,
            background: C.cobalt,
            color: C.white,
            fontFamily: 'Bahnschrift, sans-serif',
            fontSize: 7.5,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: interpolate(frame, [34, 44], [0, 1], clamp),
          }}
        >
          FOLLOW THE EVIDENCE →
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 23,
          top: 94,
          width: 525,
          height: 272,
          border: `1.5px solid ${C.ink}`,
          background: 'rgba(255,253,247,0.76)',
          transform: `translateY(${(1 - panelIn) * 18}px)`,
          opacity: panelIn,
          overflow: 'hidden',
        }}
      >
        <CornerMark />
        <CornerMark right />
        <CornerMark bottom />
        <CornerMark right bottom />
        <div
          style={{
            position: 'absolute',
            left: 13,
            top: 10,
            zIndex: 3,
            padding: '4px 7px',
            background: C.ink,
            color: C.white,
            fontFamily: 'Bahnschrift, sans-serif',
            fontSize: 7,
            fontWeight: 800,
            letterSpacing: 1.4,
          }}
        >
          REASONING SUBGRAPH
        </div>
        <svg
          width="525"
          height="272"
          viewBox="0 0 525 272"
          style={{position: 'absolute', inset: 0}}
        >
          {graphEdges.map((edge) => (
            <GraphEdge key={`${edge.from}-${edge.to}`} edge={edge} frame={frame} />
          ))}
          <SearchPulse frame={frame} />
        </svg>
        {graphNodes.map((node) => (
          <GraphNode key={node.id} node={node} frame={frame} fps={fps} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: scanX,
            top: 0,
            width: 1,
            height: '100%',
            opacity: frame > 43 && frame < 180 ? 0.35 : 0,
            background: C.cobalt,
            boxShadow: `0 0 15px 2px ${C.cobalt}55`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 12,
            bottom: 10,
            fontFamily: 'Bahnschrift, sans-serif',
            fontSize: 7,
            letterSpacing: 1,
            color: C.quiet,
          }}
        >
          6 NODES · 9 RELATIONSHIPS
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 565,
          right: 27,
          top: 94,
          height: 272,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            borderBottom: `1px solid ${C.ink}`,
            paddingBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            RETRIEVED RECEIPTS
          </span>
          <span
            style={{
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: 7,
              color: C.quiet,
            }}
          >
            RANKED BY RELEVANCE
          </span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <EvidenceCard
            number="01"
            section="GOALS"
            score=".47"
            text="Community outings twice weekly · status: At Risk."
            color={C.teal}
            delay={125}
            rotation={-0.6}
            frame={frame}
            fps={fps}
          />
          <EvidenceCard
            number="02"
            section="DAILY NOTES"
            score=".31"
            text="Outing refused after anxiety before departure."
            color={C.gold}
            delay={146}
            rotation={0.5}
            frame={frame}
            fps={fps}
          />
          <EvidenceCard
            number="03"
            section="SUPPORT PLAN"
            score=".24"
            text="Use visual schedule 30 minutes before outings."
            color="#845FE8"
            delay={167}
            rotation={-0.35}
            frame={frame}
            fps={fps}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 23,
          right: 27,
          bottom: 20,
          height: 63,
          display: 'grid',
          gridTemplateColumns: '105px 1fr 130px',
          border: `1.5px solid ${C.ink}`,
          background: C.white,
          boxShadow: '7px 7px 0 rgba(46,91,255,0.14)',
          transform: `translateY(${(1 - answerIn) * 70}px)`,
          opacity: answerIn,
        }}
      >
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            background: C.coral,
            color: C.white,
            borderRight: `1.5px solid ${C.ink}`,
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div
              style={{
                fontFamily: 'Bahnschrift, sans-serif',
                fontSize: 7,
                fontWeight: 800,
                letterSpacing: 1.2,
              }}
            >
              GOAL STATUS
            </div>
            <div
              style={{
                marginTop: 2,
                fontFamily: '"Palatino Linotype", serif',
                fontSize: 19,
                fontWeight: 800,
              }}
            >
              AT RISK
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '9px 13px',
            fontFamily: '"Palatino Linotype", serif',
            fontSize: 12.5,
            lineHeight: 1.38,
          }}
        >
          <Citation number="01" color={C.teal} delay={195} frame={frame}>
            Community outings are slipping
          </Citation>{' '}
          — linked to{' '}
          <Citation number="02" color={C.gold} delay={204} frame={frame}>
            pre-outing anxiety
          </Citation>{' '}
          with a documented{' '}
          <Citation number="03" color="#845FE8" delay={212} frame={frame}>
            visual-schedule support
          </Citation>
          .
        </div>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            borderLeft: `1px dashed ${C.ink}`,
            transform: `rotate(${(1 - traceStamp) * -7}deg) scale(${0.72 + traceStamp * 0.28})`,
            opacity: traceStamp,
          }}
        >
          <div
            style={{
              width: 102,
              padding: '7px 4px',
              border: `2px solid ${C.cobalt}`,
              color: C.cobalt,
              textAlign: 'center',
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            TRACE COMPLETE
            <div
              style={{
                marginTop: 3,
                fontSize: 6.5,
                letterSpacing: 0.6,
                color: C.quiet,
              }}
            >
              3 CLAIMS · 3 SOURCES
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
