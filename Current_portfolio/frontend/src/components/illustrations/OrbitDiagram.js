import React, { useRef, useState, useEffect } from 'react';

// Each ring has a unique startAngle offset so skills don't all begin at the same position.
// Skills within a ring are evenly spread across 360 degrees from that offset.
const RINGS = [
  {
    radius: 65,
    speed: 25,
    reverse: false,
    startAngle: 0,      // Inner ring starts at 0
    skills: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
      { name: 'PySpark', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg' },
      { name: 'Snowflake', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/snowflake/snowflake-original.svg' },
    ],
  },
  {
    radius: 115,
    speed: 35,
    reverse: true,
    startAngle: 36,     // Middle ring offset by 36 degrees
    skills: [
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      { name: 'Airflow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'Tableau', icon: 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg' },
    ],
  },
  {
    radius: 165,
    speed: 45,
    reverse: false,
    startAngle: 15,     // Outer ring offset by 15 degrees
    skills: [
      { name: 'Power BI', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg' },
      { name: 'Hadoop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hadoop/hadoop-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'R', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
    ],
  },
];

export default function OrbitDiagram({ className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const outerRadius = RINGS[RINGS.length - 1].radius;
  const containerSize = (outerRadius + 40) * 2;

  return (
    <div
      ref={ref}
      className={`flex justify-center ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div
        className="relative"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Center core */}
        <div
          className="absolute border-2 border-gold/40 bg-page flex items-center justify-center z-10"
          style={{
            width: 70,
            height: 70,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="font-body text-[9px] text-center text-navy font-medium uppercase tracking-wider leading-tight px-1">
            Data<br />Engineering
          </span>
        </div>

        {/* Orbit rings */}
        {RINGS.map((ring, ri) => {
          const skillCount = ring.skills.length;
          const angleStep = 360 / skillCount;

          return (
            <div key={ri}>
              {/* Dashed orbit track */}
              <div
                className="absolute border border-dashed border-navy/10 rounded-full"
                style={{
                  width: ring.radius * 2,
                  height: ring.radius * 2,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Each skill orbits independently via its own animation-delay */}
              {ring.skills.map((skill, si) => {
                const startAngle = (ring.startAngle || 0) + angleStep * si;
                // Negative delay offsets starting position around the circle
                const delay = -(ring.speed * (startAngle / 360));
                const isHovered = hoveredSkill === `${ri}-${si}`;

                return (
                  <React.Fragment key={skill.name}>
                    {/* Orbit wrapper: rotates around center, positioned at center */}
                    <div
                      className="absolute"
                      style={{
                        width: 0,
                        height: 0,
                        left: '50%',
                        top: '50%',
                        animation: `orbitRotate ${ring.speed}s linear infinite`,
                        animationDirection: ring.reverse ? 'reverse' : 'normal',
                        animationDelay: `${delay}s`,
                        animationPlayState: isVisible ? 'running' : 'paused',
                      }}
                    >
                      {/* Push outward to orbit radius */}
                      <div
                        style={{
                          position: 'absolute',
                          left: ring.radius,
                          top: 0,
                        }}
                      >
                        {/* Counter-rotate to keep icon upright */}
                        <div
                          style={{
                            animation: `orbitRotate ${ring.speed}s linear infinite`,
                            animationDirection: ring.reverse ? 'normal' : 'reverse',
                            animationDelay: `${delay}s`,
                            animationPlayState: isVisible ? 'running' : 'paused',
                          }}
                        >
                          <div
                            className="relative flex items-center justify-center cursor-pointer transition-transform duration-200"
                            style={{
                              width: 32,
                              height: 32,
                              marginLeft: -16,
                              marginTop: -16,
                              transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                            }}
                            onMouseEnter={() => setHoveredSkill(`${ri}-${si}`)}
                            onMouseLeave={() => setHoveredSkill(null)}
                          >
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-5 h-5 object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            {/* Tooltip */}
                            {isHovered && (
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-[#161927] text-[9px] font-body text-white z-20">
                                {skill.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
