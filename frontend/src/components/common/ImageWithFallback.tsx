import { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

const ImageWithFallback = ({ src, fallbackSrc, alt, className = '' }: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
