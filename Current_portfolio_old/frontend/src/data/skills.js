const SNOWFLAKE_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%2329B6F6' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M32 6v52M10 19l44 26M54 19 10 45M22 11l10 8 10-8M22 53l10-8 10 8M9 31l13-4-3-13M55 31l-13-4 3-13M9 33l13 4-3 13M55 33l-13 4 3 13'/%3E%3C/g%3E%3C/svg%3E";

export const skills = {
  technical: [
    {
      category: "Languages",
      skills: [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
        { name: "PySpark", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg" },
        { name: "PowerShell", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg" },
        { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
        { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" }
      ]
    },
    {
      category: "Cloud",
      skills: [
        { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        { name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" },
        { name: "Databricks", icon: "https://www.vectorlogo.zone/logos/databricks/databricks-icon.svg" }
      ]
    },
    {
      category: "Data Tools",
      skills: [
        { name: "Tableau", icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg" },
        { name: "Power BI", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
        { name: "Apache Airflow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg" },
        { name: "Hadoop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hadoop/hadoop-original.svg" },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "SSIS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" }
      ]
    },
    {
      category: "Databases",
      skills: [
        { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "SQL Server", icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg" },
        { name: "Snowflake", icon: SNOWFLAKE_ICON },
        { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" }
      ]
    }
  ]
};
