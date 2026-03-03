import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ExternalLink, Github, Filter, X } from 'lucide-react';
import { projects } from '../../data/projects';
import { TextShimmer } from '../effects/TextShimmer';

// Lerp utility for smooth animations
const lerp = (start, end, factor) => start + (end - start) * factor;

export default function ProjectsPage() {
  // ── Skills filter state ──
  const [selectedSkills, setSelectedSkills] = useState([]);

  const allSkills = useMemo(() => {
    const skills = new Set();
    projects.forEach(p => p.technologies.forEach(t => skills.add(t)));
    return Array.from(skills).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return projects;
    return projects.filter(p =>
      selectedSkills.some(skill => p.technologies.includes(skill))
    );
  }, [selectedSkills]);

  const toggleSkill = useCallback((skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSkills([]);
  }, []);

  // ── Parallax slider state ──
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const projectRefs = useRef(new Map());
  const imageRefs = useRef(new Map());
  const rafRef = useRef(null);
  const scrollState = useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    sliderHeight: 0,
    cardHeight: 0,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate card height based on slider container
  const updateDimensions = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    scrollState.current.sliderHeight = rect.height;
    scrollState.current.cardHeight = rect.height; // each card = full slider height
  }, []);

  // Snap to nearest project
  const snapToProject = useCallback(() => {
    const s = scrollState.current;
    if (s.cardHeight === 0) return;
    const current = Math.round(-s.targetY / s.cardHeight);
    const clamped = Math.max(0, Math.min(current, filteredProjects.length - 1));
    const target = -clamped * s.cardHeight;
    s.isSnapping = true;
    s.snapStart = { time: Date.now(), y: s.targetY, target };
  }, [filteredProjects.length]);

  // Navigate to specific project
  const goToProject = useCallback((index) => {
    const s = scrollState.current;
    const target = -index * s.cardHeight;
    s.isSnapping = true;
    s.snapStart = { time: Date.now(), y: s.targetY, target };
  }, []);

  // Animation loop
  useEffect(() => {
    updateDimensions();

    const SNAP_DURATION = 500;
    const LERP_FACTOR = 0.08;
    const SCROLL_SPEED = 0.6;
    const MAX_VELOCITY = 120;

    const animate = () => {
      const s = scrollState.current;
      const now = Date.now();

      // Clamp targetY
      const maxScroll = -(filteredProjects.length - 1) * s.cardHeight;
      s.targetY = Math.min(0, Math.max(maxScroll, s.targetY));

      // Auto-snap when idle
      if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 150) {
        if (s.cardHeight > 0) {
          const snapPoint = -Math.round(-s.targetY / s.cardHeight) * s.cardHeight;
          if (Math.abs(s.targetY - snapPoint) > 1) {
            s.isSnapping = true;
            s.snapStart = { time: now, y: s.targetY, target: snapPoint };
          }
        }
      }

      // Snap easing
      if (s.isSnapping) {
        const progress = Math.min((now - s.snapStart.time) / SNAP_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
        if (progress >= 1) s.isSnapping = false;
      }

      // Smooth lerp
      s.currentY = lerp(s.currentY, s.targetY, LERP_FACTOR);

      // Update project card positions
      projectRefs.current.forEach((el, index) => {
        if (!el) return;
        const y = index * s.cardHeight + s.currentY;
        el.style.transform = `translateY(${y}px)`;

        // Parallax on image
        const img = imageRefs.current.get(index);
        if (img) {
          const parallaxOffset = (-s.currentY - index * s.cardHeight) * 0.15;
          img.style.transform = `translateY(${parallaxOffset}px) scale(1.3)`;
        }
      });

      // Update active index
      if (s.cardHeight > 0) {
        const newActive = Math.round(-s.currentY / s.cardHeight);
        const clamped = Math.max(0, Math.min(newActive, filteredProjects.length - 1));
        setActiveIndex(clamped);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Event handlers
    const slider = sliderRef.current;
    if (!slider) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const s = scrollState.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(Math.min(e.deltaY * SCROLL_SPEED, MAX_VELOCITY), -MAX_VELOCITY);
      s.targetY -= delta;
    };

    const onTouchStart = (e) => {
      const s = scrollState.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const s = scrollState.current;
      if (!s.isDragging) return;
      s.targetY = s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.2;
      s.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => {
      scrollState.current.isDragging = false;
    };

    slider.addEventListener('wheel', onWheel, { passive: false });
    slider.addEventListener('touchstart', onTouchStart, { passive: true });
    slider.addEventListener('touchmove', onTouchMove, { passive: false });
    slider.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', updateDimensions);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      slider.removeEventListener('wheel', onWheel);
      slider.removeEventListener('touchstart', onTouchStart);
      slider.removeEventListener('touchmove', onTouchMove);
      slider.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', updateDimensions);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [filteredProjects.length, updateDimensions]);

  // Reset scroll position when filter changes
  useEffect(() => {
    const s = scrollState.current;
    s.targetY = 0;
    s.currentY = 0;
    s.isSnapping = false;
    setActiveIndex(0);
  }, [selectedSkills]);

  const activeProject = filteredProjects[activeIndex] || filteredProjects[0];

  return (
    <div ref={containerRef} className="prx-page">
      {/* ── Dynamic background image (blurred, low opacity) ── */}
      {activeProject && (
        <div
          key={activeProject.id}
          className="prx-bg-image"
          style={{ backgroundImage: `url(${activeProject.image})` }}
        />
      )}

      {/* ── Header ── */}
      <div className="prx-header">
        <span className="font-display text-gold text-lg tracking-widest">03</span>
        <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight mt-1 mb-4">
          <TextShimmer as="span">Selected Work</TextShimmer>
        </h2>
        <div className="gold-line w-16 mb-2" />
      </div>

      {/* ── Main Content Area ── */}
      <div className="prx-content">
        {/* Parallax Slider */}
        <div className="prx-slider" ref={sliderRef}>
          {/* Project Cards — Three-column layout */}
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="prx-card"
              ref={el => {
                if (el) projectRefs.current.set(index, el);
                else projectRefs.current.delete(index);
              }}
            >
              {/* LEFT COLUMN — Title, number, category, links */}
              <div className="prx-col prx-col-left">
                <div className="prx-left-top">
                  <span className="prx-card-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="prx-card-category">{project.category}</span>
                </div>
                <h3 className="prx-card-title">{project.title}</h3>
                <div className="prx-card-metric">
                  <span className="prx-metric-value">{project.keyMetric}</span>
                </div>
                <div className="prx-card-links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="prx-link">
                      <Github size={14} /> Source
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="prx-link">
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </div>

              {/* CENTER COLUMN — Skills above, image below */}
              <div className="prx-col prx-col-center">
                <div className="prx-card-skills">
                  {project.technologies.map(tech => (
                    <span key={tech} className="prx-skill-badge">{tech}</span>
                  ))}
                </div>
                <div className="prx-card-image">
                  <img
                    src={project.image}
                    alt={project.title}
                    ref={el => {
                      if (el) imageRefs.current.set(index, el);
                      else imageRefs.current.delete(index);
                    }}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN — Description & features */}
              <div className="prx-col prx-col-right">
                <p className="prx-card-desc">{project.description}</p>
                <ul className="prx-card-features">
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="prx-empty">
              <p className="font-body text-[#4A4F6A]">No projects match the selected skills.</p>
              <button onClick={clearFilters} className="prx-clear-btn mt-3">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Minimap Sidebar ── */}
        <div className="prx-minimap">
          <div className="prx-minimap-inner">
            {filteredProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => goToProject(index)}
                className={`prx-minimap-item ${activeIndex === index ? 'prx-minimap-active' : ''}`}
              >
                <div className="prx-minimap-thumb">
                  <img src={project.image} alt="" />
                </div>
                <div className="prx-minimap-info">
                  <span className="prx-minimap-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="prx-minimap-title">{project.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="prx-scroll-indicator">
            <div className="prx-scroll-track">
              <div
                className="prx-scroll-thumb"
                style={{
                  height: filteredProjects.length > 0
                    ? `${100 / filteredProjects.length}%`
                    : '100%',
                  top: filteredProjects.length > 0
                    ? `${(activeIndex / filteredProjects.length) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills Filter Bar (Bottom) ── */}
      <div className="prx-filter-bar">
        <div className="prx-filter-header">
          <Filter size={14} className="text-navy/70" />
          <span className="prx-filter-label">Filter by Skill</span>
          {selectedSkills.length > 0 && (
            <button onClick={clearFilters} className="prx-filter-clear">
              <X size={12} /> Clear ({selectedSkills.length})
            </button>
          )}
        </div>
        <div className="prx-filter-pills">
          {allSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`prx-pill ${selectedSkills.includes(skill) ? 'prx-pill-active' : ''}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
