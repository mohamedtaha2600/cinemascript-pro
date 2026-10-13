import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { StudioLayout } from './components/templates/StudioLayout';

export default function App() {
  return (
    <ProjectProvider>
      <StudioLayout />
    </ProjectProvider>
  );
}
