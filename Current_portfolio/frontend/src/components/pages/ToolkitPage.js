import React from 'react';
import { skills } from '../../data/skills';
import OrbitDiagram from '../illustrations/OrbitDiagram';
import { ScrollReveal } from '../effects/ScrollReveal';
import { BreakableCard } from '../effects/BreakableCard';
import { TextShimmer } from '../effects/TextShimmer';
import { Marquee, MarqueeItem } from '../effects/Marquee';

// Short descriptions for each skill category
const CATEGORY_DESCRIPTIONS = {
  Languages: 'Core programming languages powering data pipelines and analytics.',
  Cloud: 'Cloud platforms for scalable infrastructure and deployment.',
  'Data Tools': 'ETL, orchestration, and visualization tools for the data stack.',
  Databases: 'Relational and NoSQL databases for storage and retrieval.',
};

export default function ToolkitPage() {
  // Flatten all skills for marquee strips
  const allSkills = skills.technical.flatMap(g => g.skills);
  const half = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, half);
  const row2 = allSkills.slice(half);

  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-16 pb-24">
      <ScrollReveal>
        <span className="font-display text-gold text-lg tracking-widest">04</span>
        <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mt-2 mb-8">
          <TextShimmer as="span">Toolkit</TextShimmer>
        </h2>
        <div className="gold-line w-16 mb-12" />
      </ScrollReveal>

      {/* Tech ecosystem illustration */}
      <ScrollReveal delay={0.05}>
        <div className="mb-10">
          <OrbitDiagram />
        </div>
      </ScrollReveal>

      {/* Infinite scrolling marquee strips */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12 space-y-3 -mx-4 md:-mx-8">
          <Marquee speed={35} direction="left">
            {row1.map((skill) => (
              <MarqueeItem key={skill.name} icon={skill.icon} label={skill.name} />
            ))}
          </Marquee>
          <Marquee speed={40} direction="right">
            {row2.map((skill) => (
              <MarqueeItem key={skill.name} icon={skill.icon} label={skill.name} />
            ))}
          </Marquee>
        </div>
      </ScrollReveal>

      {/* Breakable skill category cards */}
      <ScrollReveal delay={0.15}>
        <p className="font-body text-[11px] text-navy/65 uppercase tracking-widest text-center mb-6">
          Shake cards to break them free
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        {skills.technical.map((group, gi) => (
          <ScrollReveal key={group.category} delay={0.15 + gi * 0.08}>
            <div className="h-64 w-full">
              <BreakableCard
                title={group.category}
                description={CATEGORY_DESCRIPTIONS[group.category] || ''}
                skills={group.skills}
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
