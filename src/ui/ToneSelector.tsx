import React from 'react';
import { TONES } from '@/shared/constants';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export const ToneSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TONES.map(tone => (
        <button
          key={tone.id}
          onClick={() => onChange(tone.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            value === tone.id
              ? 'bg-linkedin-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tone.icon} {tone.label}
        </button>
      ))}
    </div>
  );
};
