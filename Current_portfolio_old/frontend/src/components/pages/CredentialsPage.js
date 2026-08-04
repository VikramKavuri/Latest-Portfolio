import React from 'react';
import { ExternalLink } from 'lucide-react';
import { certifications } from '../../data/certifications';
import { testimonials } from '../../data/testimonials';
import AchievementCounters from '../illustrations/AchievementCounters';
import { ScrollReveal } from '../effects/ScrollReveal';
import { SpotlightCard } from '../effects/SpotlightCard';
import { TextShimmer } from '../effects/TextShimmer';
import { TestimonialCarousel } from '../effects/TestimonialCarousel';

export default function CredentialsPage() {

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

      <ScrollReveal delay={0.35}>
        <TestimonialCarousel testimonials={testimonials} />
      </ScrollReveal>
    </div>
  );
}
