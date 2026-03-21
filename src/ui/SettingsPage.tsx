import React, { useState, useEffect, useCallback } from 'react';
import { LANGUAGES, MODELS, DEFAULT_API_URL, DEFAULT_MODEL } from '@/shared/constants';
import { ThemeToggle } from '@/ui/ThemeToggle';

const SETTINGS_KEY = 'li-post-gen-settings';

export interface AppSettings {
  apiEndpoint: string;
  model: string;
  defaultLanguage: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiEndpoint: DEFAULT_API_URL,
  model: DEFAULT_MODEL,
  defaultLanguage: 'en',
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(SETTINGS_KEY, (result) => {
          const saved = result[SETTINGS_KEY] as Partial<AppSettings> | undefined;
          resolve({ ...DEFAULT_SETTINGS, ...saved });
        });
      });
    }
  } catch (_) {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
    }
  } catch (_) {}
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateField = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return next;
    });
  }, []);

  const handleClearData = useCallback(async () => {
    if (!confirm('Clear all PostCraft AI data? This removes favorites, settings, and onboarding state.')) return;
    setClearing(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.clear();
      }
      setSettings(DEFAULT_SETTINGS);
      setTimeout(() => {
        setClearing(false);
        window.location.reload();
      }, 500);
    } catch (_) {
      setClearing(false);
    }
  }, []);

  return (
    <div className="space-y-5 fade-in">
      {/* Saved indicator */}
      {saved && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl text-xs text-green-600 dark:text-green-400 fade-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Settings saved
        </div>
      )}

      {/* AI Endpoint */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">AI Endpoint</label>
        <input
          type="url"
          value={settings.apiEndpoint}
          onChange={(e) => updateField('apiEndpoint', e.target.value)}
          placeholder="https://sai.sharedllm.com"
          className="input-field text-xs font-mono"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          OpenAI-compatible API endpoint. Default: sai.sharedllm.com
        </p>
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">Model</label>
        <div className="grid grid-cols-1 gap-1.5">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => updateField('model', m.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all duration-200 text-left ${
                settings.model === m.id
                  ? 'border-linkedin-500 bg-linkedin-50 dark:bg-linkedin-900/30 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${
                  settings.model === m.id ? 'text-linkedin-600 dark:text-linkedin-300' : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {m.label}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.description}</p>
              </div>
              {settings.model === m.id && (
                <svg className="w-5 h-5 text-linkedin-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">Theme</label>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
          <ThemeToggle />
          <p className="text-xs text-gray-500 dark:text-gray-400">Click to cycle: Light / Dark / System</p>
        </div>
      </div>

      {/* Default Language */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">Default Language</label>
        <select
          value={settings.defaultLanguage}
          onChange={(e) => updateField('defaultLanguage', e.target.value)}
          className="input-field text-sm appearance-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Data */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">Data</label>
        <button
          onClick={handleClearData}
          disabled={clearing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-xl border border-red-200 dark:border-red-800/40 transition-all text-xs"
        >
          {clearing ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Clearing...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Data
            </>
          )}
        </button>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          Removes all favorites, settings, and onboarding progress.
        </p>
      </div>

      {/* About */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">About</label>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linkedin-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">Li</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">PostCraft AI</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">v1.0.0</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            AI-powered LinkedIn post generator. Create viral posts, hooks, and hashtags in seconds.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://github.com/kalavathiramarao76-ui/linkedin-post-generator-ext"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-linkedin-500 hover:text-linkedin-600 font-medium transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">R3 Build</span>
          </div>
        </div>
      </div>
    </div>
  );
};
