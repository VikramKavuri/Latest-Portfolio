import React, { useState } from 'react';
import { Mail, MapPin, Clock, Github, Linkedin, Send, CheckCircle, User, MessageSquare, FileText } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { contactInfo } from '../../data/contact';
import { ContainerScroll } from '../ui/container-scroll-animation';
import { ScrollReveal } from '../effects/ScrollReveal';
import { TextShimmer } from '../effects/TextShimmer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_6ahvylx',
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_gqls6i4',
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        process.env.REACT_APP_EMAILJS_KEY || 'tAgUh8kfCp_a0b60h'
      );
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 md:pt-12 pb-16">
      {/* Compact page header */}
      <ScrollReveal>
        <span className="font-display text-gold text-lg tracking-widest">06</span>
        <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mt-2 mb-4">
          <TextShimmer as="span">Let's Talk</TextShimmer>
        </h2>
        <div className="gold-line w-16 mb-6" />
      </ScrollReveal>

      {/* Contact info row — compact, inline */}
      <ScrollReveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-2">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-2 text-[#1a1a2e] hover:text-navy transition-colors duration-200 font-body text-xs md:text-sm"
          >
            <Mail size={14} className="text-navy" />
            {contactInfo.email}
          </a>
          <span className="flex items-center gap-2 text-[#1a1a2e] font-body text-xs md:text-sm">
            <MapPin size={14} className="text-navy" />
            {contactInfo.location}
          </span>
          <span className="flex items-center gap-2 text-[#1a1a2e] font-body text-xs md:text-sm">
            <Clock size={14} className="text-navy" />
            {contactInfo.timezone}
          </span>
          <div className="flex items-center gap-3">
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A4F6A] hover:text-navy transition-colors duration-200"
            >
              <Github size={16} />
            </a>
            <a
              href={contactInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A4F6A] hover:text-navy transition-colors duration-200"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Scroll-animated dark form card */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center py-4">
            <p className="font-body text-sm text-[#4A4F6A] mb-1 tracking-widest uppercase">
              Ready to connect?
            </p>
            <h3 className="font-display text-2xl md:text-4xl font-light text-[#161927] leading-tight">
              Drop me a <span className="text-gold">message</span>
            </h3>
          </div>
        }
      >
        {/* Dark screen interior — contact form */}
        <div className="h-full w-full overflow-y-auto bg-[#1a1a2e] p-4 md:p-8">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <CheckCircle size={48} className="text-emerald-400 mb-4 animate-bounce-in" />
              <p className="font-display text-3xl text-white mb-2">Message Sent</p>
              <p className="font-body text-[#b0b4cc] text-sm mb-6">
                Thank you. I'll get back to you soon.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-body text-gold underline underline-offset-4 hover:text-gold/80 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="mb-4 md:mb-6">
                <h4 className="font-display text-xl md:text-2xl text-white mb-1">Get in Touch</h4>
                <p className="font-body text-xs md:text-sm text-[#b0b4cc]">
                  Fill out the form below and I'll respond within 24 hours.
                </p>
              </div>

              <div className="flex-1 space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#16162a] border border-[#2a2a4a] rounded-lg py-2.5 pl-10 pr-4
                                 font-body text-sm text-white placeholder-[#8888aa]
                                 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20
                                 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#16162a] border border-[#2a2a4a] rounded-lg py-2.5 pl-10 pr-4
                                 font-body text-sm text-white placeholder-[#8888aa]
                                 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20
                                 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#16162a] border border-[#2a2a4a] rounded-lg py-2.5 pl-10 pr-4
                               font-body text-sm text-white placeholder-[#8888aa]
                               focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20
                               transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="relative flex-1">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-[#8888aa]" />
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full h-full min-h-[100px] bg-[#16162a] border border-[#2a2a4a] rounded-lg py-2.5 pl-10 pr-4
                               font-body text-sm text-white placeholder-[#8888aa]
                               focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20
                               transition-all duration-300 resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                {error && (
                  <p className="font-body text-sm text-red-400">{error}</p>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="group w-full flex items-center justify-center gap-2 px-6 py-3
                             bg-gradient-to-r from-gold to-[#D4A843] text-[#1a1a2e] font-body text-sm font-semibold
                             rounded-lg hover:from-[#D4A843] hover:to-gold
                             transition-all duration-300 hover:shadow-lg hover:shadow-gold/20
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </ContainerScroll>

      {/* Bottom spacer — enough scroll room to complete the animation */}
      <div className="h-[40vh]" />
    </div>
  );
}
