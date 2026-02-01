import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
}

/**
 * Apple-level image component with elegant blur-up placeholder
 * Smooth fade-in animation, graceful error handling
 */
const ImageWithBlur: React.FC<Props> = ({ src, alt, className = '', fallbackIcon }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Category emoji fallbacks (Apple-style: subtle, not flashy)
  const categoryIcons: Record<string, string> = {
    pizza: '🍕',
    burger: '🍔',
    sushi: '🥢',
    tacos: '🌮',
    pasta: '🍝',
    lobster: '🦞',
    ramen: '🍜',
    wings: '🍗',
    salad: '🥗',
    poke: '🍣',
    burrito: '🌯',
    steak: '🥩',
    coffee: '☕',
    donuts: '🍩',
    icecream: '🍦',
    thai: '🍛',
    dimsum: '🥟',
    bbq: '🍖',
    sandwich: '🥪',
    smoothie: '🥤',
    bagels: '🥯',
    pho: '🍲',
    friedchicken: '🍗',
    indian: '🍛',
    gyro: '🥙',
    kbbq: '🥓',
    pancakes: '🥞',
    acai: '🥣',
    oysters: '🦪',
    hotdogs: '🌭',
  };

  // Extract category from alt text or use fallback
  const getFallback = () => {
    if (fallbackIcon) return fallbackIcon;
    const category = alt.toLowerCase().split(' ')[0];
    return categoryIcons[category] || '🍽️';
  };

  return (
    <div className={`relative ${className}`}>
      {hasError ? (
        // Elegant fallback: subtle icon, not emoji (Apple doesn't use emojis prominently)
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-2xl">
          {getFallback()}
        </div>
      ) : (
        <>
          {/* Blur placeholder - Apple-style subtle background */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          {/* Image with smooth fade-in */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
            }}
            className={`w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          />
        </>
      )}
    </div>
  );
};

export default ImageWithBlur;
