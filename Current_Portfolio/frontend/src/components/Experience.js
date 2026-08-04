import React, { useState, useEffect, useRef } from 'react';
import { Building2, Calendar, MapPin, TrendingUp, Users, Award } from 'lucide-react';

const Experience = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const experienceRef = useRef(null);

  const experiences = [
    {
      id: 1,
      title: "Data Analytics Engineer",
      company: "The Arc Erie County, New York",
      location: "Buffalo, New York, US",
      period: "Jan 2025 – Present",
      type: "Current Role",
      highlights: [
        "Integrated PrecisionCare (EHR), NetSuite (ERP), and Dayforce (HRIS) via REST APIs (OAuth 2.0), creating a single, trusted dataset for clinical, finance, and workforce reporting.",
        "Fine-tuned Qwen2.5-VL model using LoRA for automated form extraction, achieving 87% accuracy on 10K handwritten healthcare documents while maintaining HIPAA compliance.",
        "Architected Snowflake cloud data warehouse with dimensional modeling, accelerating queries by 85% and enabling real-time insights for 50+ concurrent users.",
        "Translated Medicare billing flow into Tableau dashboards (denials, AR aging, submission SLAs); reduced backlog 40%, cut submission time 18→11 days, and dropped ad-hoc asks 70%.",
        "Implemented HIPAA & FERPA compliant data governance with role-based security, passing audits with zero findings while supporting daily operations."
      ],
      technologies: ["Python", "Snowflake", "Apache Airflow", "SQL", "Tableau", "SSRS"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    },
    {
      id: 2,
      title: "Data Science Analyst",
      company: "Accenture India Pvt Ltd",
      location: "Bangalore, India",
      period: "May 2021 – Jan 2023",
      type: "1 year 9 months",
      highlights: [
        "Supported a Fortune 500 retail client’s shift to a cloud-native lakehouse, bridging raw data pipelines to decision-ready analytics for supply-chain leaders.",
        "Architected PySpark data pipelines on AWS (Redshift, S3) processing millions of daily transactional records, improving query performance by 25% through optimized stored procedures.",
        "Applied the Pareto (80/20) analysis on Snowflake workloads; introduced materialized views + clustering keys to cut the Morning Executive Report runtime from 4 hours to 45 minutes.",
        "Built XGBoost time-series forecasting model achieving <12% MAPE, solving chronic stockout issues by analyzing seasonality, price elasticity, and local events.",
        "Delivered insights to non-technical stakeholders through Power BI dashboards; built 37 dashboards/reports (Power BI, Qlik Sense, Excel) and boosted report reliability by 20% via automated validation.",
        "Engineered automated CI/CD pipelines using Azure DevOps, reducing deployment time by 50% and enabling near real-time inventory response for supply chain teams."
      ],
      technologies: ["PySpark", "AWS Redshift", "AWS S3", "Snowflake", "Power BI", "Azure DevOps", "Qlik Sense"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      id: 3,
      title: "Business Analyst",
      company: "SRIT Pvt Ltd",
      location: "Bangalore, India",  
      period: "Jan 2020 – Apr 2021",
      type: "1 year 4 months",
      highlights: [
        "Structured problem solving (MECE) and bottleneck diagnosis (Theory of Constraints) to isolate the few constraints driving most delays; prioritized the highest-leverage fixes and contributed to an 8% improvement in hospital performance metrics.",
        "Built and maintained Power BI and Apache Superset dashboards for daily operational visibility (throughput, bottlenecks, and performance trends), turning complex hospital activity into simple, decision-ready views for non-technical stakeholders.",
        "Produced end-to-end process maps and workflow documentation (Visio), aligning stakeholders on “current vs. future state” and ensuring build teams had an unambiguous blueprint tied to clinical intent.",
        "Led 13-member Agile team using JIRA and MS Project, delivering healthcare solutions with servant-leadership approach while maintaining budget discipline and fiscal responsibility.",
        "Analyzed 1M+ patient records using SQL and K-means clustering to identify high-risk cohorts, unlocking 8% improvement in hospital performance metrics."
      
      ],
      technologies: ["SQL", "Power BI", "Apache Superset", "Visio", "JIRA", "MS Project"],
      image: "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.dataset.id);
            setVisibleItems(prev => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = experienceRef.current?.querySelectorAll('[data-id]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-24 bg-gray-50 scroll-mt-24" ref={experienceRef}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-thin text-gray-900 mb-6">Experience</h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            A journey through transformative roles in data engineering, 
            delivering measurable impact across diverse industries
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 h-full hidden lg:block"></div>

          {experiences.map((exp, index) => (
            <div 
              key={exp.id}
              data-id={exp.id}
              className={`relative mb-20 transition-all duration-1000 transform ${
                visibleItems.has(exp.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className={`lg:flex items-center ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
                
                {/* Content Card */}
                <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          exp.type === 'Current Role' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {exp.type}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {exp.period}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {exp.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-5 h-5 mr-2" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-gray-600 flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden lg:flex lg:w-2/12 justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                {/* Image */}
                <div className={`lg:w-5/12 mt-8 lg:mt-0 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                  <div className="relative group">
                    <img 
                      src={exp.image}
                      alt={`${exp.title} at ${exp.company}`}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-24 bg-white rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50%</div>
              <div className="text-gray-600">Process Improvement</div>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5TB</div>
              <div className="text-gray-600">Daily Data Processed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
