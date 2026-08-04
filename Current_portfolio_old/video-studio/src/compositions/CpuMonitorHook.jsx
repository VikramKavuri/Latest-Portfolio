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
  void: '#06100E',
  panel: '#0B1B18',
  panel2: '#102622',
  phosphor: '#8DFF7E',
  cyan: '#3ED8FF',
  amber: '#FFC857',
  alert: '#FF5E63',
  white: '#E9FFF7',
  muted: '#78948B',
  grid: '#224039',
};

const mono = '"Cascadia Code", Consolas, "Lucida Console", monospace';
const display = '"Bahnschrift Condensed", "Franklin Gothic Medium", sans-serif';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const appear = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const disappear = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const Shell = ({children, label = 'LOCAL SYSTEM // LIVE'}) => (
  <div
    style={{
      position: 'absolute',
      left: 25,
      right: 25,
      top: 22,
      bottom: 22,
      border: `1px solid ${C.grid}`,
      background: `${C.void}E8`,
      boxShadow: `inset 0 0 55px ${C.phosphor}08`,
    }}
  >
    <div
      style={{
        height: 25,
        borderBottom: `1px solid ${C.grid}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 11px',
        color: C.muted,
        fontFamily: mono,
        fontSize: 7,
        letterSpacing: 1.3,
      }}
    >
      <span>{label}</span>
      <span>POWER BI REAL-TIME PERFORMANCE MONITOR</span>
    </div>
    {children}
  </div>
);

const Background = () => (
  <>
    <AbsoluteFill style={{background: C.void}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.17,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.12,
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0, transparent 3px, #000 4px)',
      }}
    />
  </>
);

const Signal = ({color = C.phosphor, size = 7, style}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 13px ${color}`,
      ...style,
    }}
  />
);

const BootScene = ({frame, fps}) => {
  const sceneOut = disappear(frame, 61, 74);
  const terminal = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 130},
  });
  const command = '.\\Add-PerformanceCounter.ps1';
  const chars = Math.floor(
    interpolate(frame, [8, 34], [0, command.length], clamp),
  );
  const status = [
    ['COUNTERS ATTACHED', 32, C.phosphor],
    ['REST ENDPOINT READY', 40, C.cyan],
    ['PUSHSTREAMING LIVE', 48, C.amber],
  ];
  const sweep = interpolate(frame, [0, 68], [-20, 120], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Background />
      <Shell label="WINDOWS POWERSHELL // BOOT">
        <div
          style={{
            position: 'absolute',
            left: 29,
            top: 62,
            width: 430,
            height: 289,
            border: `1px solid ${C.grid}`,
            background: '#071511',
            opacity: terminal,
            transform: `translateY(${(1 - terminal) * 25}px)`,
          }}
        >
          <div
            style={{
              height: 27,
              borderBottom: `1px solid ${C.grid}`,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 10px',
              fontFamily: mono,
              fontSize: 7,
              color: C.muted,
            }}
          >
            <Signal color={C.alert} size={6} />
            <Signal color={C.amber} size={6} />
            <Signal color={C.phosphor} size={6} />
            <span style={{marginLeft: 5}}>PERFORMANCE-COLLECTOR.PS1</span>
          </div>
          <div
            style={{
              padding: '21px 18px',
              fontFamily: mono,
              fontSize: 13,
              lineHeight: 1.65,
              color: C.white,
            }}
          >
            <span style={{color: C.phosphor}}>PS C:\monitor&gt;</span>{' '}
            {command.slice(0, chars)}
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 16,
                marginLeft: 3,
                background: frame % 18 < 10 ? C.phosphor : 'transparent',
                verticalAlign: 'middle',
              }}
            />
            <div
              style={{
                marginTop: 20,
                color: C.muted,
                fontSize: 9,
                lineHeight: 1.9,
              }}
            >
              POLL /Processor Information(*)
              <br />
              POLL /Memory /LogicalDisk /Network
              <br />
              POLL /Thermal Zone /Process
            </div>
            <div style={{marginTop: 14}}>
              {status.map(([text, delay, color]) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    color,
                    fontSize: 9,
                    opacity: appear(frame, delay, delay + 7),
                  }}
                >
                  <span>[✓]</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 35,
            top: 69,
            width: 340,
            opacity: appear(frame, 20, 33),
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 8,
              letterSpacing: 1.8,
              color: C.cyan,
            }}
          >
            SYSTEM ONLINE // SECOND-LEVEL TELEMETRY
          </div>
          <div
            style={{
              marginTop: 12,
              color: C.white,
              fontFamily: display,
              fontWeight: 900,
              fontSize: 58,
              lineHeight: 0.88,
              letterSpacing: -2.5,
            }}
          >
            YOUR PC
            <br />
            HAS A <span style={{color: C.phosphor}}>PULSE.</span>
          </div>
          <div
            style={{
              marginTop: 22,
              height: 70,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg viewBox="0 0 330 70" width="330" height="70">
              <polyline
                points="0,38 44,38 55,38 66,9 78,62 92,28 106,38 150,38 163,38 174,17 185,52 196,38 240,38 330,38"
                fill="none"
                stroke={C.phosphor}
                strokeWidth="3"
                strokeDasharray="470"
                strokeDashoffset={470 - (470 * Math.min(100, sweep)) / 100}
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 19,
              fontFamily: mono,
              fontSize: 8,
              color: C.muted,
            }}
          >
            <span>CPU</span>
            <span>MEMORY</span>
            <span>DISK</span>
            <span>NETWORK</span>
            <span>TEMP</span>
          </div>
        </div>
      </Shell>
    </AbsoluteFill>
  );
};

const demoCpu = [18, 24, 21, 33, 29, 42, 36, 55, 44, 61, 48, 58, 51, 66, 57, 63];
const coreSeries = [
  [12, 22, 18, 34, 27, 48, 31, 45, 38, 51, 43, 56],
  [25, 31, 28, 38, 34, 44, 40, 53, 47, 59, 52, 62],
  [18, 16, 24, 21, 35, 30, 42, 36, 49, 41, 55, 47],
  [30, 26, 35, 32, 45, 38, 51, 43, 57, 49, 61, 54],
];

const LineChart = ({values, frame, start, color, width, height}) => {
  const progress = interpolate(frame, [start, start + 34], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const visible = Math.max(2, Math.ceil(progress * values.length));
  const points = values
    .slice(0, visible)
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        x1="0"
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke={C.grid}
        strokeDasharray="4 5"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MetricCard = ({
  frame,
  fps,
  delay,
  label,
  value,
  unit,
  color,
  x,
  y,
  width,
  detail,
}) => {
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
        top: y,
        width,
        height: 91,
        border: `1px solid ${C.grid}`,
        background: C.panel,
        padding: '11px 12px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: mono,
          fontSize: 7,
          letterSpacing: 1.1,
          color: C.muted,
        }}
      >
        <span>{label}</span>
        <Signal color={color} size={5} />
      </div>
      <div
        style={{
          marginTop: 7,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 30,
          color,
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{fontFamily: mono, fontSize: 9, marginLeft: 4}}>
          {unit}
        </span>
      </div>
      <div
        style={{
          marginTop: 7,
          fontFamily: mono,
          fontSize: 7,
          color: C.muted,
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const TelemetryScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 61, 74);
  const sceneOut = disappear(frame, 149, 161);
  const demoIndex = Math.min(
    demoCpu.length - 1,
    Math.floor(interpolate(frame, [72, 141], [0, demoCpu.length], clamp)),
  );
  const cpuValue = demoCpu[demoIndex];
  const memory = Math.round(54 + Math.sin(frame / 10) * 4);
  const temp = Math.round(55 + Math.sin(frame / 13) * 3);
  const processes = Math.round(142 + Math.sin(frame / 8) * 7);

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <Background />
      <Shell label="LIVE OPERATIONS // DEMO TELEMETRY">
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 43,
            width: 500,
            height: 326,
            border: `1px solid ${C.grid}`,
            background: C.panel,
            padding: '15px 17px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 8,
                  color: C.muted,
                  letterSpacing: 1.1,
                }}
              >
                CPU TOTAL // PROCESSOR TIME
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontWeight: 900,
                  fontSize: 45,
                  color: C.phosphor,
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                {cpuValue}
                <span style={{fontFamily: mono, fontSize: 12}}>%</span>
              </div>
            </div>
            <div
              style={{
                border: `1px solid ${C.phosphor}`,
                color: C.phosphor,
                padding: '7px 9px',
                fontFamily: mono,
                fontSize: 8,
                letterSpacing: 1,
              }}
            >
              SAMPLE 02s
            </div>
          </div>
          <div
            style={{
              height: 125,
              marginTop: 6,
              borderTop: `1px solid ${C.grid}`,
              borderBottom: `1px solid ${C.grid}`,
              paddingTop: 12,
            }}
          >
            <LineChart
              values={demoCpu}
              frame={frame}
              start={72}
              color={C.phosphor}
              width={464}
              height={101}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 9,
              marginTop: 13,
            }}
          >
            {coreSeries.map((values, index) => (
              <div
                key={`core-${index}`}
                style={{
                  borderLeft: `2px solid ${[C.cyan, C.amber, C.alert, C.phosphor][index]}`,
                  paddingLeft: 7,
                }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 7,
                    color: C.muted,
                    marginBottom: 6,
                  }}
                >
                  CORE {index}
                </div>
                <LineChart
                  values={values}
                  frame={frame}
                  start={80 + index * 4}
                  color={[C.cyan, C.amber, C.alert, C.phosphor][index]}
                  width={91}
                  height={45}
                />
              </div>
            ))}
          </div>
        </div>

        <MetricCard
          frame={frame}
          fps={fps}
          delay={75}
          x={540}
          y={43}
          width={140}
          label="MEMORY USED"
          value={memory}
          unit="%"
          color={C.cyan}
          detail="COMMITTED BYTES"
        />
        <MetricCard
          frame={frame}
          fps={fps}
          delay={81}
          x={694}
          y={43}
          width={140}
          label="TEMPERATURE"
          value={temp}
          unit="°C"
          color={C.amber}
          detail="THERMAL ZONE"
        />
        <MetricCard
          frame={frame}
          fps={fps}
          delay={87}
          x={540}
          y={148}
          width={140}
          label="DISK FREE"
          value="68"
          unit="%"
          color={C.phosphor}
          detail="LOGICALDISK C:"
        />
        <MetricCard
          frame={frame}
          fps={fps}
          delay={93}
          x={694}
          y={148}
          width={140}
          label="PROCESSES"
          value={processes}
          unit="LIVE"
          color={C.alert}
          detail="NON-TOTAL INSTANCES"
        />

        <div
          style={{
            position: 'absolute',
            left: 540,
            right: 22,
            top: 253,
            height: 116,
            border: `1px solid ${C.grid}`,
            background: C.panel2,
            padding: '13px 14px',
            opacity: appear(frame, 98, 110),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: mono,
              fontSize: 8,
              color: C.muted,
            }}
          >
            <span>NETWORK THROUGHPUT</span>
            <span style={{color: C.cyan}}>WLAN + ETHERNET</span>
          </div>
          <div style={{marginTop: 13}}>
            <LineChart
              values={[8, 14, 12, 35, 18, 55, 23, 71, 33, 48, 28, 62]}
              frame={frame}
              start={102}
              color={C.cyan}
              width={268}
              height={57}
            />
          </div>
        </div>
      </Shell>
    </AbsoluteFill>
  );
};

const Node = ({frame, fps, delay, x, color, eyebrow, title, detail}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 15, stiffness: 145},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 173,
        width: 166,
        height: 126,
        border: `1px solid ${color}`,
        background: C.panel,
        padding: '15px 13px',
        opacity: enter,
        transform: `scale(${0.86 + enter * 0.14})`,
        boxShadow: `0 0 22px ${color}13`,
      }}
    >
      <Signal color={color} size={8} />
      <div
        style={{
          marginTop: 12,
          fontFamily: mono,
          color,
          fontSize: 7,
          letterSpacing: 1.2,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 17,
          lineHeight: 1,
          color: C.white,
          marginTop: 5,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 7,
          lineHeight: 1.35,
          color: C.muted,
          marginTop: 9,
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const ArchitectureScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 148, 161);
  const sceneOut = disappear(frame, 218, 230);
  const packet = interpolate(frame, [164, 206], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const routeStart = 80;
  const routeEnd = 820;
  const packetX = routeStart + (routeEnd - routeStart) * packet;
  const cross = spring({
    frame: frame - 195,
    fps,
    config: {damping: 13, stiffness: 170},
  });

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <Background />
      <Shell label="DATA PATH // DIRECT">
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 51,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 38,
            lineHeight: 1,
            color: C.white,
          }}
        >
          FROM WINDOWS COUNTERS
          <br />
          TO POWER BI. <span style={{color: C.phosphor}}>DIRECT.</span>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 28,
            top: 60,
            fontFamily: mono,
            fontSize: 8,
            lineHeight: 1.6,
            textAlign: 'right',
            color: C.muted,
          }}
        >
          NO BROKER
          <br />
          NO STREAM PROCESSOR
          <br />
          NO EXTRA AZURE SERVICE
        </div>

        <div
          style={{
            position: 'absolute',
            left: routeStart,
            right: 54,
            top: 235,
            height: 2,
            background: C.grid,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: packetX,
            top: 226,
            width: 18,
            height: 18,
            transform: 'rotate(45deg)',
            background: C.phosphor,
            boxShadow: `0 0 17px ${C.phosphor}`,
          }}
        />

        <Node
          frame={frame}
          fps={fps}
          delay={154}
          x={45}
          color={C.cyan}
          eyebrow="01 // COLLECT"
          title="WINDOWS COUNTERS"
          detail="CPU · MEMORY · DISK · NETWORK · TEMP"
        />
        <Node
          frame={frame}
          fps={fps}
          delay={164}
          x={258}
          color={C.phosphor}
          eyebrow="02 // SHAPE"
          title="POWERSHELL"
          detail="JSON ROWS · TOKEN AUTH · 2s POLL"
        />
        <Node
          frame={frame}
          fps={fps}
          delay={174}
          x={471}
          color={C.amber}
          eyebrow="03 // PUSH"
          title="POWER BI REST API"
          detail="POST /ROWS · PUSHSTREAMING DATASET"
        />
        <Node
          frame={frame}
          fps={fps}
          delay={184}
          x={684}
          color={C.alert}
          eyebrow="04 // SEE"
          title="LIVE DASHBOARD"
          detail="STREAMING TILES · HISTORICAL PBIX"
        />

        <div
          style={{
            position: 'absolute',
            left: 270,
            bottom: 24,
            width: 359,
            height: 52,
            border: `1px dashed ${C.alert}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
            fontFamily: mono,
            fontSize: 9,
            color: C.alert,
            opacity: cross,
            transform: `scale(${cross}) rotate(-1deg)`,
          }}
        >
          <span>EVENT HUB</span>
          <span>+</span>
          <span>STREAM ANALYTICS</span>
          <div
            style={{
              position: 'absolute',
              left: 15,
              right: 15,
              top: 24,
              height: 4,
              background: C.alert,
              transform: 'rotate(-5deg)',
            }}
          />
        </div>
      </Shell>
    </AbsoluteFill>
  );
};

const Feature = ({frame, fps, delay, x, color, value, label, detail}) => {
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
        top: 257,
        width: 236,
        height: 104,
        borderTop: `3px solid ${color}`,
        background: C.panel,
        padding: '13px 14px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 36}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 29,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 8,
          fontWeight: 900,
          letterSpacing: 1,
          color: C.white,
          marginTop: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 7,
          color: C.muted,
          marginTop: 7,
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const FinalScene = ({frame, fps}) => {
  const sceneIn = appear(frame, 217, 230);
  const title = spring({
    frame: frame - 220,
    fps,
    config: {damping: 14, stiffness: 125},
  });
  const cursorX = interpolate(frame, [230, 266], [0, 100], clamp);
  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <Background />
      <Shell label="SYSTEM STATUS // READY">
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 54,
            opacity: title,
            transform: `translateY(${(1 - title) * 24}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: mono,
              fontSize: 8,
              color: C.phosphor,
              letterSpacing: 1.5,
            }}
          >
            <Signal />
            LIVE VISIBILITY WITHOUT THE INFRASTRUCTURE TAX
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 54,
              lineHeight: 0.88,
              letterSpacing: -2.2,
              color: C.white,
              marginTop: 15,
            }}
          >
            SEE THE MACHINE.
            <br />
            <span style={{color: C.phosphor}}>AS IT HAPPENS.</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 42,
            top: 69,
            width: 216,
            height: 142,
            border: `2px solid ${C.phosphor}`,
            background: '#0A1815',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 26px ${C.phosphor}14`,
            opacity: appear(frame, 228, 239),
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 64,
              color: C.phosphor,
              lineHeight: 0.85,
            }}
          >
            $0
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 8,
              letterSpacing: 1,
              color: C.white,
              marginTop: 10,
            }}
          >
            EXTRA INFRASTRUCTURE
          </div>
        </div>

        <Feature
          frame={frame}
          fps={fps}
          delay={230}
          x={35}
          color={C.cyan}
          value="15+"
          label="PERFORMANCE INDICATORS"
          detail="CPU · MEMORY · DISK · NETWORK · TEMP"
        />
        <Feature
          frame={frame}
          fps={fps}
          delay={238}
          x={285}
          color={C.amber}
          value="02s"
          label="CURRENT SCRIPT CADENCE"
          detail="CONTINUOUS WINDOWS COUNTER SAMPLING"
        />
        <Feature
          frame={frame}
          fps={fps}
          delay={246}
          x={535}
          color={C.alert}
          value="REST"
          label="DIRECT PUSH PATH"
          detail="POWERSHELL → POWER BI PUSHSTREAMING"
        />

        <div
          style={{
            position: 'absolute',
            left: 35,
            bottom: 23,
            width: 730,
            height: 2,
            background: C.grid,
          }}
        >
          <div
            style={{
              width: `${cursorX}%`,
              height: 2,
              background: C.phosphor,
              boxShadow: `0 0 8px ${C.phosphor}`,
            }}
          />
        </div>
      </Shell>
    </AbsoluteFill>
  );
};

export const CpuMonitorHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.void, overflow: 'hidden'}}>
      <BootScene frame={frame} fps={fps} />
      <TelemetryScene frame={frame} fps={fps} />
      <ArchitectureScene frame={frame} fps={fps} />
      <FinalScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
