import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const palette = {
  ink: '#07110F',
  panel: '#0D1A17',
  line: 'rgba(169, 255, 214, 0.16)',
  mint: '#A9FFD6',
  green: '#4EF2A3',
  warm: '#F4EDDF',
  muted: '#91A69F',
  danger: '#FF746C',
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const Shield = ({size = 16, color = palette.green}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3 19 6v5.2c0 4.4-2.7 7.8-7 9.8-4.3-2-7-5.4-7-9.8V6l7-3Z"
      stroke={color}
      strokeWidth="1.7"
    />
    <path d="m8.8 12 2 2 4.5-4.6" stroke={color} strokeWidth="1.7" />
  </svg>
);

const Stage = ({label, detail, index, frame}) => {
  const start = 56 + index * 27;
  const active = interpolate(frame, [start, start + 12], [0, 1], clamp);
  const passed = frame > start + 23;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity: interpolate(frame, [start - 10, start], [0.25, 1], clamp),
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
          color: passed ? palette.ink : palette.green,
          background: passed
            ? palette.green
            : `rgba(78, 242, 163, ${0.07 + active * 0.1})`,
          border: `1px solid rgba(78, 242, 163, ${0.2 + active * 0.65})`,
          boxShadow: active > 0.1
            ? `0 0 ${18 * active}px rgba(78, 242, 163, ${0.22 * active})`
            : 'none',
          fontSize: 10,
          fontFamily: '"Trebuchet MS", sans-serif',
          fontWeight: 800,
        }}
      >
        {passed ? '✓' : String(index + 1).padStart(2, '0')}
      </div>
      <div>
        <div
          style={{
            color: palette.warm,
            fontFamily: '"Trebuchet MS", sans-serif',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: palette.muted,
            fontFamily: '"Trebuchet MS", sans-serif',
            fontSize: 8,
            marginTop: 1,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
};

const JsonLine = ({name, value, frame, delay}) => {
  const chars = Math.floor(
    interpolate(frame, [delay, delay + 22], [0, value.length], clamp),
  );
  const opacity = interpolate(frame, [delay - 4, delay + 4], [0, 1], clamp);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '82px 1fr',
        gap: 8,
        fontFamily: '"Trebuchet MS", sans-serif',
        fontSize: 9.5,
        lineHeight: 1.55,
        opacity,
      }}
    >
      <span style={{color: '#6FAF98'}}>{name}</span>
      <span style={{color: palette.mint}}>{value.slice(0, chars)}</span>
    </div>
  );
};

const PrivacyRoute = ({frame}) => {
  const blocked = spring({
    frame: frame - 24,
    fps: 30,
    config: {damping: 18, stiffness: 160},
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 28,
        top: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity: interpolate(frame, [10, 20], [0, 1], clamp),
      }}
    >
      <span
        style={{
          fontFamily: '"Trebuchet MS", sans-serif',
          fontSize: 8,
          letterSpacing: 1.5,
          color: palette.muted,
        }}
      >
        CLOUD ROUTE
      </span>
      <div
        style={{
          width: 45,
          height: 1,
          background: `linear-gradient(90deg, ${palette.line}, ${palette.danger})`,
        }}
      />
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          border: `1px solid rgba(255,116,108,${0.35 + blocked * 0.5})`,
          display: 'grid',
          placeItems: 'center',
          transform: `scale(${0.75 + blocked * 0.25})`,
          color: palette.danger,
          fontFamily: '"Trebuchet MS", sans-serif',
          fontWeight: 800,
          fontSize: 12,
          background: 'rgba(255,116,108,0.07)',
        }}
      >
        ×
      </div>
      <span
        style={{
          fontFamily: '"Trebuchet MS", sans-serif',
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: 1.3,
          color: palette.danger,
        }}
      >
        BLOCKED
      </span>
    </div>
  );
};

export const HipaaSafeHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {damping: 200},
    durationInFrames: 24,
  });
  const contentIn = spring({
    frame: frame - 22,
    fps,
    config: {damping: 200},
    durationInFrames: 26,
  });
  const fadeDown = interpolate(frame, [244, 266], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const scanProgress = interpolate(frame, [45, 154], [0, 1], clamp);
  const outputReady = spring({
    frame: frame - 178,
    fps,
    config: {damping: 18, stiffness: 170},
  });
  const documentX = interpolate(contentIn, [0, 1], [-36, 0]);
  const titleY = interpolate(intro, [0, 1], [14, 0]);
  const glowX = interpolate(frame, [0, 270], [-120, 980]);

  return (
    <AbsoluteFill
      style={{
        background: palette.ink,
        color: palette.warm,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            'linear-gradient(rgba(169,255,214,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(169,255,214,0.08) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 230,
          height: 600,
          left: glowX,
          top: -70,
          transform: 'rotate(18deg)',
          background:
            'linear-gradient(90deg, transparent, rgba(78,242,163,0.07), transparent)',
          filter: 'blur(18px)',
        }}
      />

      <div style={{position: 'absolute', inset: 0, opacity: fadeDown}}>
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            opacity: intro,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              border: `1px solid rgba(78,242,163,0.35)`,
              background: 'rgba(78,242,163,0.08)',
            }}
          >
            <Shield />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 20,
                lineHeight: 1,
                letterSpacing: -0.5,
              }}
            >
              Sensitive forms, structured.
            </div>
            <div
              style={{
                marginTop: 5,
                fontFamily: '"Trebuchet MS", sans-serif',
                fontSize: 8.5,
                color: palette.green,
                letterSpacing: 2.1,
                fontWeight: 800,
              }}
            >
              WITHOUT THE CLOUD
            </div>
          </div>
        </div>

        <PrivacyRoute frame={frame} />

        <div
          style={{
            position: 'absolute',
            left: 28,
            right: 28,
            top: 76,
            height: 334,
            display: 'grid',
            gridTemplateColumns: '285px 190px 1fr',
            gap: 14,
          }}
        >
          <div
            style={{
              position: 'relative',
              transform: `translateX(${documentX}px)`,
              opacity: contentIn,
              borderRadius: 15,
              overflow: 'hidden',
              background: '#F6F4EE',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Img
              src={staticFile('synthetic-form.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 7%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(7,17,15,0.06), transparent 16%, transparent 84%, rgba(7,17,15,0.08))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${scanProgress * 100}%`,
                height: 2,
                opacity: frame > 40 && frame < 160 ? 1 : 0,
                background: palette.green,
                boxShadow: '0 0 18px 4px rgba(78,242,163,0.55)',
              }}
            />
            {[
              {top: 58, left: 134, width: 118, delay: 66},
              {top: 82, left: 134, width: 126, delay: 88},
              {top: 204, left: 131, width: 126, delay: 115},
            ].map((box) => {
              const boxIn = interpolate(
                frame,
                [box.delay, box.delay + 8, box.delay + 25],
                [0, 1, 0.55],
                clamp,
              );
              return (
                <div
                  key={box.top}
                  style={{
                    position: 'absolute',
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: 21,
                    borderRadius: 4,
                    border: `1.5px solid rgba(28,179,111,${boxIn})`,
                    background: `rgba(78,242,163,${0.1 * boxIn})`,
                    boxShadow: `0 0 12px rgba(78,242,163,${0.12 * boxIn})`,
                  }}
                />
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: 10,
                bottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 8px',
                borderRadius: 20,
                color: '#0C6B43',
                background: 'rgba(236,255,246,0.94)',
                fontFamily: '"Trebuchet MS", sans-serif',
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: 0.7,
              }}
            >
              <Shield size={12} color="#0C6B43" />
              SYNTHETIC · NO PHI
            </div>
          </div>

          <div
            style={{
              borderRadius: 15,
              padding: '17px 15px',
              background: 'rgba(13,26,23,0.94)',
              border: `1px solid ${palette.line}`,
              opacity: contentIn,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 17,
              }}
            >
              <span
                style={{
                  fontFamily: '"Trebuchet MS", sans-serif',
                  fontSize: 8,
                  color: palette.muted,
                  letterSpacing: 1.7,
                  fontWeight: 800,
                }}
              >
                LOCAL PIPELINE
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: palette.green,
                  boxShadow: '0 0 10px rgba(78,242,163,0.65)',
                }}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
              <Stage label="Clean the scan" detail="CLAHE + deskew" index={0} frame={frame} />
              <Stage label="Read the fields" detail="Qwen2.5-VL" index={1} frame={frame} />
              <Stage label="Verify checks" detail="Tesseract ROI" index={2} frame={frame} />
              <Stage label="Enforce schema" detail="Pydantic JSON" index={3} frame={frame} />
            </div>
            <div
              style={{
                marginTop: 20,
                paddingTop: 13,
                borderTop: `1px solid ${palette.line}`,
                display: 'flex',
                justifyContent: 'space-between',
                color: palette.muted,
                fontFamily: '"Trebuchet MS", sans-serif',
                fontSize: 8,
              }}
            >
              <span>NETWORK</span>
              <span style={{color: palette.green, fontWeight: 800}}>OFFLINE</span>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: 15,
              padding: '16px 17px',
              background: 'rgba(13,26,23,0.94)',
              border: `1px solid rgba(169,255,214,${0.12 + outputReady * 0.16})`,
              opacity: contentIn,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: outputReady > 0.3 ? palette.green : '#F7C760',
                    boxShadow:
                      outputReady > 0.3
                        ? '0 0 10px rgba(78,242,163,0.65)'
                        : 'none',
                  }}
                />
                <span
                  style={{
                    fontFamily: '"Trebuchet MS", sans-serif',
                    fontSize: 8,
                    color: palette.muted,
                    letterSpacing: 1.6,
                    fontWeight: 800,
                  }}
                >
                  STRUCTURED OUTPUT
                </span>
              </div>
              <span
                style={{
                  padding: '4px 7px',
                  borderRadius: 20,
                  background: `rgba(78,242,163,${0.08 + outputReady * 0.08})`,
                  color: palette.green,
                  fontFamily: '"Trebuchet MS", sans-serif',
                  fontSize: 7.5,
                  fontWeight: 800,
                  opacity: outputReady,
                }}
              >
                SCHEMA VALID
              </span>
            </div>

            <div
              style={{
                borderRadius: 9,
                padding: '12px 11px',
                background: 'rgba(3,10,8,0.72)',
                border: '1px solid rgba(169,255,214,0.09)',
              }}
            >
              <JsonLine name="site_address" value='"606 Maple St",' frame={frame} delay={86} />
              <JsonLine name="date" value='"2026-04-02",' frame={frame} delay={106} />
              <JsonLine name="evacuation" value='"02:05",' frame={frame} delay={126} />
              <JsonLine name="alarm_method" value='"Other",' frame={frame} delay={146} />
              <JsonLine name="fire_location" value='"Kitchen"' frame={frame} delay={163} />
            </div>

            <div
              style={{
                marginTop: 13,
                padding: '13px 13px',
                borderRadius: 10,
                background:
                  'linear-gradient(135deg, rgba(78,242,163,0.13), rgba(78,242,163,0.04))',
                border: '1px solid rgba(78,242,163,0.22)',
                transform: `translateY(${(1 - outputReady) * 18}px)`,
                opacity: outputReady,
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
                      fontFamily: 'Georgia, serif',
                      fontSize: 17,
                      color: palette.mint,
                      letterSpacing: -0.3,
                    }}
                  >
                    Messy form → audit-ready row
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      fontFamily: '"Trebuchet MS", sans-serif',
                      fontSize: 8,
                      color: palette.muted,
                      letterSpacing: 0.4,
                    }}
                  >
                    One bad field degrades safely. The batch keeps moving.
                  </div>
                </div>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    display: 'grid',
                    placeItems: 'center',
                    color: palette.ink,
                    background: palette.green,
                    transform: `scale(${0.78 + outputReady * 0.22})`,
                  }}
                >
                  <Shield size={23} color={palette.ink} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 28,
            right: 28,
            bottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: contentIn,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 15,
              color: palette.muted,
              fontFamily: '"Trebuchet MS", sans-serif',
              fontSize: 7.5,
              letterSpacing: 1.1,
            }}
          >
            <span>QWEN2.5-VL</span>
            <span>·</span>
            <span>TESSERACT</span>
            <span>·</span>
            <span>PYDANTIC</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: palette.green,
              fontFamily: '"Trebuchet MS", sans-serif',
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            <Shield size={13} />
            100% LOCAL
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
