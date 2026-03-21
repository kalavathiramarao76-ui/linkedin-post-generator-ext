import React, { useState, useCallback, useRef, useEffect } from 'react';
import { POST_STYLES } from '@/shared/constants';
import { generateStreaming } from '@/shared/api';
import { buildPostPrompt } from '@/shared/prompts';
import { StyleSelector } from '@/ui/StyleSelector';
import { LanguageSelector } from '@/ui/LanguageSelector';
import { CharacterCounter } from '@/ui/CharacterCounter';
import { ThemeToggle } from '@/ui/ThemeToggle';

export const PopupApp: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('thought-leader');
  const [language, setLanguage] = useState('en');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setOutput('');

    abortRef.current = new AbortController();
    const messages = buildPostPrompt(topic, style, language);

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
  }, [topic, style, language, loading]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const openSidePanel = useCallback(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id && chrome.sidePanel) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }, []);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  return (
    <div className="w-[380px] min-h-[500px] bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-linkedin-500 to-linkedin-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Li</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">PostCraft AI</h1>
              <p className="text-blue-100 text-[10px]">AI-powered LinkedIn post generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <LanguageSelector value={language} onChange={setLanguage} compact />
            <button
              onClick={openSidePanel}
              className="text-white/80 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
              title="Open full workspace"
            >
              Full Editor
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Topic Input */}
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Topic</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to write about?"
            className="input-field resize-none h-20"
            autoFocus
          />
        </div>

        {/* Style */}
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">Style</label>
          <StyleSelector value={style} onChange={setStyle} compact />
        </div>

        {/* Generate */}
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
              Generating...
            </>
          ) : (
            <>Generate Post</>
          )}
        </button>

        {/* Output */}
        {output && (
          <div className="fade-in space-y-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 max-h-52 overflow-y-auto">
              <p className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed ${loading ? 'typing-cursor' : ''}`}>
                {output}
              </p>
            </div>
            <CharacterCounter count={output.length} />
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary flex-1 text-xs flex items-center justify-center gap-1">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => {
                  if (abortRef.current) abortRef.current.abort();
                  setOutput('');
                  setLoading(false);
                }}
                className="btn-secondary text-xs px-3"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
