// Mock data for the portfolio - this will be replaced with backend integration later
// At the top of your testimonials component or data file
import RuchikaAvatar from './Ruchika.jpg';
import SubhashreeAvatar from './Subhashree.jpg';

// export const mockSkills = {
//   technical: [
//     {
//       category: "Programming Languages",
//       skills: [
//         { name: "Python", level: 95, icon: "🐍" },
//         { name: "SQL", level: 90, icon: "🔍" },
//         { name: "PySpark", level: 85, icon: "⚡" },
//         { name: "PowerShell", level: 80, icon: "💻" },
//         { name: "R", level: 75, icon: "📊" },
//         { name: "Java", level: 70, icon: "☕" }
//       ]
//     },
//     {
//       category: "Cloud Platforms",
//       skills: [
//         { name: "AWS", level: 90, icon: "☁️" },
//         { name: "Azure", level: 85, icon: "🌐" },
//         { name: "Databricks", level: 80, icon: "🔥" },
//         { name: "Snowflake", level: 85, icon: "❄️" }
//       ]
//     },
//     {
//       category: "Data Tools & Technologies",
//       skills: [
//         { name: "Apache Airflow", level: 85, icon: "🌬️" },
//         { name: "Tableau", level: 90, icon: "📈" },
//         { name: "Power BI", level: 88, icon: "⚡" },
//         { name: "Apache Kafka", level: 80, icon: "🚀" },
//         { name: "Docker", level: 75, icon: "🐳" },
//         { name: "SSIS", level: 85, icon: "🔄" }
//       ]
//     },
//     {
//       category: "Databases",
//       skills: [
//         { name: "PostgreSQL", level: 90, icon: "🍃" },
//         { name: "Snowflake", level: 80, icon: "🍃" },
//         { name: "MySQL", level: 85, icon: "🗄️" },
//         { name: "MongoDB", level: 55, icon: "⚡" }
//       ]
//     }
//   ]
// };
export const mockSkills = {
  technical: [
    {
      category: "Programming Languages",
      skills: [
        {
          name: "Python",
          level: 95,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
        },
        {
          name: "SQL",
          level: 95,
          iconType: "image",
          icon: "https://img.favpng.com/6/22/18/clip-art-microsoft-azure-sql-database-microsoft-sql-server-png-favpng-vuy3jBrd8YXkMut1vRTrG8B3F.jpg"
        },
        {
          name: "PySpark",
          level: 80,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg"
        },
        {
          name: "PowerShell",
          level: 75,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg"
        },
        {
          name: "R",
          level: 65,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg"
        },
        {
          name: "Java",
          level: 60,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
        }
      ]
    },
    {
      category: "Cloud Platforms",
      skills: [
        {
          name: "AWS",
          level: 90,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
        },
        {
          name: "Azure",
          level: 80,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
        },
        {
          name: "GCP",
          level: 80,
          iconType: "image",
          icon: "https://e7.pngegg.com/pngimages/834/472/png-clipart-google-cloud-icon-google-cloud-platform-cloud-computing-amazon-web-services-virtual-private-cloud-cloud-computing-text-trademark.png"
        },
        {
          name: "Databricks",
          level: 75,
          iconType: "image",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRk55thBB29oWmkALZ9-rQUxrJw5tBp51KNw&s"
        },
        // {
        //   name: "Snowflake",
        //   level: 85,
        //   iconType: "image",
        //   icon: "https://www.svgheart.com/wp-content/uploads/2021/11/snowflakes-christmas-winter-season-free-svg-file-SvgHeart.Com.png"
        // }
      ]
    },
    {
      category: "Data Tools & Technologies",
      skills: [
        {
          name: "Tableau",
          level: 90,
          iconType: "image",
          icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg"
        },
        {
          name: "Power BI",
          level: 88,
          iconType: "image",
          icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg"
        },
        {
          name: "Apache Airflow",
          level: 85,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg"
        },
        {
          name: "Hadoop",
          level: 75,
          iconType: "image",
          icon: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Hadoop_logo.svg"
        },
        {
          name: "Docker",
          level: 75,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
        },
        {
          name: "SSIS",
          level: 75,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg"
        }
      ]
    },
    {
      category: "Databases",
      skills: [
        {
          name: "PostgreSQL",
          level: 90,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
        },
        {
          name: "SQL Server",
          level: 90,
          iconType: "image",
          icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg"
        },
        {
          name: "Snowflake",
          level: 85,
          iconType: "image",
          icon: "https://www.svgheart.com/wp-content/uploads/2021/11/snowflakes-christmas-winter-season-free-svg-file-SvgHeart.Com.png"
        },
        {
          name: "MySQL",
          level: 80,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
        },
        {
          name: "MongoDB",
          level: 65,
          iconType: "image",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
        }
      ]
    }
  ]
};


export const mockCertifications = [
  {
    id: 1,
    name: "Microsoft Certified: Fabric Data Engineer Associate",
    issuer: "Microsoft",
    date: "2024",
    credentialUrl: "#",
    verified: true,
    logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 2,
    name: "Oracle Cloud Infrastructure 2024 Generative AI Certified Professional",
    issuer: "Oracle",
    date: "2024",
    credentialUrl: "#",
    verified: true,
    logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 3,
    name: "Python for Data Science, AI & Development",
    issuer: "Coursera",
    date: "2023",
    credentialUrl: "#",
    verified: true,
    logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop&crop=faces"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Ruchika Grover",
    role: "Data Science Senior Manager",
    company: "Accenture",
    content: "I have worked with Vikram on one of the project to support the regular requirements of the client. He has always delivered the work as per the requirements and utmost quality. Vikram is a fast learner, hard working , diligent have always taken ownership of his responsibilities. He is well organised and dedicated towards his work. Has has also developed his technical skills to support business needs. It was a pleasure working with him.",
    avatar: RuchikaAvatar,
    rating: 5,
    linkedIn: "https://www.linkedin.com/in/thrivikrama-rao-kavuri-7290b6147/"
  },
  {
    id: 2,
    name: "Subhrashree Khasnobish",
    role: "Technical Lead",
    company: "The Arc Erie County",
    content: "I have worked with Thrivikrama in one of the project for a renowned Oil and Energy company based out of UK. The first impression that I had of Vikram in our first team call is that this guy must be of senior analyst level or above as he represented good knowledge of systems and business processes and speaking confidently like an experienced person will do even though he was a fresher at that time. He is very soft spoken and had presented case issues to the client quite smoothly and independently in situations where many experienced people will hesitate to present. Throughout this guy has shown exceptional maturity and patience, be it figuring out data issues or meeting a tight timeline of delivery.",
    avatar: SubhashreeAvatar,
    rating: 5,
    linkedIn: "https://www.linkedin.com/in/thrivikrama-rao-kavuri-7290b6147/"
  }
];

export const mockContactInfo = {
  email: "thrivikramaraokavuri@gmail.com",
  phone: "(716) 253-5373",
  location: "Buffalo, New York, US",
  linkedIn: "https://www.linkedin.com/in/thrivikrama-rao-kavuri-7290b6147/",
  github: "https://github.com/VikramKavuri",
  availability: "Open to new opportunities",
  timezone: "EST (Eastern Standard Time)"
};
