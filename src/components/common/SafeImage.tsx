import React from 'react';
import { IMAGE_PLACEHOLDER, useImageFallback } from './imageFallback';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Rendered instead of the image when `src` is empty or fails to load. */
  fallbackSrc?: string;
}

/** `<img>` with a graceful fallback for missing or broken sources. */
const SafeImage: React.FC<SafeImageProps> = ({ src, alt = '', fallbackSrc = IMAGE_PLACEHOLDER, ...rest }) => {
  const { resolvedSrc, onError } = useImageFallback(src, fallbackSrc);
  return <img {...rest} src={resolvedSrc} alt={alt} onError={onError} />;
};

export default SafeImage;
