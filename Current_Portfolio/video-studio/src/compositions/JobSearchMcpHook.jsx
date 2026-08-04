import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  ink: '#141412',
  paper: '#F4EEDF',
  acid: '#E6FF4A',
  cyan: '#39D9D2',
  coral: '#FF695B',
  white: '#FFFDF5',
  quiet: '#A6A294',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const show = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const hide = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const mono = '"Lucida Console", "Courier New", monospace';
const display = '"Arial Black", "Franklin Gothic Heavy", Impact, sans-serif';

const Grid = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(244,238,223,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(244,238,223,.045) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 18,
        top: 18,
        right: 18,
        bottom: 18,
        border: `1px solid ${COLORS.quiet}35`,
      }}
    />
  </>
);

const Crosshair = ({x, y, color = COLORS.acid}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 18, height: 18}}>
    <div style={{position: 'absolute', left: 8, top: 0, width: 2, height: 18, background: color}} />
    <div style={{position: 'absolute', left: 0, top: 8, width: 18, height: 2, background: color}} />
  </div>
);

const Pill = ({children, color = COLORS.acid, dark = true, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '7px 10px 6px',
      background: color,
      color: dark ? COLORS.ink : COLORS.white,
      fontFamily: mono,
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: 1,
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </div>
);

const CommandScene = ({frame, fps}) => {
  const enter = spring({frame, fps, config: {damping: 15, stiffness: 130}});
  const out = hide(frame, 55, 67);
  const typed =
    'Find remote data engineering roles matching Python, Spark and SQL.';
  const chars = Math.floor(
    interpolate(frame, [10, 47], [0, typed.length], clamp),
  );
  const scan = interpolate(frame, [0, 67], [-100, 100], clamp);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          top: 42,
          left: 54,
          transform: `translateY(${(1 - enter) * 18}px)`,
        }}
      >
        <Pill>MCP // CAREER INTELLIGENCE</Pill>
        <div
          style={{
            marginTop: 15,
            fontFamily: display,
            fontSize: 51,
            letterSpacing: -2.6,
            lineHeight: 0.92,
            color: COLORS.paper,
            width: 600,
          }}
        >
          TURN A SEARCH
          <br />
          INTO A <span style={{color: COLORS.acid}}>DOSSIER.</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 54,
          right: 54,
          bottom: 48,
          height: 116,
          border: `2px solid ${COLORS.paper}`,
          background: '#1E1E1A',
          boxShadow: `9px 9px 0 ${COLORS.cyan}`,
        }}
      >
        <div
          style={{
            height: 29,
            borderBottom: `1px solid ${COLORS.quiet}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            color: COLORS.quiet,
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: 1.2,
          }}
        >
          <span>TOOL CALL / jobs_search</span>
          <span style={{color: COLORS.cyan}}>CONNECTED</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '17px 17px',
            color: COLORS.white,
            fontFamily: mono,
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          <span style={{color: COLORS.acid}}>&gt;</span>
          <span>{typed.slice(0, chars)}</span>
          <span
            style={{
              width: 9,
              height: 21,
              background: frame % 18 < 10 ? COLORS.acid : 'transparent',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${scan}%`,
            width: 70,
            height: '100%',
            opacity: 0.08,
            background: COLORS.acid,
            transform: 'skewX(-16deg)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SOURCES = [
  {name: 'REMOTIVE', color: COLORS.cyan},
  {name: 'THE MUSE', color: COLORS.acid},
  {name: 'ARBEITNOW', color: COLORS.coral},
  {name: 'REMOTEOK', color: '#BDA7FF'},
  {name: 'JOBICY', color: '#FFB54A'},
];

const SourceLane = ({source, index, frame, fps}) => {
  const delay = 62 + index * 5;
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 170},
  });
  const packet = interpolate(
    frame,
    [delay + 8, delay + 46],
    [0, 1],
    clamp,
  );
  return (
    <div
      style={{
        position: 'relative',
        height: 45,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -38}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 6,
          width: 105,
          height: 31,
          border: `1px solid ${source.color}`,
          color: COLORS.paper,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          fontFamily: mono,
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: 0.8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: source.color,
            marginRight: 8,
            boxShadow: `0 0 10px ${source.color}`,
          }}
        />
        {source.name}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 105,
          right: 0,
          top: 21,
          height: 1,
          background: `${source.color}66`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 111 + packet * 232,
          top: 15,
          width: 14,
          height: 14,
          background: source.color,
          transform: 'rotate(45deg)',
          boxShadow: `0 0 12px ${source.color}`,
        }}
      />
    </div>
  );
};

const IntakeScene = ({frame, fps}) => {
  const sceneIn = show(frame, 55, 68);
  const sceneOut = hide(frame, 137, 150);
  const hub = spring({
    frame: frame - 77,
    fps,
    config: {damping: 12, stiffness: 115},
  });
  const dedupe = spring({
    frame: frame - 112,
    fps,
    config: {damping: 11, stiffness: 170},
  });

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <div style={{position: 'absolute', left: 50, top: 35}}>
        <Pill color={COLORS.cyan}>01 // LIVE INTAKE</Pill>
        <div
          style={{
            marginTop: 10,
            color: COLORS.paper,
            fontFamily: display,
            fontSize: 34,
            letterSpacing: -1.3,
          }}
        >
          FIVE SOURCES. ONE SIGNAL.
        </div>
      </div>

      <div style={{position: 'absolute', left: 50, top: 125, width: 362}}>
        {SOURCES.map((source, index) => (
          <SourceLane
            key={source.name}
            source={source}
            index={index}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 62,
          top: 123,
          width: 365,
          height: 257,
          background: COLORS.paper,
          color: COLORS.ink,
          border: `2px solid ${COLORS.ink}`,
          boxShadow: `10px 10px 0 ${COLORS.coral}`,
          transform: `scale(${0.85 + hub * 0.15}) rotate(${(1 - hub) * 2}deg)`,
          opacity: hub,
        }}
      >
        <div
          style={{
            height: 40,
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: COLORS.ink,
            color: COLORS.paper,
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          <span>NORMALIZE + VERIFY</span>
          <span style={{color: COLORS.acid}}>LIVE</span>
        </div>
        {[
          ['Senior Data Engineer', 'Python · Spark · SQL'],
          ['Senior Data Engineer', 'duplicate candidate'],
          ['Lakehouse Engineer', 'Databricks · ETL'],
          ['Analytics Engineer', 'SQL · dbt'],
        ].map((item, index) => {
          const rowIn = show(frame, 86 + index * 6, 94 + index * 6);
          const duplicate = index === 1;
          const collapse =
            duplicate
              ? interpolate(frame, [112, 126], [1, 0], clamp)
              : 1;
          return (
            <div
              key={`${item[0]}-${index}`}
              style={{
                height: 46 * collapse,
                overflow: 'hidden',
                borderBottom: `1px solid ${COLORS.ink}26`,
                padding: collapse > 0 ? '8px 12px' : 0,
                opacity: rowIn * collapse,
                transform: `translateX(${(1 - rowIn) * 25}px)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{fontFamily: display, fontSize: 13}}>
                    {item[0]}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 8,
                      color: duplicate ? '#A33931' : '#5D5B53',
                      marginTop: 3,
                    }}
                  >
                    {item[1]}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontWeight: 900,
                    fontSize: 8,
                    background: duplicate ? COLORS.coral : COLORS.cyan,
                    padding: '5px 6px',
                  }}
                >
                  {duplicate ? 'MERGE' : 'LINK ✓'}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 11,
            opacity: dedupe,
            fontFamily: mono,
            fontWeight: 900,
            fontSize: 10,
            color: '#3B675F',
          }}
        >
          DUPLICATE COLLAPSED ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ranks = [
  {
    rank: '01',
    role: 'SENIOR DATA ENGINEER',
    fit: 94,
    reason: 'Python · Spark · SQL',
    color: COLORS.acid,
  },
  {
    rank: '02',
    role: 'LAKEHOUSE ENGINEER',
    fit: 89,
    reason: 'Databricks · ETL',
    color: COLORS.cyan,
  },
  {
    rank: '03',
    role: 'ANALYTICS ENGINEER',
    fit: 82,
    reason: 'SQL · dbt',
    color: COLORS.coral,
  },
];

const RankingScene = ({frame, fps}) => {
  const sceneIn = show(frame, 139, 151);
  const sceneOut = hide(frame, 211, 224);
  const marker = interpolate(frame, [162, 193], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <div style={{position: 'absolute', left: 50, top: 35}}>
        <Pill color={COLORS.coral}>02 // FIT RANKING</Pill>
        <div
          style={{
            marginTop: 10,
            color: COLORS.paper,
            fontFamily: display,
            fontSize: 34,
            letterSpacing: -1.3,
          }}
        >
          SIGNAL, SORTED.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 122,
          width: 520,
        }}
      >
        {ranks.map((item, index) => {
          const card = spring({
            frame: frame - (150 + index * 9),
            fps,
            config: {damping: 14, stiffness: 160},
          });
          const bar = interpolate(
            frame,
            [165 + index * 7, 192 + index * 7],
            [0, item.fit],
            clamp,
          );
          return (
            <div
              key={item.rank}
              style={{
                position: 'relative',
                height: 76,
                marginBottom: 11,
                background: COLORS.paper,
                borderLeft: `11px solid ${item.color}`,
                padding: '10px 13px 9px 15px',
                opacity: card,
                transform: `translateX(${(1 - card) * -60}px)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 900,
                      color: '#777267',
                      fontSize: 10,
                    }}
                  >
                    {item.rank}
                  </span>
                  <span
                    style={{
                      fontFamily: display,
                      color: COLORS.ink,
                      fontSize: 17,
                    }}
                  >
                    {item.role}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: display,
                    color: COLORS.ink,
                    fontSize: 22,
                  }}
                >
                  {Math.round(bar)}
                  <span style={{fontSize: 9, marginLeft: 2}}>FIT</span>
                </span>
              </div>
              <div
                style={{
                  marginTop: 7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  fontFamily: mono,
                  fontWeight: 900,
                  fontSize: 9,
                  color: '#605D55',
                }}
              >
                <span>MATCH</span>
                <span>{item.reason}</span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: 4,
                  width: `${bar}%`,
                  background: item.color,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 52,
          top: 123,
          width: 250,
          height: 248,
          border: `2px solid ${COLORS.paper}`,
          padding: 17,
          color: COLORS.paper,
          transform: `rotate(${interpolate(marker, [0, 1], [2.5, 0])}deg)`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: COLORS.cyan,
            letterSpacing: 1.2,
          }}
        >
          TF-IDF // COSINE FIT
        </div>
        <div
          style={{
            marginTop: 13,
            fontFamily: display,
            fontSize: 33,
            lineHeight: 0.96,
          }}
        >
          WHY IT
          <br />
          MATCHES.
        </div>
        <div
          style={{
            marginTop: 17,
            fontFamily: mono,
            fontSize: 10,
            lineHeight: 1.65,
            color: '#D4D0C3',
          }}
        >
          ✓ PROFILE-SCORED
          <br />
          ✓ REASONS ATTACHED
          <br />
          ✓ LINKS VERIFIED
        </div>
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 17,
            background: COLORS.acid,
            color: COLORS.ink,
            textAlign: 'center',
            fontFamily: mono,
            fontWeight: 900,
            fontSize: 11,
            padding: '9px 4px 8px',
            transform: `scaleX(${marker})`,
            transformOrigin: 'left center',
          }}
        >
          DEMO RESULTS
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Document = ({title, children, color, frame, delay, x, rotate = 0}) => {
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 145},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 139,
        width: 210,
        height: 194,
        background: COLORS.paper,
        color: COLORS.ink,
        borderTop: `10px solid ${color}`,
        padding: '16px 15px',
        boxShadow: '7px 8px 0 rgba(0,0,0,.25)',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 75}px) rotate(${rotate * enter}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontWeight: 900,
          fontSize: 9,
          letterSpacing: 1,
          color: '#67635B',
        }}
      >
        GENERATED ARTIFACT
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: 20,
          lineHeight: 1,
          marginTop: 9,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 9,
          lineHeight: 1.55,
          marginTop: 13,
          color: '#5B5851',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const DossierScene = ({frame, fps}) => {
  const sceneIn = show(frame, 211, 224);
  const stamp = spring({
    frame: frame - 238,
    fps,
    config: {damping: 9, stiffness: 170},
  });
  const pulse = 1 + Math.sin(frame / 5) * 0.018;

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <div style={{position: 'absolute', left: 50, top: 31}}>
        <Pill>03 // DOSSIER ASSEMBLED</Pill>
        <div
          style={{
            marginTop: 9,
            fontFamily: display,
            fontSize: 36,
            color: COLORS.paper,
            letterSpacing: -1.4,
          }}
        >
          FROM “APPLY” TO <span style={{color: COLORS.acid}}>PREPARED.</span>
        </div>
      </div>

      <Document
        title="RANKED SHORTLIST"
        color={COLORS.acid}
        frame={frame}
        delay={216}
        x={62}
        rotate={-2}
      >
        01 — SENIOR DATA ENGINEER
        <br />
        02 — LAKEHOUSE ENGINEER
        <br />
        03 — ANALYTICS ENGINEER
      </Document>
      <Document
        title="COVER LETTER"
        color={COLORS.cyan}
        frame={frame}
        delay={224}
        x={294}
        rotate={1}
      >
        ROLE-AWARE DRAFT
        <br />
        PROFILE CONTEXT
        <br />
        EDITABLE OUTPUT
      </Document>
      <Document
        title="INTERVIEW Q&A"
        color={COLORS.coral}
        frame={frame}
        delay={232}
        x={526}
        rotate={-1}
      >
        JOB-SPECIFIC PROMPTS
        <br />
        ANSWER REHEARSAL
        <br />
        DEMO OR LIVE AI
      </Document>

      <div
        style={{
          position: 'absolute',
          right: 41,
          top: 150,
          width: 142,
          height: 142,
          borderRadius: '50%',
          border: `7px double ${COLORS.coral}`,
          color: COLORS.coral,
          background: '#141412F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: display,
          fontSize: 21,
          lineHeight: 0.92,
          opacity: stamp,
          transform: `scale(${stamp * pulse}) rotate(-9deg)`,
        }}
      >
        DOSSIER
        <br />
        READY
      </div>

      <div
        style={{
          position: 'absolute',
          left: 62,
          right: 62,
          bottom: 31,
          height: 56,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `1px solid ${COLORS.quiet}66`,
          paddingTop: 12,
          gap: 10,
        }}
      >
        {[
          ['5', 'PUBLIC SOURCES'],
          ['4', 'MCP TOOLS'],
          ['77', 'UNIT TESTS'],
          ['WEB · REST · MCP', 'ONE SERVICE LAYER'],
        ].map(([value, label], index) => (
          <div
            key={label}
            style={{
              borderLeft: `4px solid ${SOURCES[index]?.color || COLORS.acid}`,
              paddingLeft: 10,
              color: COLORS.paper,
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontSize: index === 3 ? 16 : 22,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 7,
                letterSpacing: 0.8,
                marginTop: 5,
                color: COLORS.quiet,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const JobSearchMcpHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        overflow: 'hidden',
      }}
    >
      <Grid />
      <div
        style={{
          position: 'absolute',
          inset: -100,
          opacity: 0.035,
          backgroundImage:
            'radial-gradient(circle, #fff 0.7px, transparent 0.8px)',
          backgroundSize: '7px 7px',
        }}
      />
      <Crosshair x={27} y={27} />
      <Crosshair x={855} y={415} color={COLORS.cyan} />
      <CommandScene frame={frame} fps={fps} />
      <IntakeScene frame={frame} fps={fps} />
      <RankingScene frame={frame} fps={fps} />
      <DossierScene frame={frame} fps={fps} />
      <div
        style={{
          position: 'absolute',
          top: 25,
          right: 30,
          fontFamily: mono,
          fontSize: 8,
          letterSpacing: 1.5,
          color: COLORS.quiet,
        }}
      >
        JOB SEARCH DOSSIER // MCP
      </div>
    </AbsoluteFill>
  );
};
