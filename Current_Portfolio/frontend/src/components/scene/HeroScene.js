import React, { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { SplineScene } from '../ui/splite';
import { Spotlight } from '../ui/spotlight';
import { ArrowRight, Github, Linkedin, MapPin } from 'lucide-react';
import Typewriter from '../effects/Typewriter';
import { SkillBadges } from '../effects/SkillBadges';

const JobMatchAnalyzer = lazy(() => import('../JobMatchAnalyzer'));

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
   Lightweight visual shown immediately while the optional 3D scene warms up
   ──────────────────────────────────────────── */
function HeroDataCore() {
  return (
    <div className="hero-data-core absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <div
        className="hero-data-core-halo absolute h-[34rem] w-[34rem] rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(212,168,67,0.18) 0%, rgba(139,164,196,0.11) 38%, rgba(244,245,250,0) 70%)',
        }}
      />
      <div className="hero-data-core-orbits relative h-[25rem] w-[25rem]">
        <div className="absolute inset-0 rounded-full border border-black/10" />
        <div className="absolute inset-12 rounded-full border border-[#D4A843]/35" />
        <div className="absolute inset-24 rounded-full border border-black/10" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-black/15 bg-white/75 shadow-2xl shadow-[#8BA4C4]/20 backdrop-blur-sm" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A843] shadow-[0_0_28px_rgba(212,168,67,0.75)]" />

        {[
          ['INGEST', 'top-5 left-1/2 -translate-x-1/2'],
          ['MODEL', 'bottom-16 -left-4'],
          ['DECIDE', 'bottom-16 -right-4'],
        ].map(([label, position]) => (
          <div
            key={label}
            className={`absolute ${position} border border-black/10 bg-white/75 px-3 py-2 shadow-lg backdrop-blur-sm`}
          >
            <span className="font-body text-[10px] font-semibold tracking-[0.22em] text-black/55">
              {label}
            </span>
          </div>
        ))}
        <p className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center font-display text-lg font-semibold tracking-wide text-black/65">
          Data that answers back.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Hero Scene — lightweight first paint + optional Spline enhancement
   Responsive: adapts to mobile / tablet / desktop
   ──────────────────────────────────────────── */
export default function HeroScene({ onOpenBook, onWarmBook }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [showSpline, setShowSpline] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  // Content never waits for the remote 3D scene. Enhanced 3D loads after
  // the document is complete; its container art-directs the same scene per breakpoint.
  useEffect(() => {
    const revealFrame = requestAnimationFrame(() => setContentReady(true));
    const isCompact = window.matchMedia('(max-width: 767px), (max-height: 600px) and (max-width: 1024px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const allowEnhancedScene = !reducedMotion && !navigator.connection?.saveData;
    let splineTimer;

    const scheduleSpline = () => {
      if (!allowEnhancedScene) return;
      splineTimer = window.setTimeout(
        () => setShowSpline(true),
        isCompact ? 900 : 2200
      );
    };

    if (document.readyState === 'complete') {
      scheduleSpline();
    } else {
      window.addEventListener('load', scheduleSpline, { once: true });
    }

    return () => {
      cancelAnimationFrame(revealFrame);
      window.clearTimeout(splineTimer);
      window.removeEventListener('load', scheduleSpline);
    };
  }, []);

  const handleOpenBook = useCallback(() => {
    if (onWarmBook) onWarmBook();
    setFadeOut(true);
    setTimeout(() => {
      if (onOpenBook) onOpenBook();
    }, 700);
  }, [onOpenBook, onWarmBook]);

  return (
    <div
      className="relative w-full min-h-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        background: '#F4F5FA',
        overflowX: 'clip',
      }}
    >
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
        <div className="hero-copy-column flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-14 pb-6 sm:pt-16 sm:pb-8 md:py-8 relative z-10">

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
            className={`h-[2px] w-32 sm:w-48 md:w-64 lg:w-80 mb-3 sm:mb-4 transition-all duration-1000 delay-700 gold-line-flow ${
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
            <div className="flex items-center gap-1.5 text-black/45 mb-3 sm:mb-4">
              <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="text-[11px] sm:text-xs md:text-sm font-body">Buffalo, NY</span>
            </div>
          </div>

          {/* Typewriter Titles — "I Will" section */}
          <div
            className={`transition-all duration-700 delay-[1000ms] mb-4 sm:mb-5 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Typewriter
              phrases={[
                'turn fragmented data into trusted decisions',
                'build analytics products leaders can act on',
                'engineer reliable data systems at scale',
                'connect business goals to measurable outcomes',
                'make governed data fast, clear, and useful',
              ]}
            />
          </div>

          {/* Domain Expertise Badges — centered flex-wrap */}
          <div
            className={`transition-all duration-700 delay-[1100ms] mb-5 sm:mb-6 ${
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
              onMouseEnter={onWarmBook}
              onFocus={onWarmBook}
              className="group flex min-h-11 items-center gap-2 px-4 sm:px-4 md:px-5 py-2 sm:py-2 md:py-2.5 bg-black text-white font-body font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide hover:bg-black/85 transition-all duration-300 hover:shadow-lg hover:shadow-black/15"
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
                className="flex h-11 w-11 items-center justify-center text-black/40 hover:text-black transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={15} className="sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://linkedin.com/in/vikramkavuri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center text-black/40 hover:text-black transition-colors duration-300"
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
            <Suspense fallback={null}>
              <JobMatchAnalyzer variant="bubble" />
            </Suspense>
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

        {/* ─── Right: adaptive Spline 3D Scene ─── */}
        <div className="hero-visual-shell flex-1 relative">
          <HeroDataCore />
          {showSpline && (
            <div
              className={`hero-spline-layer pointer-events-none absolute inset-0 ${
                splineLoaded ? 'is-loaded' : ''
              }`}
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                onLoad={handleSplineLoad}
              />
            </div>
          )}

          {/* Robot conversation bubble — looks like the 3D model is speaking */}
          <div
            className={`hero-desktop-ai-bubble hidden md:block absolute top-[20%] left-[2%] lg:left-[4%] w-[16rem] lg:w-[18rem] z-20 transition-all duration-700 delay-[1400ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Suspense fallback={null}>
              <JobMatchAnalyzer variant="bubble" />
            </Suspense>
          </div>

          {/* Gradient edge blending */}
          <div className="hero-visual-edge absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="hero-visual-edge absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="hero-visual-edge absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F4F5FA] to-transparent pointer-events-none z-10" />
          <div className="hero-visual-edge absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F5FA] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Mobile atmosphere behind the adaptive 3D layer */}
      <div className="pointer-events-none absolute inset-0 md:hidden" aria-hidden="true">
        <div className="absolute -right-20 top-28 h-72 w-72 rounded-full border border-[#D4A843]/20" />
        <div className="absolute -right-8 top-40 h-44 w-44 rotate-45 border border-black/[0.06]" />
        <div className="absolute bottom-24 left-5 h-px w-28 bg-gradient-to-r from-[#D4A843]/50 to-transparent" />
      </div>

      {/* Skip button (top-right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-[60]">
        <button
          onClick={handleOpenBook}
          onMouseEnter={onWarmBook}
          onFocus={onWarmBook}
          className="min-h-11 text-[10px] md:text-xs font-body text-black/60 hover:text-black transition-all duration-300 px-3 py-2 md:px-3 md:py-1.5 border-2 border-yellow-400 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-400/20 bg-white/50 backdrop-blur-sm"
        >
          Skip to Portfolio &rarr;
        </button>
      </div>
    </div>
  );
}
