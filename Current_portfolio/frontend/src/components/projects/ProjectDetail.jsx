import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Loader2 } from 'lucide-react';
import { FileTree } from '../ui/FileTree';
import useGithubTree from '../../hooks/useGithubTree';

export default function ProjectDetail({ project, onBack }) {
  const { tree, loading, error, branch } = useGithubTree(project.githubUrl);
  const detailMedia = project.detailGif || project.image;
  const hasDetailGif = Boolean(project.detailGif);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="prx-detail-page"
    >
      {/* ── Header Bar ── */}
      <div className="prx-detail-header">
        <button onClick={onBack} className="prx-detail-back">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="prx-link"
            >
              <Github size={14} /> Source
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="prx-link"
            >
              <ExternalLink size={14} /> {project.demoLabel || 'Demo'}
            </a>
          )}
        </div>
      </div>

      {/* ── Main Content: File Tree + Image + Description side by side ── */}
      <div className="prx-detail-main">
        {/* File Tree Panel */}
        <div className="prx-detail-filetree">
          {loading && (
            <div className="flex items-center justify-center py-8 text-navy/40">
              <Loader2 size={18} className="animate-spin mr-2" />
              <span className="text-xs font-mono">Loading files...</span>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-8 text-navy/40">
              <span className="text-xs font-mono">{error}</span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold text-xs mt-2 hover:underline"
              >
                View on GitHub →
              </a>
            </div>
          )}
          {!loading && !error && tree.length > 0 && (
            <FileTree
              data={tree}
              githubUrl={project.githubUrl}
              branch={branch}
            />
          )}
        </div>

        {/* Project Image */}
        <div className={`prx-detail-image ${hasDetailGif ? 'prx-detail-gif-frame' : ''}`}>
          <img
            src={detailMedia}
            alt={`${project.title} ${hasDetailGif ? 'workflow animation' : 'preview'}`}
            className="w-full h-full"
          />
          {!hasDetailGif && <div className="prx-detail-image-overlay" />}
        </div>

        {/* Description Panel (right side) */}
        <div className="prx-detail-sidebar">
          {/* Title & Category */}
          <div className="mb-3">
            <span className="prx-card-category">{project.category}</span>
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight text-navy mt-1">
              {project.title}
            </h2>
            <div className="prx-card-metric mt-1.5">
              <span className="prx-metric-value">{project.keyMetric}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <p className="font-body text-sm text-navy/70 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-3">
            <h4 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1.5">
              Key Features
            </h4>
            <ul className="space-y-1">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-navy/70 font-body"
                >
                  <span className="text-gold mt-0.5 text-[10px]">▸</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1.5">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span key={tech} className="prx-skill-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
