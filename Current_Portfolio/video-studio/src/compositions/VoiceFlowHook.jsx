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
  black: '#090B0D',
  panel: '#11161A',
  panel2: '#171E23',
  bone: '#F4F0E8',
  dim: '#8A969D',
  line: '#2A343A',
  cyan: '#54E6D4',
  red: '#FF5B62',
  amber: '#FFC764',
  blue: '#7FAEFF',
  green: '#70E29C',
};

const sans = '"Aptos Display", "Segoe UI", Inter, sans-serif';
const mono = '"Cascadia Code", Consolas, monospace';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const enter = (frame, start, end = start + 12) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const leave = (frame, start, end = start + 10) =>
  interpolate(frame, [start, end], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

const Background = ({accent = C.cyan}) => (
  <>
    <AbsoluteFill style={{background: C.black}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
        backgroundSize: '29px 29px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -100,
        top: -170,
        width: 520,
        height: 520,
        borderRadius: '50%',
        background: accent,
        opacity: 0.06,
        filter: 'blur(85px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 16,
        border: `1px solid ${C.line}`,
        pointerEvents: 'none',
      }}
    />
  </>
);

const Header = ({step, right = '100% ON-DEVICE'}) => (
  <div
    style={{
      position: 'absolute',
      left: 34,
      right: 34,
      top: 26,
      paddingBottom: 9,
      borderBottom: `1px solid ${C.line}`,
      display: 'flex',
      justifyContent: 'space-between',
      color: C.dim,
      fontFamily: mono,
      fontSize: 7,
      fontWeight: 700,
      letterSpacing: 1.4,
    }}
  >
    <span>{step}</span>
    <span>{right}</span>
  </div>
);

const Pill = ({children, color = C.cyan, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      height: 23,
      padding: '0 9px',
      border: `1px solid ${color}80`,
      background: `${color}12`,
      color,
      fontFamily: mono,
      fontSize: 7,
      fontWeight: 900,
      letterSpacing: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);

const Dot = ({color = C.cyan}) => (
  <span
    style={{
      display: 'inline-block',
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 9px ${color}`,
    }}
  />
);

const Waveform = ({frame, start = 0, color = C.cyan, quiet = false}) => {
  const bars = Array.from({length: 58}, (_, i) => {
    const pulse =
      Math.sin((i + frame * 1.15) * 0.58) * 0.5 +
      Math.sin((i * 0.83 - frame * 0.7) * 0.42) * 0.5;
    const envelope = Math.sin((i / 57) * Math.PI);
    const level = quiet ? 0.18 : Math.max(0.18, Math.abs(pulse) * envelope);
    return 8 + level * 69;
  });
  const progress = interpolate(frame, [start, start + 42], [0, 1], clamp);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        height: 102,
        width: 650,
        overflow: 'hidden',
      }}
    >
      {bars.map((height, i) => {
        const active = i / bars.length <= progress;
        return (
          <div
            key={i}
            style={{
              width: 7,
              height,
              borderRadius: 4,
              background: active ? color : C.line,
              opacity: active ? 0.96 : 0.55,
              boxShadow: active ? `0 0 9px ${color}33` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

const Key = ({children, wide = false}) => (
  <div
    style={{
      minWidth: wide ? 75 : 50,
      height: 45,
      padding: '0 12px',
      border: `1px solid ${C.line}`,
      borderBottom: `4px solid ${C.line}`,
      background: C.panel2,
      color: C.bone,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: 0.8,
    }}
  >
    {children}
  </div>
);

const HotkeyScene = ({frame, fps}) => {
  const out = leave(frame, 57, 68);
  const keySpring = spring({
    frame: frame - 8,
    fps,
    config: {damping: 12, stiffness: 150},
  });
  const pulse = interpolate(
    Math.sin(frame * 0.35),
    [-1, 1],
    [0.65, 1],
  );

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Background />
      <Header step="01 // CAPTURE" right="WINDOWS GLOBAL HOTKEY" />

      <div style={{position: 'absolute', left: 45, top: 76, width: 475}}>
        <Pill color={C.red}>
          <Dot color={C.red} /> RECORDING
        </Pill>
        <div
          style={{
            marginTop: 13,
            color: C.bone,
            fontFamily: sans,
            fontSize: 61,
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: -3.7,
          }}
        >
          TALK.
          <br />
          <span style={{color: C.cyan}}>IT TYPES.</span>
        </div>
        <div
          style={{
            marginTop: 22,
            color: C.dim,
            fontFamily: mono,
            fontSize: 8,
            letterSpacing: 1,
          }}
        >
          NO CLOUD · NO API KEY · NO UPLOAD
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 45,
          top: 87,
          width: 305,
          height: 194,
          background: C.panel,
          border: `1px solid ${C.line}`,
          boxShadow: `14px 14px 0 ${C.cyan}10`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${(1 - keySpring) * 35}px) scale(${0.94 + keySpring * 0.06})`,
          opacity: keySpring,
        }}
      >
        <div
          style={{
            color: C.dim,
            fontFamily: mono,
            fontSize: 7,
            letterSpacing: 1.4,
            marginBottom: 19,
          }}
        >
          PRESS ANYWHERE
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Key>CTRL</Key>
          <span style={{color: C.dim, fontFamily: mono}}>+</span>
          <Key>SHIFT</Key>
          <span style={{color: C.dim, fontFamily: mono}}>+</span>
          <Key wide>SPACE</Key>
        </div>
        <div
          style={{
            marginTop: 18,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C.red,
            opacity: pulse,
            boxShadow: `0 0 ${15 * pulse}px ${C.red}`,
          }}
        />
      </div>

      <div style={{position: 'absolute', left: 45, bottom: 47}}>
        <Waveform frame={frame} start={12} />
      </div>
    </AbsoluteFill>
  );
};

const Token = ({children, stable = false, active = false}) => (
  <span
    style={{
      display: 'inline-block',
      marginRight: 9,
      marginBottom: 8,
      padding: '4px 2px',
      color: active ? C.black : stable ? C.bone : C.dim,
      background: active ? C.cyan : 'transparent',
      borderBottom: `2px solid ${stable ? C.cyan : C.line}`,
      fontFamily: sans,
      fontSize: 21,
      fontWeight: 700,
      lineHeight: 1.1,
    }}
  >
    {children}
  </span>
);

const PreviewScene = ({frame, fps}) => {
  const local = frame - 63;
  const opacity = enter(frame, 63, 74) * leave(frame, 124, 138);
  const commit = spring({
    frame: local - 35,
    fps,
    config: {damping: 14, stiffness: 155},
  });
  const cursor = Math.floor(local / 6) % 2 === 0;
  const confirmedWidth = interpolate(local, [15, 58], [4, 100], clamp);

  return (
    <AbsoluteFill style={{opacity}}>
      <Background accent={C.blue} />
      <Header step="02 // LIVE PREVIEW" right="PARTIALS ~ EVERY 0.5S" />

      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 76,
          width: 240,
        }}
      >
        <Pill color={C.blue}>
          <Dot color={C.blue} /> LISTENING
        </Pill>
        <div
          style={{
            marginTop: 17,
            color: C.bone,
            fontFamily: sans,
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 0.94,
            letterSpacing: -2.1,
          }}
        >
          WORDS
          <br />
          <span style={{color: C.blue}}>SETTLE</span>
          <br />
          AS YOU SPEAK.
        </div>
        <div
          style={{
            marginTop: 19,
            color: C.dim,
            fontFamily: mono,
            fontSize: 7,
            lineHeight: 1.6,
            letterSpacing: 0.5,
          }}
        >
          SILERO VAD
          <br />
          PARAKEET TDT v3
          <br />
          LOCALAGREEMENT-2
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 322,
          right: 44,
          top: 82,
          height: 285,
          border: `1px solid ${C.line}`,
          background: C.panel,
          padding: '21px 23px',
          boxShadow: `13px 13px 0 ${C.blue}0E`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 13,
            borderBottom: `1px solid ${C.line}`,
            fontFamily: mono,
            fontSize: 7,
            letterSpacing: 1.1,
            color: C.dim,
          }}
        >
          <span>LIVE TRANSCRIPT</span>
          <span style={{color: C.blue}}>00:07</span>
        </div>

        <div style={{marginTop: 26, width: 465}}>
          <Token stable>Schedule</Token>
          <Token stable>the</Token>
          <Token stable>follow-up</Token>
          <Token stable>for</Token>
          <Token stable>Thursday</Token>
          <Token active={local > 34}>and</Token>
          <Token stable={local > 34}>send</Token>
          <Token stable={local > 39}>the</Token>
          <Token stable={local > 45}>updated</Token>
          <Token stable={local > 50}>care</Token>
          <Token stable={local > 55}>plan.</Token>
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 24,
              background: C.blue,
              opacity: cursor ? 1 : 0.2,
              verticalAlign: 'middle',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 23,
            right: 23,
            bottom: 26,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: C.dim,
              fontFamily: mono,
              fontSize: 7,
              marginBottom: 8,
            }}
          >
            <span>STABLE WINDOW</span>
            <span style={{color: C.cyan, opacity: commit}}>COMMITTED</span>
          </div>
          <div style={{height: 4, background: C.line}}>
            <div
              style={{
                width: `${confirmedWidth}%`,
                height: '100%',
                background: C.cyan,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 322,
          right: 44,
          bottom: 45,
          color: C.dim,
          fontFamily: mono,
          fontSize: 7,
          letterSpacing: 0.6,
        }}
      >
        THE PREVIEW FEELS INSTANT. THE FINAL TEXT GETS FULL CONTEXT.
      </div>
    </AbsoluteFill>
  );
};

const Stage = ({frame, fps, delay, label, sub, color}) => {
  const show = spring({
    frame: frame - delay,
    fps,
    config: {damping: 17, stiffness: 155},
  });
  return (
    <div
      style={{
        width: 145,
        height: 71,
        border: `1px solid ${color}75`,
        background: `${color}0B`,
        padding: '14px 13px',
        opacity: show,
        transform: `translateY(${(1 - show) * 20}px)`,
      }}
    >
      <div
        style={{
          color,
          fontFamily: sans,
          fontSize: 14,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          color: C.dim,
          fontFamily: mono,
          fontSize: 6,
          lineHeight: 1.35,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

const CorrectionScene = ({frame, fps}) => {
  const local = frame - 133;
  const opacity = enter(frame, 133, 144) * leave(frame, 195, 208);
  const strike = interpolate(local, [28, 42], [0, 100], clamp);
  const replace = spring({
    frame: local - 42,
    fps,
    config: {damping: 13, stiffness: 165},
  });
  const metric = interpolate(local, [34, 62], [11, 3.6], clamp);

  return (
    <AbsoluteFill style={{opacity}}>
      <Background accent={C.amber} />
      <Header step="03 // AUTHORITATIVE PASS" right="FULL-SESSION RE-DECODE" />

      <div style={{position: 'absolute', left: 44, top: 75, width: 360}}>
        <Pill color={C.amber}>FINAL TEXT // FULL CONTEXT</Pill>
        <div
          style={{
            marginTop: 15,
            color: C.bone,
            fontFamily: sans,
            fontSize: 45,
            fontWeight: 800,
            lineHeight: 0.91,
            letterSpacing: -2.5,
          }}
        >
          HEAR IT.
          <br />
          <span style={{color: C.amber}}>POLISH IT.</span>
          <br />
          GUARD IT.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 44,
          top: 78,
          width: 420,
          height: 155,
          border: `1px solid ${C.line}`,
          background: C.panel,
          padding: '20px 22px',
        }}
      >
        <div
          style={{
            color: C.dim,
            fontFamily: mono,
            fontSize: 7,
            letterSpacing: 1.2,
            marginBottom: 19,
          }}
        >
          TRANSCRIPT CORRECTION
        </div>
        <div
          style={{
            color: C.bone,
            fontFamily: sans,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          Update the{' '}
          <span style={{position: 'relative', color: C.dim}}>
            data base
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '54%',
                width: `${strike}%`,
                height: 2,
                background: C.red,
              }}
            />
          </span>
          <span
            style={{
              color: C.cyan,
              opacity: replace,
              marginLeft: 9,
              display: 'inline-block',
              transform: `translateY(${(1 - replace) * 12}px)`,
            }}
          >
            database
          </span>
          <br />
          before Thursday.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          top: 271,
          display: 'flex',
          alignItems: 'center',
          gap: 11,
        }}
      >
        <Stage
          frame={frame}
          fps={fps}
          delay={144}
          label="Parakeet"
          sub="12S WINDOWS · 4S OVERLAP"
          color={C.blue}
        />
        <span style={{color: C.dim, fontFamily: mono}}>→</span>
        <Stage
          frame={frame}
          fps={fps}
          delay={153}
          label="Llama 3.2"
          sub="FINETUNED · DIFF GUARDRAIL"
          color={C.amber}
        />
        <span style={{color: C.dim, fontFamily: mono}}>→</span>
        <Stage
          frame={frame}
          fps={fps}
          delay={162}
          label="KenLM"
          sub="HOMOPHONES · RESCORING"
          color={C.cyan}
        />
        <div
          style={{
            marginLeft: 'auto',
            width: 176,
            height: 71,
            background: C.bone,
            color: C.black,
            padding: '10px 13px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: sans,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            {metric.toFixed(1)}%
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 7,
              fontWeight: 900,
              lineHeight: 1.25,
            }}
          >
            INTERNAL
            <br />
            HARNESS WER
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 44,
          bottom: 37,
          color: C.dim,
          fontFamily: mono,
          fontSize: 7,
        }}
      >
        RAW ASR ~11% → CORRECTED 3.6% · PROJECT EVALUATION, NOT A UNIVERSAL BENCHMARK
      </div>
    </AbsoluteFill>
  );
};

const Metric = ({frame, fps, delay, value, label, color}) => {
  const show = spring({
    frame: frame - delay,
    fps,
    config: {damping: 15, stiffness: 145},
  });
  return (
    <div
      style={{
        opacity: show,
        transform: `translateY(${(1 - show) * 18}px)`,
      }}
    >
      <div
        style={{
          color,
          fontFamily: sans,
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: -0.8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          color: C.dim,
          fontFamily: mono,
          fontSize: 6,
          lineHeight: 1.3,
          letterSpacing: 0.8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const DeliveryScene = ({frame, fps}) => {
  const local = frame - 203;
  const opacity = enter(frame, 203, 215);
  const app = spring({
    frame: local - 5,
    fps,
    config: {damping: 15, stiffness: 130},
  });
  const typed =
    'Schedule the follow-up for Thursday and send the updated care plan.';
  const letters = Math.floor(
    interpolate(local, [20, 54], [0, typed.length], clamp),
  );
  const success = spring({
    frame: local - 51,
    fps,
    config: {damping: 12, stiffness: 170},
  });

  return (
    <AbsoluteFill style={{opacity}}>
      <Background accent={C.green} />
      <Header step="04 // DELIVER" right="FOCUSED APP · CLIPBOARD + PASTE" />

      <div style={{position: 'absolute', left: 44, top: 72, width: 330}}>
        <Pill color={C.green}>
          <Dot color={C.green} /> DELIVERED
        </Pill>
        <div
          style={{
            marginTop: 14,
            color: C.bone,
            fontFamily: sans,
            fontSize: 46,
            fontWeight: 850,
            lineHeight: 0.9,
            letterSpacing: -2.8,
          }}
        >
          YOUR VOICE.
          <br />
          <span style={{color: C.green}}>YOUR MACHINE.</span>
          <br />
          YOUR WORDS.
        </div>
        <div
          style={{
            marginTop: 23,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '17px 26px',
            width: 295,
          }}
        >
          <Metric
            frame={frame}
            fps={fps}
            delay={218}
            value="3.6%"
            label={'INTERNAL HARNESS WER'}
            color={C.cyan}
          />
          <Metric
            frame={frame}
            fps={fps}
            delay={224}
            value="OFFLINE"
            label={'AFTER MODEL SETUP'}
            color={C.blue}
          />
          <Metric
            frame={frame}
            fps={fps}
            delay={230}
            value="IN MEMORY"
            label={'AUDIO + TRANSCRIPTS'}
            color={C.amber}
          />
          <Metric
            frame={frame}
            fps={fps}
            delay={236}
            value="ONE HOTKEY"
            label={'TYPES INTO ANY APP'}
            color={C.green}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 44,
          top: 78,
          width: 444,
          height: 295,
          background: '#F5F6F8',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: `18px 18px 0 ${C.green}12`,
          transform: `translateY(${(1 - app) * 35}px)`,
          opacity: app,
        }}
      >
        <div
          style={{
            height: 34,
            background: '#E4E8EC',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '0 13px',
          }}
        >
          {[C.red, C.amber, C.green].map((color) => (
            <span
              key={color}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 8,
              color: '#68727A',
              fontFamily: mono,
              fontSize: 7,
            }}
          >
            CLINICAL NOTE
          </span>
        </div>
        <div style={{padding: '27px 30px'}}>
          <div
            style={{
              color: '#9CA5AC',
              fontFamily: mono,
              fontSize: 7,
              letterSpacing: 1.1,
            }}
          >
            FOLLOW-UP PLAN
          </div>
          <div
            style={{
              marginTop: 17,
              minHeight: 118,
              color: '#1D262D',
              fontFamily: sans,
              fontSize: 22,
              fontWeight: 650,
              lineHeight: 1.45,
            }}
          >
            {typed.slice(0, letters)}
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 23,
                background: C.blue,
                verticalAlign: 'middle',
                opacity: Math.floor(local / 5) % 2 ? 0.2 : 1,
              }}
            />
          </div>
          <div
            style={{
              height: 1,
              background: '#DCE1E4',
              marginTop: 20,
            }}
          />
          <div
            style={{
              marginTop: 17,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#238A51',
              fontFamily: mono,
              fontWeight: 900,
              fontSize: 8,
              opacity: success,
              transform: `translateY(${(1 - success) * 10}px)`,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#D9F6E5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✓
            </span>
            PASTED INTO TARGET
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 45,
          bottom: 37,
          color: C.dim,
          fontFamily: mono,
          fontSize: 7,
          letterSpacing: 0.7,
        }}
      >
        TAURI 2 · RUST · REACT · PYTHON SIDECAR · JSON-LINES IPC
      </div>
    </AbsoluteFill>
  );
};

export const VoiceFlowHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <HotkeyScene frame={frame} fps={fps} />
      <PreviewScene frame={frame} fps={fps} />
      <CorrectionScene frame={frame} fps={fps} />
      <DeliveryScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
