import React from 'react';
import { Github, Linkedin, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import SkillRadarChart from '../illustrations/SkillRadarChart';
import { ScrollReveal, ParallaxLayer } from '../effects/ScrollReveal';
import { SpotlightCard } from '../effects/SpotlightCard';
import { TextShimmer } from '../effects/TextShimmer';
import RotatingBullets from '../effects/RotatingBullets';

const ABOUT_BULLETS = [
  'Unique blend of data engineering execution and analytics delivery, backed by formal ML coursework.',
  'Ripped out legacy retail systems at Accenture and migrated them to cloud. Nothing broke.',
  'Built HIPAA-grade data pipelines in healthcare where one bad record means audit.',
  "I don't just query data. I build the warehouse, the pipelines, the models, and the dashboards people actually open.",
  'Fluent in Python, Spark, Airflow, Snowflake, SQL, AWS, and AI/ML.',
  'Turns stakeholder requirements into self-serve analytics and KPI frameworks.',
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-16 pb-24">
      <ScrollReveal>
        <span className="font-display text-gold text-lg tracking-widest">01</span>
        <h1 className="font-display text-5xl md:text-7xl font-light tracking-tight mt-2 mb-8">
          <TextShimmer as="span">About</TextShimmer>
        </h1>
        <div className="gold-line w-16 mb-6" />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <p className="font-display text-xl md:text-2xl text-navy tracking-tight mb-8">
          Vikram Kavuri <span className="text-gold/80 mx-2">|</span>
          <span className="font-light text-[#1a1a2e]">Data Analytics Engineer</span>
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <RotatingBullets bullets={ABOUT_BULLETS} interval={4000} className="mb-10" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          {[
            { icon: <Briefcase size={18} />, label: 'Currently', value: 'Data Analytics Engineer at The Arc Erie County' },
            { icon: <MapPin size={18} />, label: 'Location', value: 'Buffalo, New York' },
            { icon: <GraduationCap size={18} />, label: 'Education', value: 'MS in Data Science — University at Buffalo, SUNY' },
            { icon: <span className="text-gold text-sm font-display">&#x2022;</span>, label: 'Status', value: 'Open to new opportunities', isStatus: true },
          ].map((item, i) => (
            <SpotlightCard key={i} intensity={4}>
              <div className="flex items-start gap-3 p-4 border border-page-edge/60 bg-page-alt/30 hover:border-navy/20 transition-colors duration-300">
                <div className="text-navy mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-sm text-[#4A4F6A] font-body">{item.label}</p>
                  <p className={`font-body font-medium ${item.isStatus ? 'text-navy' : 'text-[#161927]'}`}>{item.value}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="flex gap-4 mt-8">
          <a
            href="https://github.com/VikramKavuri"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#4A4F6A] hover:text-navy transition-colors duration-200 text-sm font-body"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/thrivikrama-rao-kavuri-7290b6147/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#4A4F6A] hover:text-navy transition-colors duration-200 text-sm font-body"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </ScrollReveal>

      {/* Data pipeline illustration */}
      <ScrollReveal delay={0.4}>
        <ParallaxLayer speed={0.2} className="mt-12">
          <SkillRadarChart />
        </ParallaxLayer>
      </ScrollReveal>
    </div>
  );
}
