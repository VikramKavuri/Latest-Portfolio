import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { projects } from '../../data/projects';
import ProjectSlider from '../projects/ProjectSlider';
import ProjectDetail from '../projects/ProjectDetail';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="prx-page">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <ProjectDetail
            key="detail"
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <ProjectSlider
            key="slider"
            projects={projects}
            onSelectProject={setSelectedProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
