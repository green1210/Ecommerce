import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  effect = 'blur',
  onLoad
}) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`bg-neutral-200 flex items-center justify-center ${className}`}>
        <span className="text-neutral-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      placeholderSrc={placeholderSrc}
      effect={effect}
      onError={handleError}
      onLoad={onLoad}
      loading="lazy"
    />
  );
};

export default LazyImage;