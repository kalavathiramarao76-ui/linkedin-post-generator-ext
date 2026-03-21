import React, { useState, useEffect, useCallback } from 'react';
import { toggleFavorite, isFavorited, type FavoriteItem } from '@/shared/favorites';

interface FavoriteButtonProps {
  type: FavoriteItem['type'];
  content: string;
  topic?: string;
  onToggle?: (favorites: FavoriteItem[], isFav: boolean) => void;
  size?: 'sm' | 'md';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  type,
  content,
  topic,
  onToggle,
  size = 'md',
}) => {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!content) return;
    isFavorited(type, content).then(setFavorited);
  }, [type, content]);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!content) return;

      setAnimating(true);
      const { favorites, isFavorited: isFav } = await toggleFavorite(type, content, topic);
      setFavorited(isFav);
      onToggle?.(favorites, isFav);

      setTimeout(() => setAnimating(false), 400);
    },
    [type, content, topic, onToggle]
  );

  const sizeClass = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center rounded-full transition-all duration-200
        hover:scale-110 active:scale-95 focus:outline-none
        ${favorited ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 dark:text-gray-500 hover:text-amber-300'}
        ${animating ? 'favorite-bounce' : ''}
      `}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={sizeClass}
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
};
