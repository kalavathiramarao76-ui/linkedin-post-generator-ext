import React, { useState, useCallback, useRef } from 'react';
import { generateStreaming } from '@/shared/api';
import { buildPostPrompt, buildHookPrompt, buildHashtagPrompt, buildToneAdjustPrompt } from '@/shared/prompts';
import { TEMPLATES } from '@/shared/constants';
import { StyleSelector } from '@/ui/StyleSelector';
import { LanguageSelector } from '@/ui/LanguageSelector';
import { ToneSelector } from '@/ui/ToneSelector';
import { CharacterCounter } from '@/ui/CharacterCounter';
import { LinkedInPreview } from '@/ui/LinkedInPreview';
import { ThemeToggle } from '@/ui/ThemeToggle';
import { OnboardingTour } from '@/ui/OnboardingTour';

type Tab = 'generate' | 'hooks' | 'hashtags' | 'tone' | 'preview' | 'templates';

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
  const abortRef = useRef<AbortController | null>(null);

  const cancelGeneration = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setOutput('');
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
        setOutput(`Error: ${(err as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [topic, style, language, tone, loading]);

  const handleGenerateHooks = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setHooks('');
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
        setHooks(`Error: ${(err as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [topic, language, loading]);

  const handleGenerateHashtags = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setHashtags('');
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
        setHashtags(`Error: ${(err as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [topic, loading]);

  const handleAdjustTone = useCallback(async (newTone: string) => {
    if (!output.trim() || loading) return;
    setTone(newTone);
    setLoading(true);

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
        setOutput(`Error: ${(err as Error).message}`);
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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'generate', label: 'Generate', icon: '✨' },
    { id: 'hooks', label: 'Hooks', icon: '🪝' },
    { id: 'hashtags', label: 'Hashtags', icon: '#' },
    { id: 'tone', label: 'Tone', icon: '🎭' },
    { id: 'preview', label: 'Preview', icon: '👁' },
    { id: 'templates', label: 'Templates', icon: '📄' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-gray-900">
      <OnboardingTour />
      {/* Header */}
      <div className="bg-gradient-to-r from-linkedin-500 to-linkedin-600 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Li</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Post Generator</h1>
              <p className="text-blue-100 text-[10px]">Full Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  <div className="flex gap-1.5">
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
                    <p className="text-sm text-gray-800 dark:text-gray-200">{hook}</p>
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
                      <button
                        key={i}
                        onClick={() => handleCopy(tag.trim())}
                        className="px-3 py-1.5 bg-linkedin-50 text-linkedin-600 rounded-full text-sm font-medium hover:bg-linkedin-100 transition-colors"
                      >
                        {tag.trim()}
                      </button>
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
      </div>
    </div>
  );
};
