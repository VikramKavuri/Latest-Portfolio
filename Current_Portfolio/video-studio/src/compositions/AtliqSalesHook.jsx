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
  paper: '#F3E8D0',
  ink: '#12213B',
  red: '#E4382C',
  blue: '#2464D8',
  orange: '#E68B2D',
  green: '#15856E',
  pale: '#FFF9EB',
  muted: '#786F61',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const serif = '"Bodoni MT Black", "Bookman Old Style", Georgia, serif';
const sans = 'Bahnschrift, "Franklin Gothic Medium", sans-serif';
const mono = 'Consolas, "Lucida Console", monospace';

const appear = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const disappear = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const Masthead = ({dark = false}) => (
  <div
    style={{
      position: 'absolute',
      left: 31,
      right: 31,
      top: 23,
      height: 21,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${dark ? C.paper : C.ink}55`,
      color: dark ? C.paper : C.ink,
      fontFamily: mono,
      fontSize: 7,
      letterSpacing: 1.6,
    }}
  >
    <span>ATLIQ HARDWARE // SALES INTELLIGENCE</span>
    <span>148,395 TRANSACTIONS · 17 MARKETS</span>
  </div>
);

const PaperTexture = ({dark = false}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: dark ? 0.045 : 0.11,
        backgroundImage: `linear-gradient(${dark ? C.paper : C.ink} 1px, transparent 1px)`,
        backgroundSize: '100% 31px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: dark ? 0.025 : 0.045,
        backgroundImage: `radial-gradient(circle, ${dark ? C.paper : C.ink} 0.7px, transparent 0.8px)`,
        backgroundSize: '8px 8px',
      }}
    />
  </>
);

const Stamp = ({children, color = C.red, style}) => (
  <div
    style={{
      display: 'inline-flex',
      border: `3px solid ${color}`,
      color,
      padding: '5px 9px 4px',
      fontFamily: sans,
      fontWeight: 900,
      fontSize: 11,
      lineHeight: 1,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

const RevenueScene = ({frame, fps}) => {
  const inSpring = spring({
    frame,
    fps,
    config: {damping: 15, stiffness: 115, mass: 1.3},
  });
  const sceneOut = disappear(frame, 58, 70);
  const number = Math.round(
    interpolate(frame, [8, 40], [0, 98], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const underline = interpolate(frame, [31, 49], [0, 100], clamp);
  const receiptIn = spring({
    frame: frame - 13,
    fps,
    config: {damping: 14, stiffness: 135},
  });

  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        color: C.ink,
        opacity: sceneOut,
      }}
    >
      <PaperTexture />
      <Masthead />

      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 74,
          opacity: inSpring,
          transform: `translateY(${(1 - inSpring) * 28}px)`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 900,
            fontSize: 10,
            letterSpacing: 2,
            color: C.blue,
          }}
        >
          THE TOPLINE
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 108,
            lineHeight: 0.84,
            letterSpacing: -6,
            marginTop: 11,
          }}
        >
          ₹{number}
          <span style={{fontSize: 42, letterSpacing: -2, marginLeft: 7}}>
            CR
          </span>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            marginTop: 20,
            fontFamily: sans,
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: -0.5,
          }}
        >
          REVENUE LOOKS HEALTHY.
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: -7,
              width: `${underline}%`,
              height: 6,
              background: C.red,
              transform: 'rotate(-1deg)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 54,
          top: 75,
          width: 270,
          height: 303,
          background: C.pale,
          border: `1px solid ${C.ink}`,
          boxShadow: `9px 10px 0 ${C.ink}`,
          opacity: receiptIn,
          transform: `translateX(${(1 - receiptIn) * 55}px) rotate(${(1 - receiptIn) * 3 - 1}deg)`,
          padding: '20px 20px',
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 8,
            letterSpacing: 1.4,
            color: C.muted,
          }}
        >
          MANAGEMENT REPORT / REVENUE
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 27,
            lineHeight: 1,
            marginTop: 13,
          }}
        >
          BUSINESS
          <br />
          AS USUAL?
        </div>
        <div
          style={{
            marginTop: 20,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            rowGap: 12,
            fontFamily: mono,
            fontSize: 10,
          }}
        >
          <span>TOTAL REVENUE</span>
          <b>₹98 CR</b>
          <span>MARKETS</span>
          <b>17</b>
          <span>CUSTOMERS</span>
          <b>38</b>
          <span>PRODUCTS</span>
          <b>279</b>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 21,
            borderTop: `1px dashed ${C.ink}66`,
            paddingTop: 13,
            fontFamily: mono,
            fontWeight: 900,
            fontSize: 9,
            color: C.red,
          }}
        >
          QUESTION: WHO OWNS THE REVENUE?
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 47,
          bottom: 39,
          fontFamily: mono,
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: 1,
          color: C.red,
          opacity: appear(frame, 42, 52),
        }}
      >
        PULL THE THREAD →
      </div>
    </AbsoluteFill>
  );
};

const customerBars = [42, 5.1, 4.9, 4.5, 4.3, 3.5, 3.2, 2.9, 2.1, 2.0];

const ConcentrationScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 58, 70);
  const sceneOut = disappear(frame, 143, 156);
  const titleIn = spring({
    frame: frame - 61,
    fps,
    config: {damping: 15, stiffness: 140},
  });
  const lineProgress = interpolate(frame, [93, 127], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const points = [
    [42, 42],
    [84, 47],
    [126, 52],
    [168, 57],
    [210, 61],
  ];
  const visiblePoints = Math.max(1, Math.ceil(lineProgress * points.length));
  const pointPath = points
    .slice(0, visiblePoints)
    .map(([x, y], index) => {
      const chartY = 228 - y * 2.7;
      return `${index === 0 ? 'M' : 'L'} ${x} ${chartY}`;
    })
    .join(' ');

  return (
    <AbsoluteFill
      style={{
        background: C.ink,
        color: C.paper,
        opacity: sceneIn * sceneOut,
      }}
    >
      <PaperTexture dark />
      <Masthead dark />

      <div
        style={{
          position: 'absolute',
          left: 43,
          top: 67,
          width: 455,
          opacity: titleIn,
          transform: `translateX(${(1 - titleIn) * -35}px)`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            color: '#8FB5FF',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: 1.6,
          }}
        >
          FORENSIC VIEW // CUSTOMER SHARE
        </div>
        <div
          style={{
            marginTop: 7,
            fontFamily: serif,
            fontSize: 37,
            lineHeight: 0.96,
          }}
        >
          ONE CUSTOMER
          <br />
          HOLDS THE BUSINESS.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 43,
          top: 185,
          width: 462,
          height: 218,
          borderLeft: `1px solid ${C.paper}55`,
          borderBottom: `1px solid ${C.paper}55`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '0 13px 0 15px',
        }}
      >
        {customerBars.map((value, index) => {
          const barIn = spring({
            frame: frame - (75 + index * 3),
            fps,
            config: {damping: 18, stiffness: 155},
          });
          const height = value * 4.05 * barIn;
          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: index === 0 ? 53 : 32,
                height,
                background: index === 0 ? C.red : '#8EA0B9',
                position: 'relative',
              }}
            >
              {index === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -27,
                    left: 0,
                    fontFamily: serif,
                    fontSize: 21,
                    color: C.paper,
                  }}
                >
                  42%
                </div>
              )}
            </div>
          );
        })}
        <svg
          viewBox="0 0 240 230"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 240,
            height: 230,
            overflow: 'visible',
          }}
        >
          <path
            d={pointPath}
            fill="none"
            stroke="#72A0FF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {points.slice(0, visiblePoints).map(([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={228 - y * 2.7}
              r={5}
              fill={index === 4 ? C.paper : '#72A0FF'}
            />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 2,
            bottom: -22,
            fontFamily: mono,
            fontSize: 7,
            color: C.paper,
          }}
        >
          ELECTRICALSARA
        </div>
        <div
          style={{
            position: 'absolute',
            right: 5,
            bottom: -22,
            fontFamily: mono,
            fontSize: 7,
            color: '#8EA0B9',
          }}
        >
          NEXT 9 CUSTOMERS
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 43,
          top: 75,
          width: 295,
          height: 320,
          background: C.paper,
          color: C.ink,
          padding: '22px 21px',
          clipPath: 'polygon(0 0, 100% 3%, 97% 100%, 2% 96%)',
          transform: `rotate(${interpolate(titleIn, [0, 1], [4, -1.4])}deg)`,
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontSize: 93,
            lineHeight: 0.78,
            letterSpacing: -5,
            color: C.red,
          }}
        >
          42%
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 900,
            fontSize: 21,
            lineHeight: 0.98,
            marginTop: 18,
          }}
        >
          OF ALL REVENUE
          <br />
          FROM ONE ACCOUNT.
        </div>
        <div
          style={{
            marginTop: 22,
            borderTop: `2px solid ${C.ink}`,
            paddingTop: 13,
            fontFamily: mono,
            fontSize: 10,
            lineHeight: 1.45,
          }}
        >
          TOP 5 ACCOUNTS
          <br />
          <b style={{fontSize: 25}}>61%</b> OF REVENUE
        </div>
        <Stamp
          style={{
            position: 'absolute',
            right: 23,
            bottom: 23,
            transform: `scale(${spring({
              frame: frame - 112,
              fps,
              config: {damping: 10, stiffness: 180},
            })}) rotate(-8deg)`,
          }}
        >
          single point of failure
        </Stamp>
      </div>
    </AbsoluteFill>
  );
};

const FindingCard = ({
  frame,
  fps,
  delay,
  x,
  width,
  accent,
  label,
  value,
  suffix,
  title,
  detail,
}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 140},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 142,
        width,
        height: 231,
        background: C.pale,
        color: C.ink,
        borderTop: `12px solid ${accent}`,
        boxShadow: `7px 8px 0 ${C.ink}24`,
        padding: '17px 16px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 70}px) rotate(${(1 - enter) * 2}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 8,
          fontWeight: 900,
          letterSpacing: 1.4,
          color: C.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 54,
          lineHeight: 0.88,
          letterSpacing: -3,
          color: accent,
          marginTop: 15,
        }}
      >
        {value}
        <span style={{fontSize: 18, letterSpacing: 0}}>{suffix}</span>
      </div>
      <div
        style={{
          marginTop: 15,
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 17,
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: mono,
          fontSize: 8,
          lineHeight: 1.45,
          color: C.muted,
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const RiskScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 143, 156);
  const sceneOut = disappear(frame, 216, 228);
  const scanner = interpolate(frame, [152, 207], [0, 100], clamp);
  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        color: C.ink,
        opacity: sceneIn * sceneOut,
      }}
    >
      <PaperTexture />
      <Masthead />
      <div style={{position: 'absolute', left: 45, top: 69}}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: 1.7,
            color: C.red,
          }}
        >
          MARGIN SCAN // THREE DECISIONS HIDING BELOW REVENUE
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 38,
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          THE P&L TELLS A DIFFERENT STORY.
        </div>
      </div>

      <FindingCard
        frame={frame}
        fps={fps}
        delay={151}
        x={45}
        width={248}
        accent={C.red}
        label="MARKET MARGIN"
        value="−20.8"
        suffix="%"
        title="BENGALURU LOSES MONEY."
        detail="KANPUR ALSO SELLS BELOW COST. RE-PRICE OR EXIT BEFORE CHASING GROWTH."
      />
      <FindingCard
        frame={frame}
        fps={fps}
        delay={161}
        x={322}
        width={248}
        accent={C.blue}
        label="FULL-YEAR TREND"
        value="−19"
        suffix="%"
        title="REVENUE IS SHRINKING."
        detail="HONEST 2018 → 2019 COMPARISON EXCLUDES PARTIAL YEARS."
      />
      <FindingCard
        frame={frame}
        fps={fps}
        delay={171}
        x={599}
        width={256}
        accent={C.green}
        label="CHANNEL MARGIN"
        value="1.5"
        suffix="×"
        title="E-COMMERCE WINS."
        detail="3.5% MARGIN VS 2.3% BRICK & MORTAR — BUT ONLY ~24% OF REVENUE."
      />

      <div
        style={{
          position: 'absolute',
          left: `${scanner}%`,
          top: 133,
          bottom: 56,
          width: 2,
          background: C.red,
          opacity: 0.35,
          boxShadow: `0 0 14px ${C.red}`,
        }}
      />
    </AbsoluteFill>
  );
};

const DecisionRow = ({frame, fps, delay, number, action, impact, color}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 160},
  });
  return (
    <div
      style={{
        height: 55,
        borderTop: `1px solid ${C.paper}44`,
        display: 'grid',
        gridTemplateColumns: '52px 1fr 260px',
        alignItems: 'center',
        opacity: enter,
        transform: `translateX(${(1 - enter) * 65}px)`,
      }}
    >
      <div
        style={{
          fontFamily: serif,
          fontSize: 25,
          color,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: 0.1,
        }}
      >
        {action}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 9,
          lineHeight: 1.35,
          color,
        }}
      >
        {impact}
      </div>
    </div>
  );
};

const DecisionScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 214, 228);
  const title = spring({
    frame: frame - 218,
    fps,
    config: {damping: 14, stiffness: 130},
  });
  const underline = interpolate(frame, [237, 260], [0, 100], clamp);
  return (
    <AbsoluteFill
      style={{
        background: C.ink,
        color: C.paper,
        opacity: sceneIn,
      }}
    >
      <PaperTexture dark />
      <Masthead dark />

      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 68,
          width: 800,
          opacity: title,
          transform: `translateY(${(1 - title) * 25}px)`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            color: '#8FB5FF',
            fontSize: 9,
            letterSpacing: 1.7,
            fontWeight: 900,
          }}
        >
          THE DECISION LAYER
        </div>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            marginTop: 8,
            fontFamily: serif,
            fontSize: 39,
            lineHeight: 0.97,
          }}
        >
          REVENUE WAS NEVER
          <br />
          THE WHOLE STORY.
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: -9,
              width: `${underline}%`,
              height: 6,
              background: C.red,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 46,
          right: 46,
          top: 204,
        }}
      >
        <DecisionRow
          frame={frame}
          fps={fps}
          delay={224}
          number="01"
          action="DIVERSIFY THE CUSTOMER BOOK"
          impact="~₹41 CR EXPOSED TO ONE RENEWAL"
          color="#FF6B5E"
        />
        <DecisionRow
          frame={frame}
          fps={fps}
          delay={232}
          number="02"
          action="RE-PRICE LOSS-MAKING MARKETS"
          impact="STOP PER-ORDER VALUE DESTRUCTION"
          color="#8FB5FF"
        />
        <DecisionRow
          frame={frame}
          fps={fps}
          delay={240}
          number="03"
          action="SHIFT THE CHANNEL MIX"
          impact="~₹1 CR/YR RECOVERABLE PROFIT"
          color="#63D8BD"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 46,
          bottom: 24,
          display: 'flex',
          gap: 9,
          alignItems: 'center',
          fontFamily: mono,
          fontSize: 8,
          color: '#C3BCAD',
        }}
      >
        <Stamp color={C.paper}>SQL</Stamp>
        <Stamp color={C.paper}>PYTHON</Stamp>
        <Stamp color={C.paper}>TABLEAU</Stamp>
        <span style={{marginLeft: 7}}>ONE AUDITABLE DECISION STORY</span>
      </div>
    </AbsoluteFill>
  );
};

export const AtliqSalesHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <RevenueScene frame={frame} fps={fps} />
      <ConcentrationScene frame={frame} fps={fps} />
      <RiskScene frame={frame} fps={fps} />
      <DecisionScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
