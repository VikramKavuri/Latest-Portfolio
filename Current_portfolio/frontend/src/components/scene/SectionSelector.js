import React from 'react';
import { User, Briefcase, FolderOpen, Wrench, Award, MessageCircle } from 'lucide-react';
import SectionCarousel from './SectionCarousel';

const dialImageBase = '/section-dials';

const SECTIONS = [
  {
    label: 'About',
    icon: User,
    description: 'Who I am & my journey',
    pageIndex: 0,
    image: `${dialImageBase}/about.webp`,
  },
  {
    label: 'Experience',
    icon: Briefcase,
    description: 'Professional timeline',
    pageIndex: 1,
    image: `${dialImageBase}/experience.webp`,
  },
  {
    label: 'Selected Work',
    icon: FolderOpen,
    description: 'Projects & case studies',
    pageIndex: 2,
    image: `${dialImageBase}/selected-work.webp`,
  },
  {
    label: 'Toolkit',
    icon: Wrench,
    description: 'Skills & technologies',
    pageIndex: 3,
    image: `${dialImageBase}/toolkit.webp`,
  },
  {
    label: 'Credentials',
    icon: Award,
    description: 'Certifications & endorsements',
    pageIndex: 4,
    image: `${dialImageBase}/credentials.webp`,
  },
  {
    label: "Let's Talk",
    icon: MessageCircle,
    description: 'Get in touch',
    pageIndex: 5,
    image: `${dialImageBase}/contact.webp`,
  },
];

function SectionCard({ section, isHovered }) {
  const Icon = section.icon;

  return (
    <div
      className={`
        relative w-[16.5rem] md:w-[19.5rem] overflow-hidden border
        transition-all duration-500 ease-out select-none
        ${
          isHovered
            ? 'border-black/20 shadow-lg shadow-black/10'
            : 'border-black/10 hover:border-black/20'
        }
      `}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${section.image})`,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />

      {/* Editorial scrim so text stays readable without flattening every image. */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isHovered
            ? 'linear-gradient(125deg, rgba(8, 14, 28, 0.34) 0%, rgba(8, 14, 28, 0.12) 48%, rgba(8, 14, 28, 0.28) 100%)'
            : 'linear-gradient(125deg, rgba(8, 14, 28, 0.48) 0%, rgba(8, 14, 28, 0.2) 48%, rgba(8, 14, 28, 0.38) 100%)',
        }}
      />

      {/* Subtle tint on hover */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.03) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 px-6 py-8"
        style={{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.55)' }}
      >
        {/* Accent line at top */}
        <div
          className={`absolute top-0 left-0 h-[2px] transition-all duration-500 ${
            isHovered ? 'w-full bg-white' : 'w-0 bg-white/50'
          }`}
        />

        {/* Icon */}
        <div
          className={`mb-3 transition-colors duration-500 ${
            isHovered ? 'text-white' : 'text-neutral-300'
          }`}
        >
          <Icon size={26} strokeWidth={1.5} />
        </div>

        {/* Label */}
        <h3
          className={`font-display text-xl font-semibold mb-2 tracking-wide transition-colors duration-500 ${
            isHovered ? 'text-neutral-50' : 'text-neutral-200'
          }`}
        >
          {section.label}
        </h3>

        {/* Description */}
        <p
          className={`font-body text-sm leading-relaxed transition-colors duration-500 ${
            isHovered ? 'text-neutral-300' : 'text-neutral-400'
          }`}
        >
          {section.description}
        </p>

        {/* Arrow indicator */}
        <div
          className={`mt-3 text-[10px] font-body uppercase tracking-[0.15em] transition-all duration-500 ${
            isHovered
              ? 'text-white/80 translate-x-1'
              : 'text-neutral-400 translate-x-0'
          }`}
        >
          Explore →
        </div>
      </div>
    </div>
  );
}

export default function SectionSelector({ onSelectSection }) {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-center py-12"
      style={{
        background: '#F4F5FA',
      }}
    >
      {/* Section heading */}
      <div className="text-center pb-2 relative z-10">
        <p className="font-body text-[10px] text-black/40 tracking-[0.3em] uppercase mb-3">
          Portfolio
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-black">
          Explore Sections
        </h2>
        <div
          className="mx-auto mt-4 h-[2px] w-48"
          style={{
            background:
              'linear-gradient(90deg, transparent, #B8860B, #D4A843, #B8860B, transparent)',
          }}
        />
        <p className="font-body text-sm mt-4 max-w-md mx-auto gold-shimmer-text">
          Browse the sections. Click the centered card to dive in.
        </p>
      </div>

      {/* Coverflow carousel */}
      <SectionCarousel
        sections={SECTIONS}
        onSelect={(pageIndex) => {
          if (onSelectSection) onSelectSection(pageIndex);
        }}
      />
    </div>
  );
}
