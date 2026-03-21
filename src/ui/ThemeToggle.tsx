import React, { useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'li-post-gen-theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === 'system' ? getSystemTheme() : mode;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.setAttribute('data-theme', resolved);
}

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    // Load from chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        const saved = result[STORAGE_KEY] as ThemeMode | undefined;
        if (saved) {
          setMode(saved);
          applyTheme(saved);
          try {
            const resolved = saved === 'system' ? getSystemTheme() : saved;
            localStorage.setItem('li-post-gen-theme-sync', resolved);
          } catch (_) {}
        } else {
          applyTheme('system');
        }
      });
    } else {
      applyTheme('system');
    }

    // Listen for system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // Re-apply if current mode is system
      setMode((current) => {
        if (current === 'system') applyTheme('system');
        return current;
      });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cycle = useCallback(() => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    applyTheme(next);
    // Persist to chrome.storage for cross-context sync
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: next });
    }
    // Also sync to localStorage for FOUC prevention on next load
    try {
      const resolved = next === 'system' ? getSystemTheme() : next;
      localStorage.setItem('li-post-gen-theme-sync', resolved);
    } catch (_) {}
  }, [mode]);

  const icon = mode === 'light' ? (
    // Sun icon
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ) : mode === 'dark' ? (
    // Moon icon
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ) : (
    // System/monitor icon
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );

  const label = mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'Auto';

  return (
    <button
      onClick={cycle}
      className="text-white/80 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
      title={`Theme: ${label}. Click to switch.`}
    >
      {icon}
      {!compact && <span className="text-xs">{label}</span>}
    </button>
  );
};
