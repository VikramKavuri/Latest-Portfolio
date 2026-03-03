import React, { useRef, useState, useEffect, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }) => {
  const scrollParentRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scrollReady, setScrollReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Find the nearest scrollable ancestor (the Page component's overflow-y-auto div)
  useEffect(() => {
    if (!wrapperRef.current) return;
    let parent = wrapperRef.current.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        scrollParentRef.current = parent;
        setScrollReady(true);
        break;
      }
      parent = parent.parentElement;
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = useCallback(() => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  }, [isMobile]);

  // Track the overall scroll position of the Page's scroll container.
  // This gives a reliable 0→1 progress regardless of where the card sits
  // in the viewport. No target-intersection issues.
  const { scrollYProgress } = useScroll({
    container: scrollReady ? scrollParentRef : undefined,
  });

  // Map animation to the first ~60% of scroll so it completes
  // before the user reaches the bottom spacer
  const rotate = useTransform(scrollYProgress, [0, 0.6], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.6], [0, -100]);

  return (
    <div ref={wrapperRef}>
      <div
        className="w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ rotate, scale, children }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl mt-8 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
