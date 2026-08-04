import React, { useRef, useState, useEffect, useCallback } from 'react';

const CHANNELS = [
  { label: 'Email', color: '#B8860B' },
  { label: 'LinkedIn', color: '#2C4A72' },
  { label: 'GitHub', color: '#2C4A72' },
];

const PARTICLE_COUNT = 25;
const CONNECTION_DIST = 100;
const MOUSE_ATTRACT_DIST = 140;
const MOUSE_FORCE = 0.015;

function createParticle(w, h, isChannel, channel, index) {
  if (isChannel) {
    // Position channels in a triangle layout
    const positions = [
      { x: w * 0.25, y: h * 0.4 },
      { x: w * 0.75, y: h * 0.35 },
      { x: w * 0.5, y: h * 0.7 },
    ];
    const pos = positions[index] || { x: w * 0.5, y: h * 0.5 };
    return {
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: 5,
      isChannel: true,
      label: channel.label,
      color: channel.color,
      baseX: pos.x,
      baseY: pos.y,
    };
  }
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: 1.5 + Math.random() * 1.5,
    isChannel: false,
    color: '#2C4A72',
    opacity: 0.2 + Math.random() * 0.3,
  };
}

export default function ConnectionNodes({ className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999, inside: false });
  const rafRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
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

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.inside = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.inside = false;
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      return { w: rect.width, h: rect.height };
    }

    let { w, h } = resize();

    // Initialize particles
    const particles = [];
    CHANNELS.forEach((ch, i) => {
      particles.push(createParticle(w, h, true, ch, i));
    });
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(w, h, false, null, i));
    }
    particlesRef.current = particles;

    function animate() {
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      // Update
      particles.forEach((p) => {
        // Mouse attraction
        if (mouse.inside) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_ATTRACT_DIST && dist > 0) {
            p.vx += (dx / dist) * MOUSE_FORCE;
            p.vy += (dy / dist) * MOUSE_FORCE;
          }
        }

        // Channel nodes spring back to base position
        if (p.isChannel) {
          p.vx += (p.baseX - p.x) * 0.005;
          p.vy += (p.baseY - p.y) * 0.005;
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < p.radius || p.x > w - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > h - p.radius) p.vy *= -1;
        p.x = Math.max(p.radius, Math.min(w - p.radius, p.x));
        p.y = Math.max(p.radius, Math.min(h - p.radius, p.y));
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECTION_DIST) {
            const alpha = 0.12 * (1 - dist / CONNECTION_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(44, 74, 114, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isChannel) {
          ctx.fillStyle = p.color;
          ctx.fill();
          // Label
          ctx.fillStyle = '#888CA4';
          ctx.font = '10px DM Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, p.x, p.y + p.radius + 14);
        } else {
          ctx.fillStyle = `rgba(44, 74, 114, ${p.opacity})`;
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    const resizeObserver = new ResizeObserver(() => {
      const dims = resize();
      w = dims.w;
      h = dims.h;
    });
    resizeObserver.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: 200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isVisible ? 0.7 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />
    </div>
  );
}
