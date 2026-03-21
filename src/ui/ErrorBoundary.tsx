import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PostCraft AI] Uncaught error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-gray-900">
          <div className="w-full max-w-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 fade-in">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Something went wrong</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PostCraft AI encountered an unexpected error.
              </p>
            </div>

            {/* Error details */}
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3">
                <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all leading-relaxed">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Retry */}
            <button
              onClick={this.handleRetry}
              className="w-full bg-linkedin-500 hover:bg-linkedin-600 text-white font-semibold py-2.5 px-5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>

            <p className="text-center text-[10px] text-gray-400 dark:text-gray-500">
              If this keeps happening, try clearing extension data in Settings.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
