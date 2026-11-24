import { useEffect, useState } from 'react';
import { getPosterUrl } from '../services/config';

interface PosterImageProps {
  posterPath: string | null;
  title: string;
  className?: string;
}

function getTitleInitials(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0) return 'FM';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function PosterImage({
  posterPath,
  title,
  className = '',
}: PosterImageProps) {
  const [hasError, setHasError] = useState(false);
  const posterUrl = getPosterUrl(posterPath);

  useEffect(() => {
    setHasError(false);
  }, [posterPath]);

  if (!posterUrl || hasError) {
    return (
      <div
        className={`w-full h-full bg-[var(--tirai)] flex flex-col items-start justify-between p-4 select-none ${className}`}
        aria-label={`Poster tidak tersedia untuk ${title}`}
      >
        <span className="font-display text-[28px] font-bold text-[var(--lampu)] leading-none">
          {getTitleInitials(title)}
        </span>
        <span className="text-[14px] font-medium text-[var(--kertas-redup)] line-clamp-3 leading-snug">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={`Poster ${title}`}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover block ${className}`}
    />
  );
}
