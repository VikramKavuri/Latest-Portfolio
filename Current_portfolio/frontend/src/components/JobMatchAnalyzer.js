import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, CheckCircle, BarChart, List, BrainCircuit, AlertTriangle, X, Sparkles, Search } from 'lucide-react';
import ReactDOM from 'react-dom';

const JobMatchAnalyzer = ({ onAnalysisComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const textareaRef = useRef(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOverlayOpen]);

  // Auto-focus textarea in overlay
  useEffect(() => {
    if (isOverlayOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 350);
    }
  }, [isOverlayOpen]);

  const handleClose = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOverlayOpen) handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOverlayOpen, handleClose]);

  const analyzeWithBackend = async (jobDesc) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/analyze-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDesc }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to analyze match. Please try again.');
    }
    const result = await response.json();
    if (!result.matchScore || !result.bestFitPoints || !result.topSkills) {
      throw new Error('Incomplete analysis received. Please try again.');
    }
    return result;
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      const result = await analyzeWithBackend(jobDescription);
      setAnalysisResult(result);

      if (onAnalysisComplete && result.topSkills) {
        const topSkillNames = result.topSkills.map(s => s.skill);
        setTimeout(() => {
          handleClose();
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
          }
          onAnalysisComplete(topSkillNames);
        }, 15000);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setJobDescription('');
    setError('');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  // ── The inline hero card (always visible) ──
  const heroCard = (
    <div
      className="w-full cursor-pointer group"
      onClick={() => setIsOverlayOpen(true)}
    >
      <div className="relative bg-white/70 backdrop-blur-sm border-2 border-gray-200/60 hover:border-black/20 rounded-xl px-4 sm:px-5 py-3 sm:py-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex-shrink-0">
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">
              Looking for the perfect fit?
            </p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Paste a job description — AI analyzes match in seconds
            </p>
          </div>
          <div className="flex-shrink-0 px-3 py-1.5 bg-gray-900 text-white text-[10px] sm:text-xs font-semibold rounded-lg group-hover:bg-gray-800 transition-colors">
            Try it
          </div>
        </div>
      </div>
    </div>
  );

  // ── The full-screen overlay (portal to body) ──
  const overlay = (
    <AnimatePresence>
      {isOverlayOpen && (
        <>
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[9999]"
            onClick={handleClose}
          />

          {/* Large centered modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 md:p-8"
            onClick={handleClose}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Modal Header ── */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60">
                    <Sparkles size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Job Fit Analyzer
                    </h2>
                    <p className="text-xs text-gray-400">
                      AI-powered resume matching
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>

              {/* ── Modal Body — scrollable ── */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 sm:px-8 py-6 sm:py-8">

                  {/* ── Input View ── */}
                  {!analysisResult && !isLoading && (
                    <div className="max-w-3xl mx-auto space-y-5">
                      <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                        Paste the full job description below. The AI will retrieve the most relevant parts of my resume, projects, and experience to show why I'm a strong match.
                      </p>

                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder={"Paste the job description here...\n\nExample:\nData Engineer — Remote\n\nRequirements:\n- 3+ years experience with Python and SQL\n- Experience with cloud platforms (AWS/Azure/GCP)\n- Strong background in ETL pipelines and data warehousing\n- Familiarity with ML frameworks and analytics tools"}
                          className="w-full p-5 pr-5 text-base leading-relaxed bg-gray-50 rounded-xl border-2 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 resize-none"
                          style={{ fontSize: '16px', minHeight: '300px' }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAnalyze}
                          disabled={!jobDescription.trim()}
                          className="flex-1 sm:flex-none px-10 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-sm sm:text-base"
                        >
                          <Search size={18} />
                          Analyze Match
                        </button>
                        {jobDescription.trim() && (
                          <button
                            onClick={() => setJobDescription('')}
                            className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center text-sm"
                            role="alert"
                          >
                            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ── Loading View ── */}
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-[5px] border-gray-100" />
                        <div className="absolute inset-0 w-20 h-20 rounded-full border-[5px] border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                        <div className="absolute inset-2 w-16 h-16 rounded-full border-[3px] border-t-transparent border-r-amber-400 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                      </div>
                      <div className="text-center">
                        <p className="text-base font-medium text-gray-700">Analyzing your job match</p>
                        <p className="text-sm text-gray-400 mt-1 animate-pulse">Retrieving relevant experience & skills...</p>
                      </div>
                    </div>
                  )}

                  {/* ── Results View ── */}
                  {analysisResult && (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      {/* Score bar */}
                      <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-indigo-500" />
                            Match Score
                          </h3>
                          <span
                            className="text-4xl font-bold tracking-tight"
                            style={{
                              color: analysisResult.matchScore > 80 ? '#22c55e' : analysisResult.matchScore > 60 ? '#f59e0b' : '#ef4444'
                            }}
                          >
                            {analysisResult.matchScore}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.matchScore}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                            className="h-full rounded-full"
                            style={{
                              background: analysisResult.matchScore > 80
                                ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                : analysisResult.matchScore > 60
                                ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                : 'linear-gradient(90deg, #ef4444, #dc2626)'
                            }}
                          />
                        </div>
                      </motion.div>

                      {/* Two-column: Best Fit + Skills */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Best Fit Points */}
                        <motion.div
                          variants={itemVariants}
                          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                        >
                          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <List className="h-5 w-5 text-green-600" />
                            Why I'm The Best Fit
                          </h3>
                          <ul className="space-y-3">
                            {analysisResult.bestFitPoints.map((point, i) => (
                              <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* Top Skills */}
                        <motion.div
                          variants={itemVariants}
                          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                        >
                          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-purple-600" />
                            Top Matching Skills
                          </h3>
                          <div className="space-y-4">
                            {analysisResult.topSkills.map((skill, i) => (
                              <motion.div key={i} variants={itemVariants}>
                                <span className="text-sm font-semibold text-gray-800">{skill.skill}</span>
                                <p className="text-xs text-gray-500 italic leading-snug mt-0.5">{skill.context}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      {/* Footer */}
                      <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100"
                      >
                        <p className="text-xs text-gray-400">
                          Relevant projects will auto-scroll into view shortly
                        </p>
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Try Another Job Description
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {heroCard}
      {/* Portal the overlay to document.body so it's above everything */}
      {ReactDOM.createPortal(overlay, document.body)}
    </>
  );
};

export default JobMatchAnalyzer;
