import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TextShimmer } from '../effects/TextShimmer';

const CARD_WIDTH = 120;
const CARD_HEIGHT = 155;

/**
 * Animation phases:
 *  1. "scatter"  – cards at random off-screen positions, invisible
 *  2. "line"     – cards fly into a horizontal line, evenly spaced across the screen (stays 30s)
 *  3. "circle"   – cards morph from the line into the final ellipse
 */

function ProjectCard({ project, index, total, containerSize, onSelect, phase, scatterPos, selectedFilter }) {
  const [isHovered, setIsHovered] = useState(false);

  const isFiltered = selectedFilter && !project.technologies.some(
    t => t.toLowerCase() === selectedFilter.toLowerCase()
  ) && !project.category.toLowerCase().includes(selectedFilter.toLowerCase());

  // ── Final circle position ──
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;

  // Dynamic radii based on container size — keeps all cards visible
  const safetyMargin = 16;
  const maxRadiusY = Math.max(60, containerSize.height / 2 - CARD_HEIGHT / 2 - safetyMargin);
  const maxRadiusX = Math.max(80, containerSize.width / 2 - CARD_WIDTH / 2 - safetyMargin);
  const radiusX = Math.min(maxRadiusX, 280);
  const radiusY = Math.min(maxRadiusY, 210);

  const circleX = Math.cos(angle) * radiusX;
  const circleY = Math.sin(angle) * radiusY;

  // ── Line position: dynamic spacing across screen width ──
  // Formula: availableWidth / (total * cardWidth) = gap ratio
  // Then distribute cards evenly with equal gaps from edge to edge
  const edgePadding = 40;
  const availableWidth = containerSize.width - edgePadding * 2;
  const totalCardsWidth = total * CARD_WIDTH;
  const totalGapSpace = availableWidth - totalCardsWidth;
  const gapBetween = Math.max(8, totalGapSpace / (total + 1)); // gaps = total + 1 (including edges)
  // Position of each card center: edgePadding + gapBetween + index * (CARD_WIDTH + gapBetween) + CARD_WIDTH/2
  // Relative to center of container:
  const lineStartX = edgePadding + gapBetween + CARD_WIDTH / 2 - containerSize.width / 2;
  const lineX = lineStartX + index * (CARD_WIDTH + gapBetween);
  const lineY = 0;

  // ── Target based on current phase ──
  let targetX, targetY, targetScale, targetOpacity, targetRotate;

  if (phase === 'scatter') {
    targetX = scatterPos.x;
    targetY = scatterPos.y;
    targetScale = 0.4;
    targetOpacity = 0;
    targetRotate = scatterPos.rotation;
  } else if (phase === 'line') {
    targetX = lineX;
    targetY = lineY;
    targetScale = 0.8;
    targetOpacity = 1;
    targetRotate = 0;
  } else {
    // circle
    targetX = circleX;
    targetY = circleY;
    targetScale = isHovered ? 1.1 : 1;
    targetOpacity = isFiltered ? 0.3 : 1;
    targetRotate = 0;
  }

  const getTransition = () => {
    if (phase === 'scatter') return { duration: 0 };
    if (phase === 'line') {
      return { type: 'spring', stiffness: 55, damping: 13, delay: index * 0.05 };
    }
    return { type: 'spring', stiffness: 45, damping: 16, delay: index * 0.06 };
  };

  return (
    <motion.div
      animate={{
        x: targetX,
        y: targetY,
        scale: targetScale,
        opacity: targetOpacity,
        rotate: targetRotate,
      }}
      transition={getTransition()}
      whileTap={phase === 'circle' ? { scale: 0.95 } : undefined}
      onClick={() => phase === 'circle' && !isFiltered && onSelect(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="prx-circle-card"
      style={{
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -CARD_HEIGHT / 2,
        zIndex: isHovered ? 20 : 10,
        cursor: phase === 'circle' && !isFiltered ? 'pointer' : 'default',
      }}
    >
      {/* Project image */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered && phase === 'circle' ? 'scale(1.1)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: isHovered
              ? 'linear-gradient(to top, rgba(22,25,39,0.85) 0%, rgba(22,25,39,0.1) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(22,25,39,0.7) 0%, rgba(22,25,39,0.2) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
        <span className="text-gold text-[8px] font-bold tracking-widest uppercase block mb-0.5">
          {project.category}
        </span>
        <h4 className="text-white text-[10px] font-semibold leading-tight line-clamp-2">
          {project.title}
        </h4>
        {isHovered && phase === 'circle' && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold/80 text-[8px] mt-0.5 block font-medium"
          >
            {project.keyMetric}
          </motion.span>
        )}
      </div>

      {/* Hover glow */}
      {isHovered && phase === 'circle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(184, 134, 11, 0.3), 0 8px 32px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </motion.div>
  );
}

export default function CircleOfCards({ projects, onSelectProject }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState('scatter');
  const [selectedFilter, setSelectedFilter] = useState(null);

  // ── Collect unique skills/categories for filtering ──
  const allSkills = useMemo(() => {
    const skills = new Set();
    projects.forEach(p => {
      skills.add(p.category);
      p.technologies.forEach(t => skills.add(t));
    });
    return Array.from(skills).sort();
  }, [projects]);

  // ── Measure container ──
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
      setIsMobile(rect.width < 640);
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();

    return () => observer.disconnect();
  }, []);

  // ── Intro animation: scatter → line (30s) → circle ──
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('line'), 300);
    const t2 = setTimeout(() => setPhase('circle'), 1300); // 300ms + 500ms animation + 500ms stay
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ── Stable random scatter positions (computed once) ──
  const scatterPositions = useMemo(() => {
    return projects.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 140,
    }));
  }, [projects.length]);

  const showCenterText = phase === 'circle';
  const showFilter = phase === 'circle';

  // ── Mobile: simple grid ──
  if (isMobile) {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full overflow-y-auto px-4 py-6"
      >
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-light tracking-tight text-navy">
            <TextShimmer>My showcase of</TextShimmer>
          </h2>
          <h2 className="font-display text-2xl font-light tracking-tight text-navy mt-1">
            <TextShimmer>Projects Collection</TextShimmer>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelectProject(project)}
              className="prx-circle-card relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ height: 180 }}
            >
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(22,25,39,0.8) 0%, transparent 60%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <span className="text-gold text-[8px] font-bold tracking-widest uppercase block">
                  {project.category}
                </span>
                <h4 className="text-white text-[10px] font-semibold leading-tight">
                  {project.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Desktop: animated circle ──
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="prx-circle-container"
    >
      {/* Center text — fades in after the circle forms */}
      <motion.div
        className="prx-circle-center-text"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: showCenterText ? 1 : 0,
          scale: showCenterText ? 1 : 0.85,
        }}
        transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
      >
        <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-navy leading-snug">
          <TextShimmer>My showcase of</TextShimmer>
        </h2>
        <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-navy leading-snug mt-1">
          <TextShimmer>Projects Collection</TextShimmer>
        </h2>
        <div className="gold-line w-12 mx-auto mt-3" />
      </motion.div>

      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          total={projects.length}
          containerSize={containerSize}
          onSelect={onSelectProject}
          phase={phase}
          scatterPos={scatterPositions[index]}
          selectedFilter={selectedFilter}
        />
      ))}

      {/* Skills filter — appears after circle animation */}
      {showFilter && (
        <motion.div
          className="prx-skills-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            className={`prx-filter-chip ${!selectedFilter ? 'prx-filter-chip-active' : ''}`}
            onClick={() => setSelectedFilter(null)}
          >
            All
          </button>
          {allSkills.map(skill => (
            <button
              key={skill}
              className={`prx-filter-chip ${selectedFilter === skill ? 'prx-filter-chip-active' : ''}`}
              onClick={() => setSelectedFilter(selectedFilter === skill ? null : skill)}
            >
              {skill}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
