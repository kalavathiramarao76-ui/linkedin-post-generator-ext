import React, { useState } from 'react';

interface Props {
  content: string;
  authorName?: string;
  authorTitle?: string;
}

export const LinkedInPreview: React.FC<Props> = ({
  content,
  authorName = 'Your Name',
  authorTitle = 'Your Title | Company',
}) => {
  const [expanded, setExpanded] = useState(false);
  const truncated = content.length > 300 && !expanded;
  const displayContent = truncated ? content.slice(0, 300) + '...' : content;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-linkedin-500 to-linkedin-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{authorName}</p>
          <p className="text-xs text-gray-500 truncate">{authorTitle}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            Just now &middot; <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/><circle cx="4" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="12" cy="8" r="1"/></svg>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {displayContent}
        </div>
        {truncated && (
          <button
            onClick={() => setExpanded(true)}
            className="text-gray-500 hover:text-linkedin-500 text-sm font-medium mt-1"
          >
            ...see more
          </button>
        )}
      </div>

      {/* Engagement bar */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="inline-flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[8px] text-white">+</span>
            <span className="w-4 h-4 rounded-full bg-red-400 border border-white flex items-center justify-center text-[8px] text-white">&hearts;</span>
            <span className="w-4 h-4 rounded-full bg-green-500 border border-white flex items-center justify-center text-[8px] text-white">!</span>
          </span>
          <span className="ml-1">42 reactions</span>
          <span className="ml-auto">8 comments</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-2 py-1 border-t border-gray-100 flex justify-around">
        {[
          { icon: '👍', label: 'Like' },
          { icon: '💬', label: 'Comment' },
          { icon: '🔄', label: 'Repost' },
          { icon: '📤', label: 'Send' },
        ].map(action => (
          <button
            key={action.label}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-xs text-gray-500 font-medium transition-colors"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
