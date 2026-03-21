import React, { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'li-post-gen-onboarded';

interface StepData {
  title: string;
  content: React.ReactNode;
}

function createConfetti() {
  const colors = ['#0a66c2', '#00a0dc', '#f5c75d', '#e74c3c', '#2ecc71', '#9b59b6'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden';
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 1.5 + Math.random() * 1.5;
    const size = 6 + Math.random() * 6;
    const rotation = Math.random() * 360;

    piece.style.cssText = `
      position:absolute;top:-10px;left:${left}%;
      width:${size}px;height:${size * 0.4}px;
      background:${color};border-radius:1px;
      transform:rotate(${rotation}deg);
      animation:confetti-fall ${duration}s ease-in ${delay}s forwards;
    `;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 4000);
}

const steps: StepData[] = [
  {
    title: 'Welcome to Post Generator',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Create engaging LinkedIn posts with AI. Choose from 6 unique writing styles:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '🧠', label: 'Thought Leader' },
            { icon: '📖', label: 'Story' },
            { icon: '📋', label: 'How-To' },
            { icon: '✨', label: 'Personal Brand' },
            { icon: '🔥', label: 'Hot Take' },
            { icon: '📊', label: 'Data Driven' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/10"
            >
              <span>{s.icon}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'LinkedIn Integration',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Seamlessly works with LinkedIn. Here is how:
        </p>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Type your topic or paste an idea' },
            { step: '2', text: 'Pick a style and tone that fits' },
            { step: '3', text: 'Generate, preview, and copy to LinkedIn' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/10"
            >
              <span className="w-6 h-6 rounded-full bg-linkedin-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{item.text}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Use the Preview tab to see exactly how your post will look on LinkedIn.
        </p>
      </div>
    ),
  },
  {
    title: 'Templates & Languages',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Jump-start your posts with ready-made templates and write in 10+ languages.
        </p>
        <div className="space-y-2">
          <div className="px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/10">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Templates</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Achievement, Lesson Learned, Industry Insight, Step-by-Step, Hot Take, Data-Backed, Career Advice, and Myth Busting
            </p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/10">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Multi-Language</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              English, Spanish, French, German, Portuguese, Italian, Hindi, Chinese, Japanese, Arabic
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
          You are all set — let us create something great!
        </p>
      </div>
    ),
  },
];

export const OnboardingTour: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      setVisible(true);
    }
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setVisible(false);
    createConfetti();
  }, []);

  const next = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <>
      {/* Confetti keyframes injected once */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={finish} />

        {/* Glassmorphism modal */}
        <div className="relative w-full max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden fade-in">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-linkedin-500 to-linkedin-600 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base">{current.title}</h2>
              <button
                onClick={finish}
                className="text-white/60 hover:text-white text-lg leading-none"
                title="Skip tour"
              >
                x
              </button>
            </div>
            {/* Step indicators */}
            <div className="flex gap-1.5 mt-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    i <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4">{current.content}</div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-200/50 dark:border-white/10 flex items-center justify-between">
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {step + 1} of {steps.length}
            </div>
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                className="px-4 py-1.5 text-xs font-bold text-white bg-linkedin-500 hover:bg-linkedin-600 rounded-lg transition-colors"
              >
                {isLast ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
