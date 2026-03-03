import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { certifications } from '../../data/certifications';
import { testimonials } from '../../data/testimonials';
import AchievementCounters from '../illustrations/AchievementCounters';
import { ScrollReveal } from '../effects/ScrollReveal';
import { SpotlightCard } from '../effects/SpotlightCard';
import { TextShimmer } from '../effects/TextShimmer';

export default function CredentialsPage() {
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);

  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-16 pb-24">
      <ScrollReveal>
        <span className="font-display text-gold text-lg tracking-widest">05</span>
        <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mt-2 mb-8">
          <TextShimmer as="span">Credentials</TextShimmer>
        </h2>
        <div className="gold-line w-16 mb-10" />
      </ScrollReveal>

      {/* Badge illustration */}
      <ScrollReveal delay={0.05}>
        <div className="mb-8">
          <AchievementCounters />
        </div>
      </ScrollReveal>

      {/* Certifications */}
      <div className="space-y-4 mb-16">
        {certifications.map((cert, i) => (
          <ScrollReveal key={cert.id} delay={0.1 + i * 0.08}>
            <SpotlightCard intensity={3}>
              <div className="flex items-start gap-4 p-4 border border-page-edge/50 hover:border-navy/20 hover:bg-page-alt/20 transition-all duration-300">
                <img
                  src={cert.logo}
                  alt={cert.issuer}
                  className="w-10 h-10 object-contain flex-shrink-0"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-[#161927] leading-snug">
                    {cert.name}
                  </h3>
                  <p className="font-body text-sm text-[#4A4F6A] mt-0.5">
                    {cert.issuer} &middot; {cert.date}
                  </p>
                </div>
                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-body text-[#4A4F6A] hover:text-navy transition-colors duration-200 flex-shrink-0"
                  >
                    Verify <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </SpotlightCard>
          </ScrollReveal>
        ))}
      </div>

      {/* Endorsements */}
      <ScrollReveal delay={0.3}>
        <h3 className="font-display text-3xl md:text-4xl font-light tracking-tight mb-8">
          <TextShimmer as="span">Endorsements</TextShimmer>
        </h3>
        <div className="gold-line w-12 mb-10" />
      </ScrollReveal>

      <div className="space-y-8">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.id} delay={0.35 + i * 0.1}>
            <SpotlightCard intensity={2} spotlightColor="rgba(44, 74, 114, 0.06)">
              <div className="relative pl-8 p-4">
                <span className="absolute left-2 -top-0 font-display text-5xl text-gold/70 leading-none select-none">
                  &ldquo;
                </span>

                <blockquote className="font-body text-[#1a1a2e] text-[15px] leading-relaxed italic mb-4">
                  {expandedTestimonial === t.id ? t.fullContent : t.content}
                </blockquote>

                {t.fullContent !== t.content && (
                  <button
                    onClick={() => setExpandedTestimonial(
                      expandedTestimonial === t.id ? null : t.id
                    )}
                    className="text-xs font-body text-navy hover:underline mb-4"
                  >
                    {expandedTestimonial === t.id ? 'Show less' : 'Read full'}
                  </button>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-body text-sm font-medium text-[#161927]">{t.name}</p>
                    <p className="font-body text-xs text-[#4A4F6A]">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
