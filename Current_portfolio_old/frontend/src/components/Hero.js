import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ChevronDown, Database, BarChart3, Cloud, Cpu, Zap, TrendingUp } from 'lucide-react';
import JobMatchAnalyzer from './JobMatchAnalyzer';
import { SkillBadges } from './effects/SkillBadges';

const Hero = ({ onSkillsIdentified }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [titleNumber, setTitleNumber] = useState(0);
  const containerRef = useRef(null);

  // Rotating titles for animated text - RECRUITER MAGNETS
  const titles = useMemo(
    () => [
      "turning chaos into clarity",
      "making executives say wow",
      "shipping results, not reports",
      "solving million-dollar problems",
      "building what others can't"
    ],
    []
  );

  // Scroll-based animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -250]);
  const y3 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Load animation trigger
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Rotating title animation - slower for readability
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 3000); // 3 seconds per phrase for better readability
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 50;
      const y = (e.clientY - rect.top - rect.height / 2) / 50;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToNext = () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tech stack with animations
  const techStack = [
    { icon: Database, label: 'Data Pipelines', color: 'from-blue-500 to-cyan-500', delay: 0 },
    { icon: BarChart3, label: 'Analytics', color: 'from-purple-500 to-pink-500', delay: 0.1 },
    { icon: Cloud, label: 'Cloud Platforms', color: 'from-green-500 to-emerald-500', delay: 0.2 },
    { icon: Cpu, label: 'AI & ML', color: 'from-orange-500 to-red-500', delay: 0.3 }
  ];

  // Floating background orbs
  const backgroundOrbs = [
    { size: 'w-96 h-96', color: 'bg-blue-500', position: 'top-20 left-20', duration: 20 },
    { size: 'w-80 h-80', color: 'bg-indigo-500', position: 'bottom-40 right-20', duration: 25 },
    { size: 'w-72 h-72', color: 'bg-purple-500', position: 'top-1/2 right-1/4', duration: 30 }
  ];

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex flex-col justify-center items-center bg-[#F4F5FA] overflow-hidden pt-20 pb-12"
    >
      {/* Animated Background Orbs */}
      {backgroundOrbs.map((orb, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, index % 2 === 0 ? 100 : -100, 0],
            y: [0, index % 2 === 0 ? -50 : 50, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute ${orb.position} ${orb.size} ${orb.color} rounded-full blur-3xl opacity-10`}
        />
      ))}

      {/* Floating Parallax Icons */}
      <motion.div 
        style={{ 
          y: y1,
          x: mousePosition.x * 2,
          opacity: opacity 
        }}
        className="absolute top-32 left-10 lg:left-20"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Database className="w-16 h-16 lg:w-24 lg:h-24 text-blue-500 opacity-20" />
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ 
          y: y2,
          x: mousePosition.x * -3,
          opacity: opacity 
        }}
        className="absolute top-40 right-10 lg:right-32"
      >
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <Cloud className="w-20 h-20 lg:w-32 lg:h-32 text-indigo-500 opacity-15" />
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ 
          y: y3,
          x: mousePosition.x * 1.5,
          opacity: opacity 
        }}
        className="absolute bottom-32 left-1/4"
      >
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <BarChart3 className="w-18 h-18 lg:w-28 lg:h-28 text-purple-500 opacity-20" />
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ 
          y: y1,
          x: mousePosition.x * -2,
          opacity: opacity 
        }}
        className="absolute bottom-40 right-1/3"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-14 h-14 lg:w-20 lg:h-20 text-yellow-500 opacity-15" />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4 sm:px-6 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto"
      >
        
        {/* Animated Name & Static Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-thin text-gray-900 mb-4 tracking-tight leading-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Thrivikrama Rao
          </motion.h1>
          
          {/* Static Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6"
          >
            Data Analytics Engineer
          </motion.h2>
        </motion.div>

        {/* FULLY FIXED: Animated Rotating Tagline - No More Clipping! */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-8 sm:mb-12 py-4"
        >
          {/* FIXED: Removed overflow-hidden and increased padding */}
          <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
            <div 
              className="relative flex items-center justify-center"
              style={{ 
                minHeight: '180px', // INCREASED from 160px
                height: 'auto',     // Changed to auto for flexibility
                paddingTop: '20px',
                paddingBottom: '20px'
              }}
            >
              {titles.map((title, index) => (
                <motion.div
                  key={index}
                  className="absolute w-full flex items-center justify-center"
                  style={{
                    // FIXED: Allow text to overflow without clipping
                    top: '50%',
                    left: 0,
                    right: 0,
                  }}
                  initial={{ opacity: 0, y: 100 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: '-50%', // Center vertically
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? '-150%' : '50%',
                          opacity: 0,
                        }
                  }
                  transition={{ 
                    type: "spring", 
                    stiffness: 50, 
                    damping: 20,
                    duration: 0.8 
                  }}
                >
                  {/* FIXED: Better text wrapping and spacing */}
                  <span 
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent text-center leading-tight sm:leading-normal px-4 sm:px-8"
                    style={{
                      // FIXED: Ensure text doesn't get clipped
                      display: 'inline-block',
                      maxWidth: '100%',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      lineHeight: '1.4'
                    }}
                  >
                    {title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skill Badges — Interactive Domain Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
          style={{ overflow: 'visible' }}
        >
          <SkillBadges />
        </motion.div>

        {/* Concrete Proof Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mb-8 sm:mb-12"
        >
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Processed{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
              className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              5TB daily
            </motion.span>
            {' • Accelerated queries by '}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
              className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
            >
              85%
            </motion.span>
            {' • Delivered '}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
              className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"
            >
              87% accuracy
            </motion.span>
            {' in production ML models'}
          </p>
        </motion.div>

        {/* Tech Stack Icons with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 max-w-sm sm:max-w-none mx-auto"
        >
          {techStack.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 1 + item.delay,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <motion.div 
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-2 sm:mb-3 relative overflow-hidden group-hover:shadow-2xl transition-shadow duration-300`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-gray-700 relative z-10" />
              </motion.div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Magnetic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
        >
          <MagneticButton 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            primary
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View My Work
          </MagneticButton>
          
          <MagneticButton 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Zap className="w-5 h-5 mr-2" />
            Get In Touch
          </MagneticButton>
        </motion.div>

        {/* Floating Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-12"
        >
          {[
            { value: '5+', label: 'Years Experience', icon: TrendingUp },
            { value: '7', label: 'Major Projects', icon: Database },
            { value: '4', label: 'Certifications', icon: Cpu }
          ].map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/50"
            >
              <metric.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Job Match Analyzer - Floating Assistant Style */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
        className="relative z-10 w-full px-4 sm:px-6 mb-12"
      >
        <JobMatchAnalyzer onAnalysisComplete={onSkillsIdentified} />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{ opacity }}
        className="relative z-10 mt-8"
      >
        <motion.button
          onClick={scrollToNext}
          className="group flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.button>
      </motion.div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F5FA]/50 to-transparent backdrop-blur-sm pointer-events-none" />
    </section>
  );
};

// Magnetic Button Component with Advanced Interactions
const MagneticButton = ({ children, onClick, primary = false }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium 
        transition-all duration-300 transform
        flex items-center justify-center
        ${primary 
          ? 'bg-gray-900 text-white shadow-lg hover:shadow-2xl' 
          : 'bg-white text-gray-900 border-2 border-gray-900 shadow-lg hover:shadow-xl'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        whileHover={{ 
          opacity: [0, 0.3, 0],
          x: ['-100%', '100%']
        }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center text-sm sm:text-base">
        {children}
      </span>
    </motion.button>
  );
};

export default Hero;
