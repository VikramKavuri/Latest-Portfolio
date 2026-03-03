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
ThrivikramaRao Kavuri
[thrivikr@buffalo.edu](mailto:thrivikr@buffalo.edu) | 716-253-5373 | Thrivikramarao Kavuri | Vikram Kavuri | TR
Technical Skills
• BI Tools: Tableau, Power BI, Qlik Sense, Apache Superset, SSRS
• Programming & Libraries: Python, PySpark, SQL, PowerShell, R, Java, LaTeX; Pandas, NumPy, Scikit-learn
• Databases & Cloud: Snowflake, PostgreSQL, MS-SQL, GCP, AWS (S3, Redshift, SageMaker, CloudWatch)
• ETL Tools: Apache Airflow, Azure Data Factory, SSIS
Experience
Data Analytics Engineer | The Arc Erie County New York — New York, US Jan 2025 – Present
• Engineered modular dbt-like SQL transformations and incremental pipelines unifying NetSuite, AVID, and
billing data into Snowflake tables, reducing reconciliation by 35%, improving consistency for finance and
operations teams.
• Designed star-schema data models for service use, staffing, and budgets, restructuring fragmented sources to
cut query latency 30% and enable reliable, self-service analytics across operational teams.
• Implemented data-quality controls using Python (Pandas, great_expectations) and T-SQL tests to detect
schema drift, null spikes, and join issues, maintaining 99% reliability for mission-critical dashboards.
• Delivered executive dashboards structured with narrative storytelling, anomaly signals, and layered trend
analysis, enabling leaders to quickly grasp performance issues, identify service gaps
• Fine-tuned Qwen2.5-VL via LoRA for field-targeted extraction, achieving 87% accuracy on 10K handwritten
forms in 2 months, enabling HIPAA-compliant GenAI deployment across 284 residential stakeholders.
• Designed regex-based PHI masking engine with L-diversity validation, securing 60K+ patient records across 8
AI dashboards, passed internal audit without exception, enforcing zero-risk compliance standards.
• Formulated cohort analyses in Tableau on AR/AP finance data, patient-service utilization, and budget
monitoring, profiling thousands of healthcare and finance records in SQL warehouse to expose persistent service
gaps, driving prioritized interventions and optimizing resource allocation across disability support programs.
• Collaborated with Property, Residential, Finance, and Clinic departments to define KPIs, document mappings,
and standardize reporting templates, elevating dashboard usability, adoption, and governance department-wide.
Data Science Analyst | Accenture India Pvt Ltd — Bangalore, India May 2021 – Jan 2023
• Built Power BI and Qlik dashboards with reusable DAX measures, automated refresh pipelines, and QA checks,
giving business teams on demand visibility into customer trends and operational KPIs.
• Applied Python (pandas, scikit-learn) to run uplift modeling and A/B test evaluations for promotional
campaigns, identifying high-response segments and increasing targeted conversion impact.
• Collaborated with Data Analysts and Data Scientists of marketing, product, and analytics teams to define KPI
logic, validate data sources, and translate business questions into reusable analytical frameworks.
• Implemented GDPR-aligned data governance using hashing, tokenization, and secure access rules, ensuring
customer-level reporting met privacy expectations for audits and partner reviews.
• Built demand forecasting models using Prophet, ARIMA, and XGBoost for BP's 2,800+ EU stores, achieving
91% accuracy (MAPE 8.7%) on 15K SKUs, cutting stockouts by 18% and perishable waste by 23%.
• Architected GCP pipelines processing 5TB daily POS data with PySpark on Dataproc and BigQuery
partitioning/clustering, delivering <2s query performance and 35% cost reduction via lifecycle policies.
• Automated ML deployment via Cloud Build, Terraform with drift monitoring, reducing deployment time 60%
(3 days to 4 hours) and eliminating 75% of manual validation through CI/CD gates.
• Deployed 37 Power BI dashboards with DAX for forecast accuracy, inventory KPIs, and promotional ROI across
country→store→product hierarchies, training 450+ stakeholders and boosting adoption by 40%.
Business Analyst | SRIT Pvt Ltd — Bangalore, India Jan 2020 – Apr 2021
• Gathered and clarified clinical workflow requirements through stakeholder interviews and SQL data reviews,
producing detailed FRDs/BRDs and Visio process maps that reduced integration defects across releases.
• Developed operational dashboards with Power BI and Apache Superset, defining KPIs, shaping data logic, and
enabling leadership to track patient-care metrics, service usage patterns, and administrative throughput.
• Led UAT cycles by writing test scenarios, validating business rules, logging defects, and coordinating fixes with
developers, ensuring each release met functional expectations before production sign-off.
• Translated healthcare requirements into FRDs and BRDs through stakeholder interviews, analyzing relational
data in PostgreSQL to improve project clarity and reduce integration errors.
• Led Agile sprints and stand-ups for a 13-member team, using MS Project for budget tracking, Visio for process
mapping, and JIRA for risk and deliverable management.
• Defined business rules for validating and transforming healthcare datasets, ensuring accurate, high-quality
inputs for interactive Power BI and Apache Superset dashboards, operational decision-making across C-suite.
Education
Masters in Data Science, University at Buffalo, GPA: 3.7/4.0 Jan 2023 – May 2024
Bachelor's in Computer Science, Karunya University, GPA: 3.4/4.0 Jun 2016 – Jul 2020
Projects
Telco Customer Churn Prediction {Tools: Python, Flask, Random Forest, XGBoost, Excel} §
• Established a churn prediction workflow using Flask and XGBoost (87% ROC-AUC), modeling customer
contracts, add-ons, and payments to identify high-risk cohorts and recommend targeted retention actions.
Real-Time Stock Market Data Pipeline {Tools: PySpark, Databricks, GCP, Apache Airflow} §
• Devised a real-time stock market data pipeline, leveraging PySpark for distributed processing, GCP Big Query
for scalable storage, Databricks for optimized querying, and Airflow for orchestration cutting query latency 30%.
Certifications
• Generative AI Professional (Oracle) • Fabric Data Engineer Associate (Azure)
`;
  // ==========================================
  // END OF CANDIDATE INFORMATION
  // ==========================================

  const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    console.error('⚠️ OpenRouter API key is missing!');
    console.error('Add REACT_APP_OPENROUTER_API_KEY to your .env file (local) or Vercel environment variables (production)');
  }

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
    // OPTIMIZATION: Condensed prompt reduces tokens by ~40%
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Portfolio Job Match Analyzer'
      },
      body: JSON.stringify({
        // OPTIMIZATION: Better free model with JSON support
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{
          role: 'system',
          content: 'You are a professional career advisor analyzing job fit. Respond ONLY with valid JSON, no extra text.'
        }, {
          role: 'user',
          // OPTIMIZATION: Streamlined prompt, removed redundancy
          content: `Analyze this candidate's fit for the job. Be honest - scores below 60% for poor matches.

JOB:
${jobDesc}

CANDIDATE:
${CANDIDATE_INFO}

Return ONLY this JSON structure (no markdown, no explanation):
{
  "matchScore": <0-100, realistic assessment>,
  "bestFitPoints": [
    "<achievement-based selling point with metrics>",
    "<transferable skill mapping to job requirement>",
    "<compelling reason with concrete example>",
    (5-6 points total)
  ],
  "topSkills": [
    {
      "skill": "<exact match from: AWS, Apache Airflow, Apache Spark, Azure Data Factory, Databricks, Delta Lake, Excel, Flask, MLflow, MySQL, Pandas, Power BI, PowerShell, Python, REST API, SQL, Scikit-learn, Snowflake, Tableau, XGBoost>",
      "context": "<1-2 sentence specific example from resume>"
    },
    (6 skills total)
  ]
}

Write professionally with enthusiasm. Use specific metrics and achievements from the resume.`
        }],
        // OPTIMIZATION: Lower temperature for consistent JSON
        temperature: 0.3,
        // OPTIMIZATION: Reduced from 7000 to 2500 (adequate for response)
        max_tokens: 2500,
        // OPTIMIZATION: JSON mode for better structure (if supported)
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to analyze with AI';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // If error response isn't JSON, use raw text
        errorMessage = errorText.substring(0, 200);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // OPTIMIZATION: Robust JSON extraction with multiple fallback strategies
    let parsedResult;
    
    // Strategy 1: Direct parse (works with json_object mode)
    try {
      parsedResult = JSON.parse(content);
    } catch (e1) {
      // Strategy 2: Extract JSON from markdown code block
      const codeBlockMatch = content.match(/``````/);
      if (codeBlockMatch) {
        try {
          parsedResult = JSON.parse(codeBlockMatch[1]);
        } catch (e2) {
          // Strategy 3: Find first { to last }
          const firstBrace = content.indexOf('{');
          const lastBrace = content.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            try {
              parsedResult = JSON.parse(content.substring(firstBrace, lastBrace + 1));
            } catch (e3) {
              throw new Error('Unable to parse AI response. Please try again.');
            }
          } else {
            throw new Error('No valid JSON found in response.');
          }
        }
      } else {
        throw new Error('Invalid response format from AI.');
      }
    }
    
    // Validate required fields
    if (!parsedResult.matchScore || !parsedResult.bestFitPoints || !parsedResult.topSkills) {
      throw new Error('Incomplete analysis received. Please try again.');
    }
    
    return parsedResult;
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
        }, 15000);
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
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                {/* decorative emoji-sized image */}
                <img
                  src="/search.png"
                  alt=""
                  aria-hidden="true"
                  className="inline-block align-text-bottom mr-2 select-none pointer-events-none"
                  style={{ width: '2em', height: '2em', verticalAlign: '-0.15em' }}
                />
                Looking for the perfect fit?
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
                  👇 Scroll down to see relevant projects filtered by these skills (Auto scroll activates in 20 Seconds)
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
