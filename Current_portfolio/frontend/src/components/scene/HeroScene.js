import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SplineScene } from '../ui/splite';
import { Spotlight } from '../ui/spotlight';
import { ArrowRight, Github, Linkedin, MapPin } from 'lucide-react';
import Typewriter from '../effects/Typewriter';
import { SkillBadges } from '../effects/SkillBadges';
import JobMatchAnalyzer from '../JobMatchAnalyzer';

/* ────────────────────────────────────────────
   Animated text reveal — staggered word reveal
   ──────────────────────────────────────────── */
function AnimatedText({ text, className, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`inline-block transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      } ${className || ''}`}
    >
      {text}
    </span>
  );
}

/* ────────────────────────────────────────────
   Floating particles background
   ──────────────────────────────────────────── */
function FloatingParticlesBg() {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * -20,
      opacity: 0.03 + Math.random() * 0.06,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-black/30 animate-float-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Loading screen while Spline loads
   ──────────────────────────────────────────── */
function LoadingOverlay({ isLoading }) {
  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-[#F4F5FA] transition-opacity duration-1000 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
        <p className="text-sm font-body text-black/50 tracking-widest uppercase">
          Loading scene
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Hero Scene — Spline 3D + Split Layout
   Responsive: adapts to mobile / tablet / desktop
   ──────────────────────────────────────────── */
export default function HeroScene({ onOpenBook }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
    setTimeout(() => setContentReady(true), 300);
  }, []);

  // Fallback: if Spline takes too long, show content anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!splineLoaded) {
        setSplineLoaded(true);
        setTimeout(() => setContentReady(true), 300);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [splineLoaded]);

  const handleOpenBook = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      if (onOpenBook) onOpenBook();
    }, 700);
  }, [onOpenBook]);

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        background: '#F4F5FA',
      }}
    >
      {/* Loading overlay */}
      <LoadingOverlay isLoading={!splineLoaded} />

      {/* Spotlight effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#D4A843"
      />
      <Spotlight
        className="-top-40 right-0 md:right-60 md:-top-20"
        fill="#8BA4C4"
      />

      {/* Floating particles */}
      <FloatingParticlesBg />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4F5FA]/90 via-transparent to-transparent z-[2] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F5FA] to-transparent z-[2] pointer-events-none" />

      {/* Main content — split layout on desktop, stacked on mobile */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">

        {/* ─── Left: Text content ─── */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-14 pb-6 sm:pt-16 sm:pb-8 md:py-8 relative z-10">

          {/* Status badge */}
          <div
            className={`transition-all duration-700 delay-300 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 mb-2 sm:mb-3 border border-black/15 bg-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-body text-black/60 tracking-wider uppercase">
                Open to opportunities
              </span>
            </div>
          </div>

          {/* Name — scales with viewport */}
          <div className="mb-0">
            <AnimatedText
              text="VIKRAM"
              className="block font-display text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-none"
              delay={contentReady ? 400 : 99999}
            />
          </div>
          <div className="mb-1.5 sm:mb-2">
            <AnimatedText
              text="KAVURI"
              className="block font-display text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black/85 leading-none"
              delay={contentReady ? 550 : 99999}
            />
          </div>

          {/* Gold divider */}
          <div
            className={`h-[2px] w-32 sm:w-48 md:w-64 lg:w-80 mb-1.5 sm:mb-2 transition-all duration-1000 delay-700 gold-line-flow ${
              contentReady
                ? 'opacity-100 scale-x-100'
                : 'opacity-0 scale-x-0'
            } origin-left`}
          />

          {/* Title + Location */}
          <div
            className={`transition-all duration-700 delay-[800ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-black/70 tracking-wide mb-0.5">
              Data Analytics Engineer
            </p>
            <div className="flex items-center gap-1.5 text-black/45 mb-1.5 sm:mb-2">
              <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="text-[11px] sm:text-xs md:text-sm font-body">Buffalo, NY</span>
            </div>
          </div>

          {/* Typewriter Titles — "I Will" section */}
          <div
            className={`transition-all duration-700 delay-[1000ms] mb-1.5 sm:mb-2 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Typewriter
              phrases={[
                'turn chaos into clarity',
                'make executives say wow',
                'ship results, not reports',
                'solve million-dollar problems',
                'build what others can’t',
              ]}
            />
          </div>

          {/* Domain Expertise Badges — centered flex-wrap */}
          <div
            className={`transition-all duration-700 delay-[1100ms] mb-1.5 sm:mb-2 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <SkillBadges />
          </div>

          {/* CTA + Social links + Job Fit Analyzer */}
          <div
            className={`flex flex-row flex-wrap items-center gap-2 sm:gap-3 transition-all duration-700 delay-[1200ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleOpenBook}
              className="group flex items-center gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-black text-white font-body font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide hover:bg-black/85 transition-all duration-300 hover:shadow-lg hover:shadow-black/15"
            >
              Open Portfolio
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href="https://github.com/vikramkavuri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 text-black/40 hover:text-black transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={15} className="sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://linkedin.com/in/vikramkavuri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 text-black/40 hover:text-black transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} className="sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Mobile: robot conversation bubble (robot is a bg on mobile) */}
          <div
            className={`md:hidden mt-4 transition-all duration-700 delay-[1300ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <JobMatchAnalyzer variant="bubble" />
          </div>

          {/* Scroll indicator */}
          <div
            className={`flex items-center gap-2 mt-2 sm:mt-3 transition-all duration-700 delay-[1500ms] ${
              contentReady ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-px h-4 sm:h-5 bg-gradient-to-b from-transparent via-gold to-transparent" />
            <span className="text-[9px] sm:text-[10px] md:text-xs font-body font-semibold tracking-[0.2em] uppercase gold-shimmer-text" style={{ filter: 'brightness(0.75) contrast(1.3)' }}>
              Scroll to explore
            </span>
          </div>
        </div>

        {/* ─── Right: Spline 3D Scene (desktop only) ─── */}
        <div className="flex-1 relative hidden md:block">
          <div
            className={`w-full h-full transition-all duration-1000 delay-200 ${
              splineLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>

          {/* Robot conversation bubble — looks like the 3D model is speaking */}
          <div
            className={`absolute top-[20%] left-[2%] lg:left-[4%] w-[16rem] lg:w-[18rem] z-20 transition-all duration-700 delay-[1400ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <JobMatchAnalyzer variant="bubble" />
          </div>

          {/* Gradient edge blending */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F5FA] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Mobile: Spline as subtle background */}
      <div className="absolute inset-0 md:hidden opacity-20">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
          onLoad={() => {
            if (!splineLoaded) handleSplineLoad();
          }}
        />
      </div>

      {/* Skip button (top-right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-[60]">
        <button
          onClick={handleOpenBook}
          className="text-[9px] sm:text-[10px] md:text-xs font-body text-black/60 hover:text-black transition-all duration-300 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 border-2 border-yellow-400 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-400/20 bg-white/50 backdrop-blur-sm"
        >
          Skip to Portfolio &rarr;
        </button>
      </div>
    </div>
  );
}
