import React from 'react';
import { LINKEDIN_CHAR_LIMIT, CHAR_WARNING_THRESHOLD, CHAR_DANGER_THRESHOLD } from '@/shared/constants';

interface Props {
  count: number;
}

export const CharacterCounter: React.FC<Props> = ({ count }) => {
  const percentage = (count / LINKEDIN_CHAR_LIMIT) * 100;
  const color =
    count >= CHAR_DANGER_THRESHOLD
      ? 'text-red-500'
      : count >= CHAR_WARNING_THRESHOLD
        ? 'text-yellow-500'
        : 'text-green-500';
  const barColor =
    count >= CHAR_DANGER_THRESHOLD
      ? 'bg-red-500'
      : count >= CHAR_WARNING_THRESHOLD
        ? 'bg-yellow-500'
        : 'bg-green-500';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${color} tabular-nums min-w-[65px] text-right`}>
        {count} / {LINKEDIN_CHAR_LIMIT}
      </span>
    </div>
  );
};
