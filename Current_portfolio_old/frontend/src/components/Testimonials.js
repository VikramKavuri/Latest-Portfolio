
import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTestimonials } from '../mock/data';

/**
 * Bold specific phrases inside a string using JSX (no dangerouslySetInnerHTML).
 * - Case-insensitive
 * - Word-boundary matching, so it won't bold inside larger words.
 * - Handles multi-word phrases like "hard working" and "senior analyst".
 */
const highlightPhrases = (text, phrases = []) => {
  if (!text || phrases.length === 0) return text;

  // Escape regex special characters in each phrase
  const escaped = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // Build a single regex that matches any phrase with word boundaries
  // \b works well for most languages composed of letters/digits/underscore.
  // For multi-word phrases (e.g., "hard working"), \b still applies around the ends.
  const regex = new RegExp(`\\b(?:${escaped.join('|')})\\b`, 'gi');

  const nodes = [];
  let lastIndex = 0;
  let match;

  // Iterate over all matches and build JSX nodes in sequence
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    // Push text before the match
    if (start > lastIndex) {
      nodes.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, start)}</span>);
    }

    // Push the bolded match
    nodes.push(
      <strong key={`b-${start}`} className="font-semibold">
        {match[0]}
      </strong>
    );

    lastIndex = end;
  }

  // Push any remaining text after the last match
  if (lastIndex < text.length) {
    nodes.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
};

// Phrases to bold throughout the component
const TARGET_PHRASES = [
  'fast learner',
  'hard working',
  'diligent',
  'ownership',
  'senior analyst',
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const testimonialsRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Reveal animation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, 1]));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev + 1) % mockTestimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50 scroll-mt-24" ref={testimonialsRef}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Quote className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-thin text-gray-900 mb-6">What Colleagues Say</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Testimonials from industry professionals who have worked alongside
            and witnessed the impact of my data engineering expertise
          </p>
        </div>

        {/* Main Testimonial */}
        <div
          className={`transition-all duration-1000 transform ${
            visibleItems.has(1) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="relative bg-white rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto mb-16">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-12">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {renderStars(mockTestimonials[currentTestimonial].rating)}
              </div>

              {/* Render content with phrases bolded */}
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic mb-8">
                {/* Optional smart quotes around the content */}
                <span className="select-none">“</span>
                {highlightPhrases(mockTestimonials[currentTestimonial].content, TARGET_PHRASES)}
                <span className="select-none">”</span>
              </blockquote>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-center">
              <img
                src={mockTestimonials[currentTestimonial].avatar}
                alt={mockTestimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-lg">
                  {mockTestimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {mockTestimonials[currentTestimonial].role}
                </div>
                <div className="text-gray-500 text-sm">
                  {mockTestimonials[currentTestimonial].company}
                </div>
              </div>
              <a
                href={mockTestimonials[currentTestimonial].linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
              </a>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-3 mb-16">
          {mockTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentTestimonial(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-blue-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                index === currentTestimonial ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.company}</div>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Grid card testimonial text with bolded phrases */}
              <div className="text-gray-700 text-sm leading-relaxed">
                {highlightPhrases(testimonial.content, TARGET_PHRASES)}
              </div>

              {/* Optional: LinkedIn / actions */}
              {testimonial.linkedIn && (
                <div className="mt-4">
                  <a
                    href={testimonial.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View LinkedIn
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
