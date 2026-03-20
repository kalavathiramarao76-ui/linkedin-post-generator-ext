import React from 'react';
import { POST_STYLES } from '@/shared/constants';

interface Props {
  value: string;
  onChange: (id: string) => void;
  compact?: boolean;
}

export const StyleSelector: React.FC<Props> = ({ value, onChange, compact }) => {
  return (
    <div className={`grid ${compact ? 'grid-cols-3 gap-1.5' : 'grid-cols-2 gap-2'}`}>
      {POST_STYLES.map(style => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}
          className={`style-chip ${value === style.id ? 'style-chip-active' : 'style-chip-inactive'} ${compact ? 'text-xs py-1.5 px-2' : ''}`}
          title={style.description}
        >
          <span className="mr-1">{style.icon}</span>
          {compact ? style.label.split(' ')[0] : style.label}
        </button>
      ))}
    </div>
  );
};
