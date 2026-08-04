import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  {
    id: 'engineering',
    number: '01',
    title: 'Data Engineering',
    content:
      'Building scalable ETL pipelines, data warehouses, and real-time streaming architectures with Spark, Airflow, and cloud-native services.',
  },
  {
    id: 'analytics',
    number: '02',
    title: 'Analytics & BI',
    content:
      'Turning raw data into actionable dashboards and KPI frameworks with Power BI, Tableau, and SQL — so stakeholders actually open them.',
  },
  {
    id: 'ml',
    number: '03',
    title: 'Machine Learning',
    content:
      'Production-grade ML models for churn prediction, risk scoring, and classification — achieving 87-92% accuracy in real deployments.',
  },
  {
    id: 'cloud',
    number: '04',
    title: 'Cloud Architecture',
    content:
      'Designing and migrating data platforms on AWS and Azure, from medallion-architecture lakes to serverless event pipelines.',
  },
];

export function WhatIDo() {
  const [activeId, setActiveId] = useState('engineering');
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="w-full">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => setActiveId(isActive ? null : item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="w-full group"
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.875rem 0.25rem' }}>
                  {/* Number with animated circle */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, flexShrink: 0 }}>
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '9999px',
                        backgroundColor: '#2C4A72',
                      }}
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.85 : 0,
                        opacity: isActive ? 1 : isHovered ? 0.1 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                    <motion.span
                      style={{ position: 'relative', zIndex: 10, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', fontFamily: "'DM Sans', sans-serif" }}
                      animate={{
                        color: isActive ? '#ECEDF4' : '#9399AD',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.number}
                    </motion.span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color: isActive ? '#161927' : isHovered ? '#161927' : '#9399AD',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Animated + indicator */}
                  <div style={{ marginLeft: 'auto' }}>
                    <motion.div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        animate={{ opacity: isActive || isHovered ? 1 : 0.4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          d="M8 1V15M1 8H15"
                          stroke="#161927"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                {/* Base underline */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(205, 209, 221, 0.5)' }} />
                {/* Animated accent underline */}
                <motion.div
                  style={{ position: 'absolute', bottom: 0, left: 0, height: 1, backgroundColor: '#B8860B', transformOrigin: 'left' }}
                  initial={{ scaleX: 0, width: '100%' }}
                  animate={{ scaleX: isActive ? 1 : isHovered ? 0.3 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </button>

              {/* Expandable content */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      },
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <motion.p
                      className="font-body"
                      style={{ paddingLeft: '3.5rem', paddingRight: '2.5rem', paddingTop: '0.75rem', paddingBottom: '1rem', color: '#4A4F6A', lineHeight: 1.7, fontSize: '0.9rem' }}
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      {item.content}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
