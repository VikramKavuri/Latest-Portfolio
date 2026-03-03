import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const BULLETS = [
  "Think like a business person, operate like a scientist.",
  "Make everyone around me faster, safer, and confident in the data.",
  "Build models people trust, use, and make decisions from.",
];

const BLOCK_COLOR = "#F4F5FA"; // Match page background

export default function RollingBullets({ isReady = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(null);
  const blockRef = useRef(null);
  const timelineRef = useRef(null);

  const animateIn = useCallback(() => {
    if (!textRef.current || !blockRef.current) return;

    if (timelineRef.current) timelineRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
    });

    gsap.set(textRef.current, { opacity: 0 });
    gsap.set(blockRef.current, { scaleX: 0, transformOrigin: "left center" });

    tl.to(blockRef.current, {
      scaleX: 1,
      duration: 0.5,
      transformOrigin: "left center",
    })
      .set(textRef.current, { opacity: 1 }, "-=0.15")
      .to(blockRef.current, {
        scaleX: 0,
        duration: 0.5,
        transformOrigin: "right center",
      })
      .to(blockRef.current, {
        scaleX: 1,
        duration: 0.5,
        transformOrigin: "right center",
        delay: 2.0,
      })
      .set(textRef.current, { opacity: 0 })
      .to(blockRef.current, {
        scaleX: 0,
        duration: 0.4,
        transformOrigin: "left center",
      })
      .call(() => {
        setCurrentIndex((prev) => (prev + 1) % BULLETS.length);
      });

    timelineRef.current = tl;
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(animateIn, 50);
    return () => clearTimeout(timer);
  }, [currentIndex, isReady, animateIn]);

  if (!isReady) return null;

  return (
    <div className="max-w-xl">
      {/* "I Will" — golden yellow, left-aligned to match hero layout */}
      <p
        className="font-body text-base md:text-lg font-semibold tracking-[0.25em] uppercase mb-2"
        style={{
          background: "linear-gradient(90deg, #B8860B, #D4A843, #FFD700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        I Will
      </p>

      {/* Rolling bullet container */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: "3.5rem" }}
      >
        {/* The text — matches Data Analytics Engineer font style */}
        <p
          ref={textRef}
          className="font-body text-lg md:text-xl text-black/70 tracking-wide leading-relaxed"
          style={{ opacity: 0 }}
        >
          {BULLETS[currentIndex]}
        </p>

        {/* White block revealer with subtle shadow for visibility */}
        <div
          ref={blockRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: BLOCK_COLOR,
            zIndex: 2,
            transform: "scaleX(0)",
            transformOrigin: "left center",
            boxShadow: "0 0 12px rgba(244,245,250,0.6)",
          }}
        />
      </div>
    </div>
  );
}
