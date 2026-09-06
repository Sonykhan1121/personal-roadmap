import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RoadmapApp from '@/components/roadmap-app';
import '@/app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('The roadmap root element is missing.');
createRoot(root).render(
  <StrictMode>
    <RoadmapApp />
  </StrictMode>,
);
