import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Props {
  error: string;
  onRetry: () => void;
  autoRetryDelay?: number; // ms, default 10000
}

export const ApiErrorFallback: React.FC<Props> = ({ error, onRetry, autoRetryDelay = 10000 }) => {
  const [progress, setProgress] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (cancelled) return;

    const step = 50; // update every 50ms
    const totalSteps = autoRetryDelay / step;
    let current = 0;

    intervalRef.current = setInterval(() => {
      current++;
      setProgress(Math.min((current / totalSteps) * 100, 100));
    }, step);

    timeoutRef.current = setTimeout(() => {
      cleanup();
      onRetry();
    }, autoRetryDelay);

    return cleanup;
  }, [autoRetryDelay, onRetry, cancelled, cleanup]);

  const handleCancel = () => {
    setCancelled(true);
    cleanup();
    setProgress(0);
  };

  const handleRetryNow = () => {
    cleanup();
    onRetry();
  };

  const secondsLeft = cancelled ? 0 : Math.max(0, Math.ceil((autoRetryDelay * (1 - progress / 100)) / 1000));

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-red-200/50 dark:border-red-800/30 rounded-2xl shadow-lg p-4 space-y-3 fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Generation Failed</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-all">{error}</p>
        </div>
      </div>

      {/* Progress bar — auto retry */}
      {!cancelled && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Auto-retrying in {secondsLeft}s...
            </p>
            <button
              onClick={handleCancel}
              className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-linkedin-400 to-linkedin-600 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleRetryNow}
          className="flex-1 bg-linkedin-500 hover:bg-linkedin-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry Now
        </button>
        {cancelled && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-full transition-all text-xs"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
