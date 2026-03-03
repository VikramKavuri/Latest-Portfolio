import React from 'react';
import { User, Briefcase, FolderOpen, Wrench, Award, MessageCircle } from 'lucide-react';
import { RadialScrollGallery } from './RadialScrollGallery';

const SECTIONS = [
  {
    label: 'About',
    icon: User,
    description: 'Who I am & my journey',
    pageIndex: 0,
    image: 'https://cdn.prod.website-files.com/685c8edb74b82f0570be8f7d/685c8edb74b82f0570be974e_pick-me.webp',
  },
  {
    label: 'Experience',
    icon: Briefcase,
    description: 'Professional timeline',
    pageIndex: 1,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&auto=format&q=80',
  },
  {
    label: 'Selected Work',
    icon: FolderOpen,
    description: 'Projects & case studies',
    pageIndex: 2,
    image: 'https://www.ntaskmanager.com/wp-content/uploads/2020/10/project-design-in-project-management.png',
  },
  {
    label: 'Toolkit',
    icon: Wrench,
    description: 'Skills & technologies',
    pageIndex: 3,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop&auto=format&q=80',
  },
  {
    label: 'Credentials',
    icon: Award,
    description: 'Certifications & endorsements',
    pageIndex: 4,
    image: 'https://www.nbrc.org/wp-content/uploads/2020/02/credentials2.jpg',
  },
  {
    label: "Let's Talk",
    icon: MessageCircle,
    description: 'Get in touch',
    pageIndex: 5,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&auto=format&q=80',
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

      {/* Overlay so text stays readable */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered
            ? 'bg-black/35'
            : 'bg-black/45'
        }`}
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
      <div className="relative z-10 px-6 py-8">
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
      className="relative w-full"
      style={{
        background: '#F4F5FA',
      }}
    >
      {/* Section heading */}
      <div className="text-center pt-16 pb-4 relative z-10">
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
          Scroll to rotate the wheel. Click a section to dive in.
        </p>
      </div>

      {/* Radial Gallery */}
      <RadialScrollGallery
        scrollDuration={2500}
        visiblePercentage={45}
        baseRadius={550}
        mobileRadius={220}
        startTrigger="center center"
        onItemSelect={(index) => {
          if (onSelectSection) {
            onSelectSection(SECTIONS[index].pageIndex);
          }
        }}
      >
        {(hoveredIndex) =>
          SECTIONS.map((section, index) => (
            <SectionCard
              key={section.label}
              section={section}
              isHovered={hoveredIndex === index}
            />
          ))
        }
      </RadialScrollGallery>
    </div>
  );
}
