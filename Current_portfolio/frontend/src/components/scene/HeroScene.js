import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SplineScene } from '../ui/splite';
import { Spotlight } from '../ui/spotlight';
import { ArrowRight, Github, Linkedin, MapPin } from 'lucide-react';
import RollingBullets from '../ui/RollingBullets';

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
   Subtle geometric shapes drifting in the dark
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
   ──────────────────────────────────────────── */
export default function HeroScene({ onOpenBook }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
    // Stagger the content reveal after scene loads
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
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        background: '#F4F5FA',
      }}
    >
      {/* Loading overlay */}
      <LoadingOverlay isLoading={!splineLoaded} />

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#D4A843"
      />

      {/* Secondary subtle spotlight */}
      <Spotlight
        className="-top-40 right-0 md:right-60 md:-top-20"
        fill="#8BA4C4"
      />

      {/* Floating particles */}
      <FloatingParticlesBg />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4F5FA]/90 via-transparent to-transparent z-[2] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F5FA] to-transparent z-[2] pointer-events-none" />

      {/* Main content — split layout */}
      <div className="relative z-10 flex min-h-screen">
        {/* ─── Left: Text content ─── */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-20 relative z-10">
          {/* Status badge */}
          <div
            className={`transition-all duration-700 delay-300 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-black/15 bg-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-body text-black/60 tracking-wider uppercase">
                Open to opportunities
              </span>
            </div>
          </div>

          {/* Name */}
          <div className="mb-2">
            <AnimatedText
              text="VIKRAM"
              className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight"
              delay={contentReady ? 400 : 99999}
            />
          </div>
          <div className="mb-6">
            <AnimatedText
              text="KAVURI"
              className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black/85 leading-tight"
              delay={contentReady ? 550 : 99999}
            />
          </div>

          {/* Gold divider — animated flowing line */}
          <div
            className={`h-[2px] w-64 md:w-80 mb-6 transition-all duration-1000 delay-700 gold-line-flow ${
              contentReady
                ? 'opacity-100 scale-x-100'
                : 'opacity-0 scale-x-0'
            } origin-left`}
          />

          {/* Title */}
          <div
            className={`transition-all duration-700 delay-[800ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-body text-lg md:text-xl text-black/70 tracking-wide mb-2">
              Data Analytics Engineer
            </p>
            <div className="flex items-center gap-2 text-black/45 mb-8">
              <MapPin size={14} />
              <span className="text-sm font-body">Buffalo, NY</span>
            </div>
          </div>

          {/* Rolling Bullet Titles */}
          <div
            className={`transition-all duration-700 delay-[1000ms] mb-10 ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <RollingBullets isReady={contentReady} />
          </div>

          {/* CTA + Social links */}
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-700 delay-[1200ms] ${
              contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleOpenBook}
              className="group flex items-center gap-3 px-6 py-3 bg-black text-white font-body font-semibold text-sm tracking-wide hover:bg-black/85 transition-all duration-300 hover:shadow-lg hover:shadow-black/15"
            >
              Open Portfolio
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <div className="flex items-center gap-3 ml-1">
              <a
                href="https://github.com/vikramkavuri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-black/40 hover:text-black transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/vikramkavuri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-black/40 hover:text-black transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 left-5 sm:left-8 md:left-16 lg:left-20 flex items-center gap-2 transition-all duration-700 delay-[1500ms] ${
              contentReady ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gold to-transparent" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase gold-shimmer-text" style={{ filter: 'brightness(0.75) contrast(1.3)' }}>
              Scroll to explore
            </span>
          </div>
        </div>

        {/* ─── Right: Spline 3D Scene ─── */}
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

          {/* Gradient edge blending — all sides to hide 3D scene borders */}
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

      {/* Skip button (top-right) — z-[60] to stay above loading overlay */}
      <div className="absolute top-6 right-6 z-[60]">
        <button
          onClick={handleOpenBook}
          className="text-xs font-body text-black/60 hover:text-black transition-all duration-300 px-3 py-1.5 border-2 border-yellow-400 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-400/20 bg-white/50 backdrop-blur-sm"
        >
          Skip to Portfolio &rarr;
        </button>
      </div>
    </div>
  );
}
