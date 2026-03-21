import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateStreaming } from '@/shared/api';
import { buildPostPrompt, buildHookPrompt, buildHashtagPrompt, buildToneAdjustPrompt } from '@/shared/prompts';
import { TEMPLATES } from '@/shared/constants';
import { getFavorites, type FavoriteItem } from '@/shared/favorites';
import { StyleSelector } from '@/ui/StyleSelector';
import { LanguageSelector } from '@/ui/LanguageSelector';
import { ToneSelector } from '@/ui/ToneSelector';
import { CharacterCounter } from '@/ui/CharacterCounter';
import { LinkedInPreview } from '@/ui/LinkedInPreview';
import { ThemeToggle } from '@/ui/ThemeToggle';
import { OnboardingTour } from '@/ui/OnboardingTour';
import { FavoriteButton } from '@/ui/FavoriteButton';
import { CommandPalette, type PaletteCommand } from '@/ui/CommandPalette';
import { ApiErrorFallback } from '@/ui/ApiErrorFallback';
import { SettingsPage, loadSettings } from '@/ui/SettingsPage';

type Tab = 'generate' | 'hooks' | 'hashtags' | 'tone' | 'preview' | 'templates' | 'favorites' | 'settings';

export const SidePanelApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('thought-leader');
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('professional');
  const [output, setOutput] = useState('');
  const [hooks, setHooks] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [apiError, setApiError] = useState<{ message: string; retryFn: () => void } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load settings (default language)
  useEffect(() => {
    loadSettings().then((s) => {
      if (s.defaultLanguage) setLanguage(s.defaultLanguage);
    });
  }, []);

  // Load favorites count
  useEffect(() => {
    getFavorites().then((favs) => {
      setFavCount(favs.length);
      setFavorites(favs);
    });
  }, [activeTab]);

  const refreshFavorites = useCallback(async () => {
    const favs = await getFavorites();
    setFavCount(favs.length);
    setFavorites(favs);
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setOutput('');
    setApiError(null);
    setActiveTab('generate');

    abortRef.current = new AbortController();
    const messages = buildPostPrompt(topic, style, language, tone);

    try {
      await generateStreaming({
        messages,
        onChunk: (text) => setOutput(text),
        signal: abortRef.current.signal,
      });
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setApiError({ message: (err as Error).message, retryFn: () => handleGenerate() });
      }
    } finally {
      setLoading(false);
    }
  }, [topic, style, language, tone, loading]);

  const handleGenerateHooks = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setHooks('');
    setApiError(null);
    setActiveTab('hooks');

    abortRef.current = new AbortController();
    const messages = buildHookPrompt(topic, language);

    try {
      await generateStreaming({
        messages,
        onChunk: (text) => setHooks(text),
        signal: abortRef.current.signal,
      });
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setApiError({ message: (err as Error).message, retryFn: () => handleGenerateHooks() });
      }
    } finally {
      setLoading(false);
    }
  }, [topic, language, loading]);

  const handleGenerateHashtags = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setHashtags('');
    setApiError(null);
    setActiveTab('hashtags');

    abortRef.current = new AbortController();
    const messages = buildHashtagPrompt(topic);

    try {
      await generateStreaming({
        messages,
        onChunk: (text) => setHashtags(text),
        signal: abortRef.current.signal,
      });
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setApiError({ message: (err as Error).message, retryFn: () => handleGenerateHashtags() });
      }
    } finally {
      setLoading(false);
    }
  }, [topic, loading]);

  const handleAdjustTone = useCallback(async (newTone: string) => {
    if (!output.trim() || loading) return;
    setTone(newTone);
    setLoading(true);
    setApiError(null);

    abortRef.current = new AbortController();
    const messages = buildToneAdjustPrompt(output, newTone, language);

    try {
      await generateStreaming({
        messages,
        onChunk: (text) => setOutput(text),
        signal: abortRef.current.signal,
      });
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setApiError({ message: (err as Error).message, retryFn: () => handleAdjustTone(newTone) });
      }
    } finally {
      setLoading(false);
    }
  }, [output, language, loading]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleUseTemplate = useCallback((content: string) => {
    setOutput(content);
    setActiveTab('generate');
  }, []);

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'generate', label: 'Generate', icon: '✨' },
    { id: 'hooks', label: 'Hooks', icon: '🪝' },
    { id: 'hashtags', label: 'Hashtags', icon: '#' },
    { id: 'tone', label: 'Tone', icon: '🎭' },
    { id: 'preview', label: 'Preview', icon: '👁' },
    { id: 'templates', label: 'Templates', icon: '📄' },
    { id: 'favorites', label: 'Favorites', icon: '⭐', badge: favCount },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const themeToggleRef = useRef<HTMLButtonElement | null>(null);

  const paletteCommands: PaletteCommand[] = [
    { id: 'generate-post', label: 'Generate Post', icon: '✨', action: () => { setActiveTab('generate'); } },
    { id: 'generate-hooks', label: 'Generate Hooks', icon: '🪝', action: () => { setActiveTab('hooks'); } },
    { id: 'suggest-hashtags', label: 'Suggest Hashtags', icon: '#', action: () => { setActiveTab('hashtags'); } },
    { id: 'adjust-tone', label: 'Adjust Tone', icon: '🎭', action: () => { setActiveTab('tone'); } },
    { id: 'view-templates', label: 'View Templates', icon: '📄', action: () => { setActiveTab('templates'); } },
    { id: 'view-favorites', label: 'View Favorites', icon: '⭐', action: () => { setActiveTab('favorites'); } },
    { id: 'toggle-theme', label: 'Toggle Theme', icon: '🌓', action: () => { themeToggleRef.current?.click(); } },
    { id: 'settings', label: 'Settings', icon: '⚙️', action: () => { setActiveTab('settings'); } },
    { id: 'linkedin-preview', label: 'LinkedIn Preview', icon: '👁', action: () => { setActiveTab('preview'); } },
    { id: 'help', label: 'Help', icon: '❓', shortcut: '?', action: () => { window.open('https://github.com/kalavathiramarao76-ui/linkedin-post-generator-ext', '_blank'); } },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-gray-900">
      <OnboardingTour />
      <CommandPalette commands={paletteCommands} />
      {/* Header */}
      <div className="bg-gradient-to-r from-linkedin-500 to-linkedin-600 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Li</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Quillnova</h1>
              <p className="text-blue-100 text-[10px]">Full Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-white/60 hover:text-white/90 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors font-mono"
              onClick={() => {
                const ev = new KeyboardEvent('keydown', { key: 'K', shiftKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(ev);
              }}
              title="Command Palette (Ctrl+Shift+K)"
            >
              Ctrl+Shift+K
            </button>
            <ThemeToggle />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-linkedin-500 text-linkedin-600 dark:text-linkedin-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-amber-400 text-white rounded-full leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* API Error Fallback */}
        {apiError && (
          <ApiErrorFallback
            error={apiError.message}
            onRetry={() => { setApiError(null); apiError.retryFn(); }}
          />
        )}

        {/* Topic input - always visible */}
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Topic</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="What do you want to write about?"
            className="input-field resize-none h-16"
          />
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4 fade-in">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">Post Style</label>
              <StyleSelector value={style} onChange={setStyle} />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">Tone</label>
              <ToneSelector value={tone} onChange={setTone} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Generating...</span>
                  <button onClick={cancelGeneration} className="ml-2 text-xs underline">Cancel</button>
                </>
              ) : (
                'Generate Post'
              )}
            </button>

            {output && (
              <div className="space-y-2 slide-up">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Generated Post</label>
                  <div className="flex items-center gap-1.5">
                    <FavoriteButton type="post" content={output} topic={topic} onToggle={() => refreshFavorites()} size="sm" />
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleCopy(output)}
                      className="text-xs text-linkedin-500 hover:text-linkedin-600 font-medium"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className="text-xs text-linkedin-500 hover:text-linkedin-600 font-medium"
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <textarea
                  value={output}
                  onChange={e => setOutput(e.target.value)}
                  className="input-field resize-none min-h-[200px] text-sm leading-relaxed"
                />
                <CharacterCounter count={output.length} />
              </div>
            )}
          </div>
        )}

        {/* Hooks Tab */}
        {activeTab === 'hooks' && (
          <div className="space-y-3 fade-in">
            <button
              onClick={handleGenerateHooks}
              disabled={!topic.trim() || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Generating Hooks...' : 'Generate 10 Hooks'}
            </button>

            {hooks && (
              <div className="space-y-2 slide-up">
                {hooks.split('\n').filter(l => l.trim()).map((hook, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-linkedin-300 dark:hover:border-linkedin-500 hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => handleCopy(hook.replace(/^\d+\.\s*/, ''))}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{hook}</p>
                      <FavoriteButton type="hook" content={hook.replace(/^\d+\.\s*/, '')} topic={topic} onToggle={() => refreshFavorites()} size="sm" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to copy
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hashtags Tab */}
        {activeTab === 'hashtags' && (
          <div className="space-y-3 fade-in">
            <button
              onClick={handleGenerateHashtags}
              disabled={!topic.trim() || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Finding Hashtags...' : 'Generate Hashtags'}
            </button>

            {hashtags && (
              <div className="slide-up">
                <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  {hashtags
                    .split('\n')
                    .filter(h => h.trim().startsWith('#'))
                    .map((tag, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(tag.trim())}
                          className="px-3 py-1.5 bg-linkedin-50 text-linkedin-600 rounded-full text-sm font-medium hover:bg-linkedin-100 transition-colors"
                        >
                          {tag.trim()}
                        </button>
                        <FavoriteButton type="hashtag" content={tag.trim()} topic={topic} onToggle={() => refreshFavorites()} size="sm" />
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => handleCopy(hashtags.split('\n').filter(h => h.trim().startsWith('#')).join(' '))}
                  className="btn-secondary w-full mt-2 text-xs"
                >
                  Copy All Hashtags
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tone Tab */}
        {activeTab === 'tone' && (
          <div className="space-y-4 fade-in">
            {output ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 block">
                    Select a tone to adjust your post
                  </label>
                  <ToneSelector
                    value={tone}
                    onChange={(t) => handleAdjustTone(t)}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    {output}
                  </p>
                </div>
                <CharacterCounter count={output.length} />
              </>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-3xl mb-2">🎭</p>
                <p className="text-sm">Generate a post first, then adjust its tone here</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-3 fade-in">
            {output ? (
              <>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">LinkedIn Preview</label>
                <LinkedInPreview content={output} />
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(output)} className="btn-primary flex-1 text-sm">
                    {copied ? 'Copied!' : 'Copy Post'}
                  </button>
                  <button onClick={() => setActiveTab('generate')} className="btn-secondary text-sm">
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-3xl mb-2">👁</p>
                <p className="text-sm">Generate a post first to see the preview</p>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-3 fade-in">
            <p className="text-xs text-gray-500 dark:text-gray-400">Click a template to use it as a starting point</p>
            {TEMPLATES.map(template => (
              <div
                key={template.id}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-linkedin-300 dark:hover:border-linkedin-500 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => handleUseTemplate(template.content)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{template.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{template.content.slice(0, 100)}...</p>
                <p className="text-[10px] text-linkedin-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Click to use this template
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-3 fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {favorites.length} saved item{favorites.length !== 1 ? 's' : ''} (max 50)
              </p>
            </div>
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-3xl mb-2">⭐</p>
                <p className="text-sm">No favorites yet</p>
                <p className="text-xs mt-1">Star posts, hooks, or hashtags to save them here</p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          fav.type === 'post' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
                          fav.type === 'hook' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' :
                          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {fav.type}
                        </span>
                        {fav.topic && (
                          <span className="text-[10px] text-gray-400 truncate">{fav.topic}</span>
                        )}
                        <span className="text-[10px] text-gray-300 dark:text-gray-600 ml-auto shrink-0">
                          {new Date(fav.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 whitespace-pre-line">
                        {fav.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(fav.content)}
                        className="text-[10px] text-gray-400 hover:text-linkedin-500 transition-colors"
                      >
                        Copy
                      </button>
                      <FavoriteButton type={fav.type} content={fav.content} onToggle={() => refreshFavorites()} size="sm" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
};
