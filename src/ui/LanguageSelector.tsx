import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '@/shared/constants';

interface Props {
  value: string;
  onChange: (code: string) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({ value, onChange, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors`}
      >
        <span className="text-base">{selected.flag}</span>
        {!compact && <span className="text-gray-700">{selected.label}</span>}
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto fade-in">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-linkedin-50 transition-colors ${lang.code === value ? 'bg-linkedin-50 text-linkedin-600 font-medium' : 'text-gray-700'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === value && (
                <svg className="w-4 h-4 ml-auto text-linkedin-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
