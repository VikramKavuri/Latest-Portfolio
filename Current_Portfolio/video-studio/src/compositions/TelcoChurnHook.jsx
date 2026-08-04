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
  navy: '#10233C',
  deep: '#09172A',
  cream: '#FFF2DC',
  coral: '#FF5D4D',
  mint: '#63DFC0',
  yellow: '#FFD35C',
  blue: '#5FA8FF',
  white: '#FFFDF7',
  muted: '#8FA3B7',
  line: '#29435E',
};

const display = '"Rockwell Extra Bold", "Bookman Old Style", Georgia, serif';
const sans = '"Aptos Display", Bahnschrift, "Franklin Gothic Medium", sans-serif';
const mono = '"Cascadia Code", Consolas, monospace';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const appear = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const disappear = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const Backdrop = ({light = false}) => (
  <>
    <AbsoluteFill style={{background: light ? C.cream : C.deep}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: light ? 0.1 : 0.14,
        backgroundImage: `linear-gradient(${light ? C.navy : C.line} 1px, transparent 1px), linear-gradient(90deg, ${light ? C.navy : C.line} 1px, transparent 1px)`,
        backgroundSize: '34px 34px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 19,
        border: `1px solid ${light ? C.navy : C.cream}2B`,
      }}
    />
  </>
);

const Header = ({light = false, label}) => (
  <div
    style={{
      position: 'absolute',
      left: 32,
      right: 32,
      top: 25,
      borderBottom: `1px solid ${light ? C.navy : C.cream}3A`,
      height: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      color: light ? C.navy : C.cream,
      fontFamily: mono,
      fontSize: 7,
      letterSpacing: 1.4,
    }}
  >
    <span>{label}</span>
    <span>TELCO CHURN // XGBOOST + ONNX</span>
  </div>
);

const Badge = ({children, color = C.coral, dark = false, style}) => (
  <div
    style={{
      display: 'inline-flex',
      padding: '6px 9px 5px',
      background: color,
      color: dark ? C.navy : C.white,
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

const CustomerDot = ({frame, fps, index, x, y, risk}) => {
  const enter = spring({
    frame: frame - (4 + index * 2),
    fps,
    config: {damping: 17, stiffness: 180},
  });
  const high = risk > 0.72;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: high ? 25 : 15,
        height: high ? 25 : 15,
        borderRadius: '50%',
        background: high ? C.coral : C.mint,
        boxShadow: `0 0 ${high ? 18 : 8}px ${high ? C.coral : C.mint}`,
        opacity: enter * (high ? 1 : 0.52),
        transform: `scale(${enter})`,
      }}
    />
  );
};

const RadarScene = ({frame, fps}) => {
  const out = disappear(frame, 60, 73);
  const sweep = interpolate(frame, [0, 66], [0, 360], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const title = spring({
    frame: frame - 10,
    fps,
    config: {damping: 14, stiffness: 125},
  });
  const dots = [
    [470, 112, 0.2],
    [538, 93, 0.32],
    [617, 120, 0.27],
    [694, 87, 0.55],
    [774, 119, 0.18],
    [495, 186, 0.43],
    [570, 168, 0.26],
    [650, 205, 0.91],
    [735, 180, 0.39],
    [817, 214, 0.22],
    [462, 272, 0.29],
    [548, 256, 0.35],
    [626, 300, 0.46],
    [712, 274, 0.19],
    [792, 307, 0.31],
    [520, 346, 0.24],
    [606, 363, 0.37],
    [694, 348, 0.49],
    [778, 371, 0.28],
  ];
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Backdrop />
      <Header label="01 // RETENTION RADAR" />

      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 72,
          width: 370,
          color: C.cream,
          opacity: title,
          transform: `translateY(${(1 - title) * 24}px)`,
        }}
      >
        <Badge color={C.yellow} dark>
          7,043 CUSTOMER HISTORIES
        </Badge>
        <div
          style={{
            marginTop: 15,
            fontFamily: display,
            fontSize: 52,
            lineHeight: 0.89,
            letterSpacing: -2,
          }}
        >
          WHO LEAVES
          <br />
          <span style={{color: C.coral}}>NEXT?</span>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: mono,
            fontSize: 9,
            lineHeight: 1.65,
            color: C.muted,
          }}
        >
          CONTRACT · TENURE · SERVICES · BILLING
          <br />
          BECOME A CUSTOMER-LEVEL RISK SIGNAL.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 45,
          top: 72,
          width: 415,
          height: 330,
          border: `1px solid ${C.line}`,
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#0C2138',
        }}
      >
        {[70, 130, 190, 250].map((size) => (
          <div
            key={size}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `1px solid ${C.line}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 186,
            height: 2,
            background: `linear-gradient(90deg, ${C.mint}, transparent)`,
            transformOrigin: 'left center',
            transform: `rotate(${sweep}deg)`,
            boxShadow: `0 0 9px ${C.mint}`,
          }}
        />
      </div>
      {dots.map(([x, y, risk], index) => (
        <CustomerDot
          key={`${x}-${y}`}
          frame={frame}
          fps={fps}
          index={index}
          x={x}
          y={y}
          risk={risk}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          right: 141,
          top: 173,
          width: 126,
          height: 66,
          border: `2px solid ${C.coral}`,
          color: C.coral,
          background: C.deep,
          padding: '10px 11px',
          opacity: appear(frame, 39, 50),
        }}
      >
        <div style={{fontFamily: mono, fontSize: 7}}>RISK SIGNAL</div>
        <div
          style={{
            fontFamily: display,
            fontSize: 23,
            marginTop: 5,
          }}
        >
          DETECTED
        </div>
      </div>
    </AbsoluteFill>
  );
};

const InputChip = ({frame, fps, delay, label, value, color}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 165},
  });
  return (
    <div
      style={{
        height: 49,
        border: `1px solid ${color}`,
        padding: '8px 10px',
        opacity: enter,
        transform: `translateX(${(1 - enter) * -25}px)`,
      }}
    >
      <div style={{fontFamily: mono, fontSize: 6, color: C.muted}}>
        {label}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 900,
          fontSize: 11,
          color: C.cream,
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const ScoreRing = ({frame, start, score, color, label}) => {
  const progress = interpolate(frame, [start, start + 30], [0, score], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{position: 'relative', width: 190, height: 190}}>
      <svg width="190" height="190" viewBox="0 0 190 190">
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={C.line}
          strokeWidth="13"
        />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          transform="rotate(-90 95 95)"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 40,
            lineHeight: 0.9,
          }}
        >
          {progress.toFixed(2)}
          <span style={{fontFamily: mono, fontSize: 11}}>%</span>
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 7,
            color: C.muted,
            marginTop: 9,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const SimulatorScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 60, 73);
  const sceneOut = disappear(frame, 139, 152);
  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <Backdrop />
      <Header label="02 // SINGLE-CUSTOMER SIMULATOR" />
      <div style={{position: 'absolute', left: 43, top: 66, color: C.cream}}>
        <Badge>VALIDATION EXAMPLE</Badge>
        <div
          style={{
            fontFamily: display,
            fontSize: 32,
            lineHeight: 0.94,
            marginTop: 10,
          }}
        >
          TURN A PROFILE
          <br />
          INTO A
          <br />
          <span style={{color: C.yellow}}>RETENTION SIGNAL.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 43,
          top: 193,
          width: 370,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        <InputChip
          frame={frame}
          fps={fps}
          delay={71}
          label="CONTRACT"
          value="Month-to-month"
          color={C.coral}
        />
        <InputChip
          frame={frame}
          fps={fps}
          delay={78}
          label="TENURE"
          value="Short tenure"
          color={C.yellow}
        />
        <InputChip
          frame={frame}
          fps={fps}
          delay={85}
          label="INTERNET"
          value="Fiber optic"
          color={C.blue}
        />
        <InputChip
          frame={frame}
          fps={fps}
          delay={92}
          label="SUPPORT SERVICES"
          value="Limited"
          color={C.mint}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 43,
          bottom: 41,
          width: 370,
          fontFamily: mono,
          fontSize: 8,
          lineHeight: 1.5,
          color: C.muted,
        }}
      >
        OBSERVED LOCAL VALIDATION EXAMPLE · NOT A CAUSAL EXPLANATION
      </div>
      <div
        style={{
          position: 'absolute',
          right: 83,
          top: 108,
          width: 350,
          height: 272,
          background: '#0C2138',
          border: `1px solid ${C.coral}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `10px 11px 0 ${C.coral}44`,
        }}
      >
        <ScoreRing
          frame={frame}
          start={87}
          score={64.24}
          color={C.coral}
          label="CHURN PROBABILITY"
        />
        <div
          style={{
            position: 'absolute',
            right: 15,
            top: 14,
            fontFamily: mono,
            fontSize: 7,
            color: C.coral,
          }}
        >
          MODEL: XGBOOST
        </div>
        <Badge
          color={C.coral}
          style={{position: 'absolute', bottom: 18, right: 18}}
        >
          STRONG RETENTION SIGNAL
        </Badge>
      </div>
    </AbsoluteFill>
  );
};

const ProfileCard = ({
  frame,
  fps,
  delay,
  x,
  color,
  risk,
  label,
  lines,
}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 145},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 139,
        width: 345,
        height: 231,
        background: C.cream,
        color: C.navy,
        borderTop: `12px solid ${color}`,
        padding: '17px 18px',
        boxShadow: '8px 9px 0 rgba(0,0,0,.2)',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 65}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{fontFamily: mono, fontSize: 7, color: C.muted}}>
            OBSERVED PROFILE
          </div>
          <div
            style={{
              fontFamily: display,
              fontSize: 21,
              marginTop: 7,
              color,
            }}
          >
            {label}
          </div>
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 36,
            color,
          }}
        >
          {risk}
          <span style={{fontFamily: mono, fontSize: 9}}>%</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 17,
          borderTop: `1px solid ${C.line}`,
          paddingTop: 13,
          fontFamily: mono,
          fontSize: 9,
          lineHeight: 1.7,
        }}
      >
        {lines.map((line) => (
          <div key={line}>✓ {line}</div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 17,
          height: 8,
          background: '#D7CEBF',
        }}
      >
        <div
          style={{
            width: `${risk}%`,
            height: 8,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

const CompareScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 138, 152);
  const sceneOut = disappear(frame, 212, 224);
  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <Backdrop />
      <Header label="03 // WHAT-IF COMPARISON" />
      <div style={{position: 'absolute', left: 44, top: 66, color: C.cream}}>
        <Badge color={C.blue}>TWO VALIDATION OUTCOMES</Badge>
        <div
          style={{
            fontFamily: display,
            fontSize: 36,
            lineHeight: 0.95,
            marginTop: 10,
          }}
        >
          SAME PRODUCT.
          <br />
          <span style={{color: C.mint}}>VERY DIFFERENT RISK.</span>
        </div>
      </div>
      <ProfileCard
        frame={frame}
        fps={fps}
        delay={146}
        x={44}
        color={C.coral}
        risk={91.26}
        label="HIGH-RISK PROFILE"
        lines={[
          'Short tenure + senior customer',
          'Fiber service',
          'No support add-ons',
        ]}
      />
      <ProfileCard
        frame={frame}
        fps={fps}
        delay={163}
        x={511}
        color={C.mint}
        risk={0.2}
        label="LOW-RISK PROFILE"
        lines={[
          'Long tenure + two-year contract',
          'Lower monthly charges',
          'Automatic payment',
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 423,
          top: 231,
          fontFamily: display,
          fontSize: 27,
          color: C.yellow,
          opacity: appear(frame, 177, 188),
        }}
      >
        VS
      </div>
    </AbsoluteFill>
  );
};

const Metric = ({frame, fps, delay, x, color, value, label}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 160},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 285,
        width: 194,
        height: 86,
        borderTop: `4px solid ${color}`,
        background: '#0C2138',
        padding: '13px 14px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 35}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontSize: 26,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 7,
          color: C.cream,
          marginTop: 9,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const FinalScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 211, 224);
  const title = spring({
    frame: frame - 215,
    fps,
    config: {damping: 14, stiffness: 125},
  });
  const arrow = interpolate(frame, [228, 258], [0, 100], clamp);
  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <Backdrop />
      <Header label="04 // DEPLOYED DECISION SUPPORT" />
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 69,
          color: C.cream,
          opacity: title,
          transform: `translateY(${(1 - title) * 24}px)`,
        }}
      >
        <Badge color={C.mint} dark>
          DEPLOYED MODEL // XGBOOST
        </Badge>
        <div
          style={{
            marginTop: 13,
            fontFamily: display,
            fontSize: 46,
            lineHeight: 0.9,
          }}
        >
          SPOT THE RISK
          <br />
          <span style={{color: C.coral}}>BEFORE GOODBYE.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 48,
          top: 79,
          width: 354,
          height: 157,
          border: `1px solid ${C.line}`,
          display: 'grid',
          gridTemplateColumns: '1fr 48px 1fr',
          alignItems: 'center',
          padding: '0 17px',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div
            style={{
              fontFamily: display,
              fontSize: 25,
              color: C.yellow,
            }}
          >
            XGBOOST
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 7,
              color: C.muted,
              marginTop: 7,
            }}
          >
            TRAIN + EVALUATE
          </div>
        </div>
        <div style={{fontFamily: display, fontSize: 24, color: C.mint}}>
          →
        </div>
        <div style={{textAlign: 'center'}}>
          <div
            style={{
              fontFamily: display,
              fontSize: 25,
              color: C.mint,
            }}
          >
            ONNX
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 7,
              color: C.muted,
              marginTop: 7,
            }}
          >
            LIGHTWEIGHT WEB INFERENCE
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 17,
            bottom: 10,
            width: `${arrow}%`,
            maxWidth: 318,
            height: 4,
            background: C.mint,
          }}
        />
      </div>
      <Metric
        frame={frame}
        fps={fps}
        delay={225}
        x={44}
        color={C.coral}
        value="85.14%"
        label="ROC AUC"
      />
      <Metric
        frame={frame}
        fps={fps}
        delay={233}
        x={254}
        color={C.yellow}
        value="7,043"
        label="DATASET ROWS"
      />
      <Metric
        frame={frame}
        fps={fps}
        delay={241}
        x={464}
        color={C.blue}
        value="4"
        label="BATCH INPUT FORMATS"
      />
      <Metric
        frame={frame}
        fps={fps}
        delay={249}
        x={674}
        color={C.mint}
        value="WEB"
        label="SINGLE + BATCH SCORING"
      />
      <div
        style={{
          position: 'absolute',
          right: 54,
          bottom: 28,
          fontFamily: mono,
          fontSize: 7,
          color: C.muted,
        }}
      >
        CSV · XLSX · JSON · STRUCTURED PDF
      </div>
    </AbsoluteFill>
  );
};

export const TelcoChurnHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <RadarScene frame={frame} fps={fps} />
      <SimulatorScene frame={frame} fps={fps} />
      <CompareScene frame={frame} fps={fps} />
      <FinalScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
