import React from 'react';
import { createRoot } from 'react-dom/client';
import { SidePanelApp } from './SidePanelApp';
import { ErrorBoundary } from '@/ui/ErrorBoundary';
import { AuthWall } from '../shared/AuthWall';
import '@/shared/global.css';

const root = document.getElementById('root')!;
createRoot(root).render(
  <ErrorBoundary>
    <AuthWall>
      <SidePanelApp />
    </AuthWall>
  </ErrorBoundary>
);
