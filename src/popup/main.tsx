import React from 'react';
import { createRoot } from 'react-dom/client';
import { PopupApp } from './PopupApp';
import { ErrorBoundary } from '@/ui/ErrorBoundary';
import { AuthWall } from '../shared/AuthWall';
import '@/shared/global.css';

const root = document.getElementById('root')!;
createRoot(root).render(
  <ErrorBoundary>
    <AuthWall>
      <PopupApp />
    </AuthWall>
  </ErrorBoundary>
);
