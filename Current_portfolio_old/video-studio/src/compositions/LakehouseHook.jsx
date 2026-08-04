import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const P = {
  night: '#071A2D',
  navy: '#0D2943',
  paper: '#E9F0F5',
  quiet: '#85A0B8',
  orange: '#FF654A',
  cyan: '#37D5DF',
  gold: '#FFC857',
  green: '#3DDD9C',
  red: '#FF5D67',
  silver: '#B8C8D8',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const stations = [
  {x: 72, code: '01', label: 'FHIR', sub: 'JSON / NDJSON', color: P.cyan, delay: 28},
  {x: 224, code: '02', label: 'BRONZE', sub: 'Raw + lineage', color: '#D98652', delay: 57},
  {x: 376, code: '03', label: 'SILVER', sub: 'Typed resources', color: P.silver, delay: 87},
  {x: 528, code: '04', label: 'QUALITY', sub: '8 checks', color: P.green, delay: 117},
  {x: 680, code: '05', label: 'OMOP', sub: 'Clinical model', color: P.cyan, delay: 149},
  {x: 832, code: '06', label: 'GOLD', sub: 'Analytics ready', color: P.gold, delay: 182},
];

const resources = [
  {label: 'Patient', color: P.cyan, delay: 15, offset: -13},
  {label: 'Observation', color: P.gold, delay: 28, offset: 0},
  {label: 'Condition', color: P.orange, delay: 41, offset: 13},
];

const tasks = [
  {label: 'ingest_bronze', delay: 47},
  {label: 'parse_silver', delay: 78},
  {label: 'quality_checks', delay: 110},
  {label: 'build_omop', delay: 142},
  {label: 'publish_gold', delay: 175},
  {label: 'run_summary', delay: 207},
];

const Station = ({station, frame, fps}) => {
  const reveal = spring({
    frame: frame - station.delay,
    fps,
    config: {damping: 17, stiffness: 190},
  });
  const active = interpolate(
    frame,
    [station.delay - 7, station.delay + 5, station.delay + 19],
    [0, 1, 0.35],
    clamp,
  );
  const complete = frame > station.delay + 14;

  return (
    <div
      style={{
        position: 'absolute',
        left: station.x - 47,
        top: 198,
        width: 94,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 35,
          height: 35,
          margin: '0 auto',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: complete ? station.color : P.night,
          color: complete ? P.night : station.color,
          border: `2px solid ${station.color}`,
          boxShadow: `0 0 ${20 * active}px ${station.color}66`,
          fontFamily: '"Lucida Console", monospace',
          fontSize: 9,
          fontWeight: 800,
        }}
      >
        {complete ? '✓' : station.code}
      </div>
      <div
        style={{
          marginTop: 8,
          color: station.color,
          fontFamily: '"Lucida Console", monospace',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.2,
        }}
      >
        {station.label}
      </div>
      <div
        style={{
          marginTop: 3,
          color: P.quiet,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 9,
          letterSpacing: 0.4,
        }}
      >
        {station.sub}
      </div>
    </div>
  );
};

const ResourcePacket = ({resource, frame}) => {
  const x = interpolate(frame, [resource.delay, resource.delay + 186], [42, 842], clamp);
  const visibility = interpolate(
    frame,
    [resource.delay, resource.delay + 5, resource.delay + 178, resource.delay + 186],
    [0, 1, 1, 0],
    clamp,
  );
  const stationPulse = Math.floor((x - 42) / 152);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 32,
        top: 181 + resource.offset,
        width: 64,
        height: 18,
        borderRadius: 4,
        display: 'grid',
        placeItems: 'center',
        opacity: visibility,
        background: resource.color,
        color: P.night,
        border: `1px solid ${P.night}`,
        boxShadow: `3px 3px 0 rgba(7,26,45,0.48), 0 0 12px ${resource.color}55`,
        fontFamily: '"Lucida Console", monospace',
        fontSize: 8,
        fontWeight: 800,
        transform: `translateY(${Math.sin((frame + resource.delay) / 8) * 1.2}px)`,
      }}
    >
      {stationPulse < 2 ? resource.label : resource.label.toUpperCase()}
    </div>
  );
};

const TaskChip = ({task, index, frame, fps}) => {
  const done = spring({
    frame: frame - task.delay,
    fps,
    config: {damping: 18, stiffness: 180},
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 119,
        opacity: 0.3 + done * 0.7,
        transform: `translateY(${(1 - done) * 5}px)`,
      }}
    >
      <div
        style={{
          width: 17,
          height: 17,
          borderRadius: 5,
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
          background: done > 0.5 ? P.green : 'rgba(133,160,184,0.14)',
          color: done > 0.5 ? P.night : P.quiet,
          border: `1px solid ${done > 0.5 ? P.green : P.quiet}`,
          fontFamily: '"Lucida Console", monospace',
          fontSize: 8,
          fontWeight: 800,
        }}
      >
        {done > 0.5 ? '✓' : String(index + 1).padStart(2, '0')}
      </div>
      <span
        style={{
          fontFamily: '"Lucida Console", monospace',
          fontSize: 8,
          color: done > 0.5 ? P.paper : P.quiet,
          letterSpacing: 0.25,
        }}
      >
        {task.label}
      </span>
    </div>
  );
};

const Metric = ({value, label, color, delay, frame, fps}) => {
  const reveal = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 180},
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 9}px)`,
      }}
    >
      <span
        style={{
          color,
          fontFamily: 'Rockwell, serif',
          fontSize: 23,
          fontWeight: 800,
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: P.quiet,
          fontFamily: 'Bahnschrift, sans-serif',
          fontSize: 8.5,
          letterSpacing: 0.7,
          lineHeight: 1.05,
          maxWidth: 65,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const AuditBranch = ({frame, fps}) => {
  const line = interpolate(frame, [112, 139], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const packetY = interpolate(frame, [125, 157], [217, 332], clamp);
  const packetOpacity = interpolate(
    frame,
    [122, 127, 151, 158],
    [0, 1, 1, 0],
    clamp,
  );
  const bin = spring({
    frame: frame - 143,
    fps,
    config: {damping: 17, stiffness: 175},
  });

  return (
    <>
      <svg
        width="900"
        height="460"
        viewBox="0 0 900 460"
        style={{position: 'absolute', inset: 0}}
      >
        <path
          d="M528 217 C528 250 560 264 560 320"
          fill="none"
          stroke={P.red}
          strokeWidth="2"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - line}
          opacity="0.8"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 505,
          top: packetY,
          padding: '4px 7px',
          borderRadius: 4,
          opacity: packetOpacity,
          background: P.red,
          color: P.night,
          border: `1px solid ${P.night}`,
          fontFamily: '"Lucida Console", monospace',
          fontSize: 8,
          fontWeight: 800,
        }}
      >
        CLAIM −$15
      </div>
      <div
        style={{
          position: 'absolute',
          left: 486,
          top: 316,
          width: 150,
          padding: '9px 10px',
          boxSizing: 'border-box',
          border: `1px solid ${P.red}`,
          background: 'rgba(255,93,103,0.08)',
          opacity: bin,
          transform: `scale(${0.82 + bin * 0.18}) rotate(${(1 - bin) * 3}deg)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: P.red,
            fontFamily: '"Lucida Console", monospace',
            fontSize: 8.5,
            fontWeight: 800,
            letterSpacing: 0.8,
          }}
        >
          <span>QUALITY HOLD</span>
          <span>01</span>
        </div>
        <div
          style={{
            marginTop: 5,
            color: P.paper,
            fontFamily: 'Bahnschrift, sans-serif',
            fontSize: 9.5,
          }}
        >
          Negative claim retained for audit
        </div>
      </div>
    </>
  );
};

const GoldOutput = ({frame, fps}) => {
  const reveal = spring({
    frame: frame - 185,
    fps,
    config: {damping: 19, stiffness: 160},
  });
  const bars = [0.7, 0.42, 0.9, 0.58];

  return (
    <div
      style={{
        position: 'absolute',
        right: 28,
        top: 83,
        width: 300,
        height: 88,
        padding: '10px 12px',
        boxSizing: 'border-box',
        border: `1px solid ${P.gold}`,
        background: 'rgba(255,200,87,0.07)',
        opacity: reveal,
        transform: `translateX(${(1 - reveal) * 50}px)`,
        boxShadow: `0 0 28px rgba(255,200,87,${0.11 * reveal})`,
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
              color: P.gold,
              fontFamily: '"Lucida Console", monospace',
              fontSize: 8.5,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            GOLD_PATIENT_SUMMARY
          </div>
          <div
            style={{
              marginTop: 4,
              color: P.paper,
              fontFamily: 'Rockwell, serif',
              fontSize: 15,
            }}
          >
            Trusted tables, ready to query.
          </div>
        </div>
        <div
          style={{
            color: P.green,
            fontFamily: '"Lucida Console", monospace',
            fontSize: 8.5,
            fontWeight: 800,
          }}
        >
          SQL ✓
        </div>
      </div>
      <div
        style={{
          height: 31,
          marginTop: 7,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
        }}
      >
        {bars.map((height, index) => {
          const bar = interpolate(
            frame,
            [193 + index * 5, 207 + index * 5],
            [0, height],
            clamp,
          );
          return (
            <div
              key={index}
              style={{
                width: 16,
                height: 30 * bar,
                background: index === 2 ? P.gold : P.cyan,
                opacity: 0.72 + index * 0.07,
              }}
            />
          );
        })}
        <div
          style={{
            marginLeft: 8,
            paddingLeft: 9,
            borderLeft: `1px solid ${P.quiet}55`,
            display: 'flex',
            gap: 12,
          }}
        >
          <Metric value="3" label="PATIENT SUMMARIES" color={P.gold} delay={202} frame={frame} fps={fps} />
          <Metric value="2" label="COHORT MEMBERS" color={P.cyan} delay={211} frame={frame} fps={fps} />
        </div>
      </div>
    </div>
  );
};

export const LakehouseHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({
    frame,
    fps,
    config: {damping: 200},
    durationInFrames: 25,
  });
  const progress = interpolate(frame, [24, 198], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const finalStamp = spring({
    frame: frame - 218,
    fps,
    config: {damping: 14, stiffness: 210},
  });
  const fade = interpolate(frame, [252, 269], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const tickerX = interpolate(frame, [0, 270], [0, -410]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: P.night,
        color: P.paper,
        opacity: fade,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            'linear-gradient(rgba(55,213,223,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(55,213,223,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: tickerX,
          top: 0,
          width: 1400,
          height: 19,
          display: 'flex',
          alignItems: 'center',
          gap: 35,
          paddingLeft: 20,
          boxSizing: 'border-box',
          background: P.orange,
          color: P.night,
          fontFamily: '"Lucida Console", monospace',
          fontSize: 7.5,
          fontWeight: 800,
          letterSpacing: 1.3,
          whiteSpace: 'nowrap',
        }}
      >
        <span>FHIR TRANSIT AUTHORIZED</span>
        <span>RUN 747944567108899</span>
        <span>SERVERLESS WORKFLOW</span>
        <span>UNITY CATALOG VERIFIED</span>
        <span>FHIR TRANSIT AUTHORIZED</span>
        <span>RUN 747944567108899</span>
        <span>SERVERLESS WORKFLOW</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 31,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 10}px)`,
        }}
      >
        <div
          style={{
            color: P.cyan,
            fontFamily: '"Lucida Console", monospace',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.8,
          }}
        >
          HEALTHCARE DATA / MEDALLION LINE
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'Rockwell, serif',
            fontSize: 28,
            lineHeight: 1,
            letterSpacing: -0.7,
          }}
        >
          Raw FHIR in. Trusted analytics out.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 91,
          display: 'flex',
          gap: 17,
        }}
      >
        <Metric value="20" label="FHIR RESOURCES" color={P.orange} delay={20} frame={frame} fps={fps} />
        <Metric value="8" label="QUALITY CHECKS" color={P.green} delay={30} frame={frame} fps={fps} />
        <Metric value="1" label="AUDIT EXCEPTION" color={P.red} delay={40} frame={frame} fps={fps} />
      </div>

      <GoldOutput frame={frame} fps={fps} />

      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 215,
          height: 3,
          background: 'rgba(133,160,184,0.22)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${P.orange}, ${P.cyan}, ${P.gold})`,
            boxShadow: `0 0 13px ${P.cyan}77`,
          }}
        />
      </div>

      {stations.map((station) => (
        <Station key={station.code} station={station} frame={frame} fps={fps} />
      ))}
      {resources.map((resource) => (
        <ResourcePacket key={resource.label} resource={resource} frame={frame} />
      ))}

      <AuditBranch frame={frame} fps={fps} />

      <div
        style={{
          position: 'absolute',
          left: 28,
          right: 28,
          bottom: 18,
          height: 46,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${P.quiet}55`,
          borderBottom: `1px solid ${P.quiet}55`,
          background: 'rgba(13,41,67,0.76)',
        }}
      >
        {tasks.map((task, index) => (
          <TaskChip key={task.label} task={task} index={index} frame={frame} fps={fps} />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 316,
          width: 220,
          padding: '10px 12px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `2px solid ${P.green}`,
          background: 'rgba(61,221,156,0.08)',
          opacity: finalStamp,
          transform: `scale(${0.78 + finalStamp * 0.22}) rotate(${(1 - finalStamp) * -3}deg)`,
          boxShadow: `0 0 20px rgba(61,221,156,${0.2 * finalStamp})`,
        }}
      >
        <div
          style={{
            width: 33,
            height: 33,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 auto',
            background: P.green,
            color: P.night,
            fontFamily: '"Lucida Console", monospace',
            fontSize: 17,
            fontWeight: 800,
          }}
        >
          ✓
        </div>
        <div>
          <div
            style={{
              color: P.green,
              fontFamily: '"Lucida Console", monospace',
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: 1.1,
            }}
          >
            6 TASKS · SUCCESS
          </div>
          <div
            style={{
              marginTop: 4,
              color: P.paper,
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: 10,
            }}
          >
            Raw truth kept. Useful views published.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
