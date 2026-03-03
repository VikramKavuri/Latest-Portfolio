import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, CheckCircle, BarChart, List, BrainCircuit, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const JobMatchAnalyzer = ({ onAnalysisComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const jobTextareaRef = useRef(null);
  const resultsRef = useRef(null);

  // ==========================================
  // 📝 CANDIDATE INFORMATION - EDIT THIS SECTION
  // ==========================================
  const CANDIDATE_INFO = `
THRIVIKRAMA RAO
Data Engineer & Analytics Professional
Location: Buffalo, NY

Technical Skills
 • BI Tools: Tableau, Power BI, Qlik Sense, Apache Superset, SSRS
 • Programming & Libraries: Python, PySpark, SQL, PowerShell, R, Java, LaTeX; Pandas, NumPy, Scikit-learn
 • Databases & Cloud: Snowflake, PostgreSQL, MS-SQL, AWS (S3, Redshift, SageMaker, CloudWatch), Azure
 • ETL Tools: Azure Data Factory, SSIS, Apache Airflow
 Experience
 Data Analytics Engineer | The Arc Erie County New York — New York, US
 Jan 2025– Present
 • Engineered automated dashboards in Tableau, and SSRS shaping and refreshes, cutting manual reporting by
 40% while surfacing real-time KPIs for compliance and executive operational reviews.
 • Gathered healthcare claims, finance, and HR data from NetSuite, Dayforce, and Precision Care APIs, integrating
 into SQL data warehouse to give C-suite a consolidated unified view of billing, AR, POs, and claims.
 • Formulated cohort analyses on patient-service utilization and budget monitoring, profiling many records to
 expose service gaps, guiding prioritized interventions and targeted resource allocation across programs.
 • Collaborated with Property, Operations, Finance, and Clinic departments to define KPIs, document mappings,
 and standardize reporting templates, elevating dashboard usability, adoption, and governance department-wide.
 Data Science Analyst | Accenture India Pvt Ltd — Bangalore, India
 May 2021– Jan 2023
 • Developed 37 interactive dashboards in Power BI and Qlik Sense, integrating validated pipelines to deliver
 accurate, real-time insights into campaign performance, revenue trends, and operational forecasts.
 • Designed advanced segmentation frameworks combining demographics, transaction histories, and campaign
 data, improving promotional targeting accuracy by 22% and enhancing overall marketing effectiveness.
 • Analyzed 2TB daily retail and revenue data in PySpark and Redshift, identifying purchase trends, churn
 signals, and promotional responsiveness that informed targeted offers and customer engagement strategies.
 • Implemented uplift modeling and A/B test evaluations using Python to enable data-driven assessment of
 promotional campaigns, optimizing conversion rates across multiple product categories while ensuring GDPR
 compliance.
 Business Analyst | SRIT Pvt Ltd — Bangalore, India
 Jan 2020– Apr 2021
 • Translated healthcare requirements into FRDs and BRDs through stakeholder interviews, analyzing relational
 data in PostgreSQL to improve project clarity and reduce integration errors.
 • Led Agile sprints and stand-ups for a 13-member team, using MS Project for budget tracking, Visio for process
 mapping, and JIRA for risk and deliverable management.
 • Defined business rules for validating and transforming healthcare datasets, ensuring accurate, high-quality
 inputs for interactive Power BI and Apache Superset dashboards, operational decision-making across C-suite.
 Education
 Masters in Data Science, University at Buffalo, GPA: 3.7/4.0
 Bachelor’s in Computer Science, Karunya University, GPA: 3.4/4.0
 Projects
 Jan 2023– May 2024
 Jun 2016– Jul 2020
 Telco Customer Churn Prediction {Tools: Python, Flask, Random Forest, XGBoost, Excel}
 • Built a churn prediction workflow using Flask and XGBoost (87% ROC-AUC), modeling customer contracts,
 add-ons, and payments to identify high-risk cohorts and recommend targeted retention actions.
 Hardware Distribution Analytics Command Center {Tools: Tableau, Python, SQL, Microsoft Excel}
 • Architected star-schema data model and SQL ETL workflows integrating multi-source sales data, enabling
 Tableau dashboards with real-time revenue insights across cities, reducing reporting latency and decision cycles.
 Certifications
 • Generative AI Professional (Oracle)
 • Fabric Data Engineer Associate (Azure)
`;
  // ==========================================
  // END OF CANDIDATE INFORMATION
  // ==========================================

  const OPENROUTER_API_KEY = "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"; // Replace with your actual API key

  useEffect(() => {
    if (jobTextareaRef.current) {
      jobTextareaRef.current.style.height = 'auto';
      jobTextareaRef.current.style.height = `${jobTextareaRef.current.scrollHeight}px`;
    }
  }, [jobDescription]);

  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [analysisResult]);

  const analyzeWithOpenRouter = async (jobDesc) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Portfolio Job Match Analyzer'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{
          role: 'user',
          content: `You are writing a compelling professional analysis that showcases why this candidate is an excellent fit for the role. Your tone should be professional yet enthusiastic, highlighting transferable skills and concrete achievements.

JOB DESCRIPTION:
${jobDesc}

CANDIDATE RESUME/PROFILE:
${CANDIDATE_INFO}

YOUR TASK:
Create a compelling cover letter-style analysis that advertises this candidate's fit for the role. Focus on transferable skills, relevant achievements, and how their experience directly addresses the job requirements.

Respond with ONLY a valid JSON object (no markdown, no extra text, no code blocks) in this exact format:
{
  "matchScore": <number between 0-100, be realistic but highlight strengths>,
  "bestFitPoints": [
    "<compelling statement about why this candidate excels for this role, using their specific achievements and experience>",
    "<another strong selling point with concrete numbers or outcomes>",
    "<highlight transferable skills and how they map to job requirements>",
    (provide 5-6 persuasive points)
  ],
  "topSkills": [
    {
      "skill": "<specific skill from job requirements that candidate possesses>",
      "context": "<1-2 sentences describing a concrete example of how they used this skill in their work>"
    },
    (provide 6 matching skills with compelling, specific evidence)
  ]
}

IMPORTANT:
- Write in a professional yet enthusiastic tone
- Reference specific achievements, metrics, and projects from the resume
- Show how their experience directly translates to the job requirements
- Highlight transferable skills even if exact job titles don't match
- Use concrete examples and quantifiable results
- Make the candidate stand out as an exceptional fit`
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to analyze with AI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }
    
    return JSON.parse(jsonMatch[0]);
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
      const result = await analyzeWithOpenRouter(jobDescription);
      setAnalysisResult(result);
      
      // Extract top skills and notify parent component
      if (onAnalysisComplete && result.topSkills) {
        const topSkillNames = result.topSkills.map(s => s.skill);
        
        // Scroll to projects section after a short delay
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
          }
          // Trigger the filter update
          onAnalysisComplete(topSkillNames);
        }, 1000);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <div className="w-full">
      {/* Collapsed State - Always visible */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                🎯 Looking for the perfect fit?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Paste your job description to see how my experience matches your needs
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto mb-8"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 p-6 sm:p-8">
              <div className="relative">
                <textarea
                  ref={jobTextareaRef}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here...

Example:
Data Engineer Position

REQUIREMENTS:
- 3+ years experience with Python and SQL
- Experience with cloud platforms (AWS/Azure)
- Strong background in ETL and data warehousing
- Familiarity with ML frameworks..."
                  className="w-full h-auto min-h-[150px] p-4 text-sm sm:text-base bg-gray-50 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none overflow-hidden"
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full sm:w-auto mt-4 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <Loader className="animate-spin mr-2 h-5 w-5" />
                            Analyzing Match...
                        </>
                    ) : (
                        'Analyze Match'
                    )}
                </button>
              </div>
              
              <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center text-sm"
                        role="alert"
                    >
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        {error}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results - Sticky when visible */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky top-20 z-40 w-full max-w-5xl mx-auto mb-8"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-6 sm:p-8">
              <motion.div 
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
              >
                  {/* Match Score */}
                  <motion.div variants={itemVariants} className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center justify-center">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><BarChart className="mr-2 h-5 w-5 text-indigo-500"/>Match Score</h4>
                      <div className="relative w-32 h-32">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                              <path d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`} 
                                  fill="none" 
                                  stroke={analysisResult.matchScore > 80 ? "#22c55e" : analysisResult.matchScore > 60 ? "#f59e0b" : "#ef4444"}
                                  strokeWidth="3" 
                                  strokeDasharray={`${analysisResult.matchScore}, 100`}
                                  strokeLinecap="round"
                                  transform="rotate(90 18 18)"
                              ></path>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800">
                              {analysisResult.matchScore}%
                          </div>
                      </div>
                  </motion.div>

                  {/* Why I'm The Best Fit */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-100">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><List className="mr-2 h-5 w-5 text-green-600"/>Why I'm The Best Fit</h4>
                      <ul className="space-y-3 max-h-60 overflow-y-auto">
                          {analysisResult.bestFitPoints.map((point, index) => (
                               <motion.li key={index} variants={itemVariants} className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                  <span className="text-gray-600 text-sm">{point}</span>
                              </motion.li>
                          ))}
                      </ul>
                  </motion.div>
                  
                  {/* Top Matching Skills */}
                  <motion.div variants={itemVariants} className="lg:col-span-3 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border border-purple-100">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-purple-600"/>Top Matching Skills</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-60 overflow-y-auto">
                          {analysisResult.topSkills.map((skill, index) => (
                               <motion.div key={index} variants={itemVariants}>
                                  <p className="font-semibold text-gray-800 text-sm">{skill.skill}</p>
                                  <p className="text-gray-600 text-xs italic">{skill.context}</p>
                              </motion.div>
                          ))}
                      </div>
                  </motion.div>
              </motion.div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  👇 Scroll down to see relevant projects filtered by these skills
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobMatchAnalyzer;