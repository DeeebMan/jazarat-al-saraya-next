'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fill,
  className,
  priority,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src || PLACEHOLDER_IMAGE);
  }, [src]);

  const isDataUrl = imgSrc.startsWith('data:');
  const isLocalArabic = imgSrc.startsWith('/images/');

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 skeleton rounded-xl z-10" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        className={className}
        priority={priority}
        sizes={fill ? "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" : undefined}
        unoptimized={isDataUrl || isLocalArabic}
        onError={() => {
          if (imgSrc !== PLACEHOLDER_IMAGE) {
            setImgSrc(PLACEHOLDER_IMAGE);
          }
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </>
  );
}
