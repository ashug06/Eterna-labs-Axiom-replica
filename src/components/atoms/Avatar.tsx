/**
 * Avatar atom component
 * Displays token images with fallback
 */

import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
};

export const Avatar: React.FC<AvatarProps> = React.memo(
  ({ src, alt, size = 'md', className = '' }) => {
    const dimension = sizeMap[size];
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const fallbackLetter = alt.charAt(0).toUpperCase();

    return (
      <div
        onClick={(e) => e.preventDefault()}       // ⛔ block all clicks
        className={`
          relative
          rounded-full
          overflow-visible
          bg-blue-600
          flex items-center justify-center
          transition-transform duration-200      // smooth hover zoom
          ${className}
        `}
        style={{
          width: dimension,
          height: dimension,
          minWidth: dimension,
          minHeight: dimension,
        }}
      >
        {!hasError && imgSrc ? (
          <Image
            src={imgSrc}
            alt={alt}
            width={dimension}
            height={dimension}
            className="object-cover"
            onError={() => setHasError(true)}
            unoptimized={imgSrc.startsWith('http')}
          />
        ) : (
          <span
            className="text-white font-bold select-none"
            style={{ fontSize: dimension * 0.5 }}
          >
            {fallbackLetter}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
