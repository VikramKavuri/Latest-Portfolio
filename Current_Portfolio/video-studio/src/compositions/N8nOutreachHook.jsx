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
  paper: '#F6EEDF',
  paper2: '#FFF9EF',
  ink: '#211D39',
  coral: '#EA4B71',
  cobalt: '#5366F5',
  green: '#2FB36E',
  yellow: '#F2C94C',
  muted: '#7D746C',
  line: '#CFC3B3',
  white: '#FFFCF5',
};

const display = '"Cooper Black", "Bookman Old Style", Georgia, serif';
const sans = '"Aptos Display", Bahnschrift, "Franklin Gothic Medium", sans-serif';
const mono = '"Cascadia Code", Consolas, "Lucida Console", monospace';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const appear = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const disappear = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const PaperBackground = ({dark = false}) => (
  <>
    <AbsoluteFill style={{background: dark ? C.ink : C.paper}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: dark ? 0.04 : 0.1,
        backgroundImage: `linear-gradient(${dark ? C.paper : C.ink} 1px, transparent 1px), linear-gradient(90deg, ${dark ? C.paper : C.ink} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 18,
        border: `1px solid ${dark ? C.paper : C.ink}26`,
      }}
    />
  </>
);

const Header = ({dark = false, label = 'JOB OUTREACH OPS'}) => (
  <div
    style={{
      position: 'absolute',
      left: 31,
      right: 31,
      top: 25,
      height: 19,
      borderBottom: `1px solid ${dark ? C.paper : C.ink}40`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      fontFamily: mono,
      fontSize: 7,
      letterSpacing: 1.4,
      color: dark ? C.paper : C.ink,
    }}
  >
    <span>{label}</span>
    <span>n8n // REVIEW-FIRST AUTOMATION</span>
  </div>
);

const Tag = ({children, color = C.coral, style}) => (
  <div
    style={{
      display: 'inline-flex',
      background: color,
      color: color === C.yellow ? C.ink : C.white,
      padding: '6px 9px 5px',
      fontFamily: mono,
      fontWeight: 900,
      fontSize: 8,
      letterSpacing: 1,
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </div>
);

const Field = ({frame, fps, delay, label, value}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 17, stiffness: 170},
  });
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '115px 1fr 24px',
        alignItems: 'center',
        height: 35,
        borderBottom: `1px solid ${C.line}`,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -24}px)`,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 7,
          letterSpacing: 0.8,
          color: C.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 11,
          color: C.ink,
        }}
      >
        {value}
      </div>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: C.green,
          color: C.white,
          fontFamily: mono,
          fontSize: 9,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✓
      </div>
    </div>
  );
};

const IntakeScene = ({frame, fps}) => {
  const out = disappear(frame, 61, 74);
  const sheet = spring({
    frame: frame - 5,
    fps,
    config: {damping: 15, stiffness: 125},
  });
  const stamp = spring({
    frame: frame - 45,
    fps,
    config: {damping: 9, stiffness: 180},
  });
  const belt = interpolate(frame, [0, 68], [-35, 105], clamp);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <PaperBackground />
      <Header label="01 // ADMISSION GATE" />

      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 68,
          width: 330,
        }}
      >
        <Tag color={C.cobalt}>MANUAL RUN // ONE ROW</Tag>
        <div
          style={{
            marginTop: 13,
            fontFamily: display,
            fontSize: 46,
            lineHeight: 0.91,
            color: C.ink,
            letterSpacing: -1.7,
          }}
        >
          BEFORE AI,
          <br />
          <span style={{color: C.coral}}>CHECK THE BRIEF.</span>
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: mono,
            fontSize: 9,
            lineHeight: 1.6,
            color: C.muted,
            width: 290,
          }}
        >
          THE WORKFLOW SPENDS ZERO SEARCH OR MODEL QUOTA UNTIL ALL FIVE FIELDS
          ARE PRESENT.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 52,
          top: 69,
          width: 437,
          height: 310,
          background: C.paper2,
          border: `2px solid ${C.ink}`,
          boxShadow: `10px 11px 0 ${C.cobalt}`,
          padding: '16px 18px',
          opacity: sheet,
          transform: `translateX(${(1 - sheet) * 80}px) rotate(${(1 - sheet) * 2}deg)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `2px solid ${C.ink}`,
            paddingBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 7,
                color: C.muted,
                letterSpacing: 1,
              }}
            >
              GOOGLE SHEETS // ROW 12
            </div>
            <div
              style={{
                fontFamily: display,
                fontSize: 18,
                marginTop: 3,
                color: C.ink,
              }}
            >
              OUTREACH REQUEST
            </div>
          </div>
          <Tag color={C.yellow}>STATUS: BLANK</Tag>
        </div>
        <Field
          frame={frame}
          fps={fps}
          delay={13}
          label="COMPANY NAME"
          value="Northstar Health"
        />
        <Field
          frame={frame}
          fps={fps}
          delay={19}
          label="JOB TITLE"
          value="Senior Data Engineer"
        />
        <Field
          frame={frame}
          fps={fps}
          delay={25}
          label="LOCATION"
          value="New York · Hybrid"
        />
        <Field
          frame={frame}
          fps={fps}
          delay={31}
          label="JOB DESCRIPTION"
          value="Role context attached"
        />
        <Field
          frame={frame}
          fps={fps}
          delay={37}
          label="MY_RESUME"
          value="Candidate evidence attached"
        />
        <div
          style={{
            position: 'absolute',
            right: 25,
            bottom: 22,
            border: `4px double ${C.green}`,
            color: C.green,
            padding: '7px 11px 6px',
            fontFamily: sans,
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 1,
            transform: `scale(${stamp}) rotate(-6deg)`,
          }}
        >
          5 / 5 · INTAKE VALID
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 25,
          bottom: 35,
          height: 8,
          width: `${belt}%`,
          maxWidth: 850,
          background: C.coral,
        }}
      />
    </AbsoluteFill>
  );
};

const audiences = [
  {
    name: 'RECRUITER',
    query: 'talent · people · recruiting',
    color: C.coral,
    icon: 'R',
  },
  {
    name: 'HIRING MANAGER',
    query: 'data · engineering · director',
    color: C.cobalt,
    icon: 'M',
  },
  {
    name: 'PEER',
    query: 'senior · engineer · team',
    color: C.green,
    icon: 'P',
  },
];

const AudienceLane = ({frame, fps, audience, index}) => {
  const enter = spring({
    frame: frame - (68 + index * 7),
    fps,
    config: {damping: 15, stiffness: 155},
  });
  const packet = interpolate(
    frame,
    [79 + index * 7, 119 + index * 7],
    [0, 1],
    clamp,
  );
  return (
    <div
      style={{
        position: 'relative',
        height: 83,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -45}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 10,
          width: 188,
          height: 59,
          border: `2px solid ${audience.color}`,
          background: C.paper2,
          display: 'grid',
          gridTemplateColumns: '46px 1fr',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            marginLeft: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: audience.color,
            color: C.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: display,
            fontSize: 15,
          }}
        >
          {audience.icon}
        </div>
        <div>
          <div
            style={{
              fontFamily: sans,
              fontWeight: 900,
              fontSize: 11,
              color: C.ink,
            }}
          >
            {audience.name}
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 6,
              color: C.muted,
              marginTop: 4,
            }}
          >
            {audience.query}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 188,
          right: 0,
          top: 39,
          height: 2,
          background: `${audience.color}66`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 199 + packet * 198,
          top: 32,
          width: 15,
          height: 15,
          transform: 'rotate(45deg)',
          background: audience.color,
          boxShadow: `0 0 10px ${audience.color}`,
        }}
      />
    </div>
  );
};

const ContactCard = ({frame, fps, delay, top, accent, role, rank}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 165},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 17,
        right: 17,
        top,
        height: 60,
        background: C.paper2,
        borderLeft: `8px solid ${accent}`,
        padding: '10px 11px',
        opacity: enter,
        transform: `translateX(${(1 - enter) * 38}px)`,
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
          <div
            style={{
              fontFamily: sans,
              fontWeight: 900,
              fontSize: 11,
              color: C.ink,
            }}
          >
            {role}
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 7,
              color: C.muted,
              marginTop: 4,
            }}
          >
            URL + SNIPPET SUPPLIED BY CSE
          </div>
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 20,
            color: accent,
          }}
        >
          #{rank}
        </div>
      </div>
    </div>
  );
};

const DiscoveryScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 61, 74);
  const sceneOut = disappear(frame, 145, 158);
  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <PaperBackground dark />
      <Header dark label="02 // DISCOVER + RANK" />

      <div style={{position: 'absolute', left: 42, top: 67, color: C.white}}>
        <Tag>THREE X-RAY SEARCHES</Tag>
        <div
          style={{
            marginTop: 11,
            fontFamily: display,
            fontSize: 38,
            lineHeight: 0.95,
          }}
        >
          ONE ROLE.
          <br />
          <span style={{color: C.yellow}}>THREE WAYS IN.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 178,
          width: 430,
        }}
      >
        {audiences.map((audience, index) => (
          <AudienceLane
            key={audience.name}
            frame={frame}
            fps={fps}
            audience={audience}
            index={index}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 43,
          top: 68,
          width: 350,
          height: 316,
          border: `1px solid ${C.paper}55`,
          background: '#2B2744',
          padding: '13px 13px',
        }}
      >
        <div
          style={{
            height: 35,
            borderBottom: `1px solid ${C.paper}40`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            fontFamily: mono,
            fontSize: 8,
            color: C.paper,
          }}
        >
          <span>GEMINI RANKING QUEUE</span>
          <span style={{color: C.green}}>URL-BOUND</span>
        </div>
        <ContactCard
          frame={frame}
          fps={fps}
          delay={101}
          top={62}
          accent={C.coral}
          role="Talent Partner"
          rank="1"
        />
        <ContactCard
          frame={frame}
          fps={fps}
          delay={111}
          top={133}
          accent={C.cobalt}
          role="Director, Data Engineering"
          rank="1"
        />
        <ContactCard
          frame={frame}
          fps={fps}
          delay={121}
          top={204}
          accent={C.green}
          role="Senior Data Engineer"
          rank="1"
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 12,
            fontFamily: mono,
            fontSize: 7,
            color: C.paper,
          }}
        >
          UP TO 4 CONTACTS / AUDIENCE · UP TO 12 ENRICHMENTS
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Draft = ({frame, fps, delay, x, color, audience, subject}) => {
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
        top: 150,
        width: 220,
        height: 208,
        background: C.paper2,
        borderTop: `11px solid ${color}`,
        color: C.ink,
        padding: '15px 15px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 75}px) rotate(${(1 - enter) * 3}deg)`,
        boxShadow: '7px 8px 0 rgba(33,29,57,.18)',
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 7,
          color: C.muted,
          letterSpacing: 1,
        }}
      >
        GMAIL DRAFT // {audience}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 16,
          lineHeight: 1,
          marginTop: 11,
        }}
      >
        {subject}
      </div>
      <div
        style={{
          height: 1,
          background: C.line,
          marginTop: 12,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          fontFamily: mono,
          fontSize: 8,
          lineHeight: 1.55,
          color: C.muted,
        }}
      >
        ROLE CONTEXT ✓
        <br />
        RESUME CLAIMS ✓
        <br />
        PROFILE EVIDENCE ✓
      </div>
      <div
        style={{
          position: 'absolute',
          left: 15,
          right: 15,
          bottom: 15,
          border: `2px solid ${color}`,
          color,
          padding: '6px 4px',
          textAlign: 'center',
          fontFamily: mono,
          fontWeight: 900,
          fontSize: 8,
        }}
      >
        SAVE AS DRAFT
      </div>
    </div>
  );
};

const DraftingScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 144, 158);
  const sceneOut = disappear(frame, 218, 230);
  const statusProgress = interpolate(frame, [157, 207], [0, 100], clamp);
  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <PaperBackground />
      <Header label="03 // EVIDENCE-GROUNDED DRAFTING" />

      <div style={{position: 'absolute', left: 43, top: 66}}>
        <Tag color={C.yellow}>SEQUENTIAL CHECKPOINTS</Tag>
        <div
          style={{
            marginTop: 10,
            fontFamily: display,
            fontSize: 37,
            color: C.ink,
            lineHeight: 0.95,
          }}
        >
          THREE AUDIENCES.
          <br />
          <span style={{color: C.coral}}>THREE DIFFERENT DRAFTS.</span>
        </div>
      </div>

      <Draft
        frame={frame}
        fps={fps}
        delay={152}
        x={43}
        color={C.coral}
        audience="RECRUITER"
        subject="A relevant data engineering fit"
      />
      <Draft
        frame={frame}
        fps={fps}
        delay={166}
        x={288}
        color={C.cobalt}
        audience="MANAGER"
        subject="Building reliable data platforms"
      />
      <Draft
        frame={frame}
        fps={fps}
        delay={180}
        x={533}
        color={C.green}
        audience="PEER"
        subject="A quick question about the team"
      />

      <div
        style={{
          position: 'absolute',
          right: 42,
          top: 153,
          width: 104,
          height: 205,
          background: C.ink,
          color: C.paper,
          padding: '14px 10px',
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 7,
            color: C.yellow,
            letterSpacing: 1,
          }}
        >
          SHEET STATE
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: sans,
            fontWeight: 900,
            fontSize: 10,
            lineHeight: 1.4,
          }}
        >
          BLANK
          <div style={{color: C.muted, margin: '5px 0'}}>↓</div>
          IN PROGRESS
          <div style={{color: C.muted, margin: '5px 0'}}>↓</div>
          <span style={{color: C.green}}>DRAFTED</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 13,
            height: 5,
            background: '#47415F',
          }}
        >
          <div
            style={{
              width: `${statusProgress}%`,
              height: 5,
              background: C.green,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ReviewScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 216, 230);
  const title = spring({
    frame: frame - 219,
    fps,
    config: {damping: 14, stiffness: 125},
  });
  const gate = spring({
    frame: frame - 237,
    fps,
    config: {damping: 10, stiffness: 180},
  });
  const drafts = [
    ['RECRUITER', C.coral, -6, 0],
    ['MANAGER', C.cobalt, 0, 1],
    ['PEER', C.green, 6, 2],
  ];

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <PaperBackground dark />
      <Header dark label="04 // HUMAN REVIEW GATE" />

      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 68,
          color: C.paper,
          opacity: title,
          transform: `translateY(${(1 - title) * 25}px)`,
        }}
      >
        <Tag color={C.green}>DELIVERY BOUNDARY</Tag>
        <div
          style={{
            marginTop: 13,
            fontFamily: display,
            fontSize: 48,
            lineHeight: 0.9,
            letterSpacing: -1.5,
          }}
        >
          THE AUTOMATION
          <br />
          STOPS <span style={{color: C.yellow}}>BEFORE SEND.</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: mono,
            fontSize: 9,
            lineHeight: 1.6,
            color: '#C9C2D7',
          }}
        >
          VERIFY RECIPIENT · FACTS · TONE · RELEVANCE
          <br />
          OPERATOR ACTION IS REQUIRED TO DELIVER.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 57,
          top: 78,
          width: 294,
          height: 263,
        }}
      >
        {drafts.map(([label, color, rotate, index]) => {
          const cardIn = spring({
            frame: frame - (224 + index * 7),
            fps,
            config: {damping: 13, stiffness: 155},
          });
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: 36 + index * 15,
                top: 28 + index * 21,
                width: 205,
                height: 146,
                background: C.paper2,
                color: C.ink,
                borderTop: `9px solid ${color}`,
                padding: '15px 14px',
                boxShadow: '6px 7px 0 rgba(0,0,0,.2)',
                opacity: cardIn,
                transform: `scale(${0.86 + cardIn * 0.14}) rotate(${rotate}deg)`,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 7,
                  color: C.muted,
                }}
              >
                GMAIL // {label}
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 19,
                  marginTop: 10,
                }}
              >
                DRAFT READY
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 7,
                  color: C.muted,
                  marginTop: 10,
                }}
              >
                SAVED · NOT SENT
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            right: -6,
            bottom: 4,
            width: 132,
            height: 132,
            borderRadius: '50%',
            border: `8px double ${C.green}`,
            color: C.green,
            background: `${C.ink}F4`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: sans,
            fontWeight: 900,
            fontSize: 17,
            lineHeight: 1,
            opacity: gate,
            transform: `scale(${gate}) rotate(-8deg)`,
          }}
        >
          HUMAN
          <br />
          REVIEW
          <br />
          REQUIRED
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          bottom: 30,
          height: 61,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `1px solid ${C.paper}45`,
          paddingTop: 13,
        }}
      >
        {[
          ['1', 'ELIGIBLE ROW'],
          ['3', 'AUDIENCE PATHS'],
          ['35', 'WORKFLOW NODES'],
          ['0', 'AUTOMATIC SENDS'],
        ].map(([value, label], index) => (
          <div
            key={label}
            style={{
              borderLeft: `4px solid ${[C.coral, C.cobalt, C.yellow, C.green][index]}`,
              paddingLeft: 10,
              color: C.paper,
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontSize: 24,
                lineHeight: 0.9,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 7,
                color: '#AAA3B8',
                marginTop: 6,
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

export const N8nOutreachHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <IntakeScene frame={frame} fps={fps} />
      <DiscoveryScene frame={frame} fps={fps} />
      <DraftingScene frame={frame} fps={fps} />
      <ReviewScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
