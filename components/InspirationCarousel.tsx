import React, { memo } from 'react';
import { INSPIRATION_CATEGORIES } from '../constants';
import ImageWithBlur from './ImageWithBlur';

interface Props {
  onSelect: (pref: string) => void;
}

/**
 * Apple-level landing page: Minimal, elegant, purposeful
 * Massive white space, clear hierarchy, subtle animations
 * Orange accent maintained for brand consistency
 */
const InspirationCarousel: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="pt-24 pb-16 px-6">
      {/* Hero headline - Apple-style: Large, bold, generous spacing */}
      <h2 
        className="text-5xl sm:text-6xl md:text-7xl font-bold text-center text-gray-900 mb-6 leading-tight"
        style={{ 
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          animation: 'fadeInUp 0.8s ease-out 0.1s both'
        }}
      >
        You set the price.<br />
        Restaurants compete.<br />
        <span className="text-dd-orange">You win.</span>
      </h2>
      
      {/* Subtle subheadline - Apple-style: Lighter, more space */}
      <p 
        className="text-lg text-center text-gray-600 mb-16 font-normal"
        style={{ 
          letterSpacing: '0',
          lineHeight: '1.5',
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}
      >
        Set your max price. Restaurants bid to win your order.<br />
        Save 15-30% vs DoorDash.
      </p>
      
      {/* Category grid - Apple-style: Large cards, generous spacing, subtle shadows */}
      <div 
        className="grid grid-cols-3 sm:grid-cols-4 gap-8 mb-20"
        style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}
      >
        {/* Custom Order - Apple-style: Minimal, elegant */}
        <button
          onClick={() => onSelect('')}
          className="group flex flex-col items-center gap-4 transition-all duration-200 ease-in-out active:scale-[0.98]"
          style={{ animation: 'staggerFadeIn 0.5s ease-out 0.4s both' }}
        >
          <div className="w-28 h-28 rounded-full bg-dd-orange flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
          </div>
          <span 
            className="text-xs font-medium text-gray-700 text-center uppercase tracking-wider"
            style={{ letterSpacing: '0.05em' }}
          >
            Custom<br />Order
          </span>
        </button>

        {/* Category cards with stagger animation */}
        {INSPIRATION_CATEGORIES.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.pref)}
            className="group flex flex-col items-center gap-4 transition-all duration-200 ease-in-out active:scale-[0.98]"
            style={{ 
              animation: `staggerFadeIn 0.5s ease-out ${0.4 + index * 0.05}s both`
            }}
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              <ImageWithBlur
                src={cat.img.includes('?') ? `${cat.img}&w=400&h=400&fit=crop&q=90` : `${cat.img}?w=400&h=400&fit=crop&q=90`}
                alt={cat.title}
                className="w-full h-full"
              />
            </div>
            <span 
              className="text-xs font-medium text-gray-700 text-center uppercase tracking-wider"
              style={{ letterSpacing: '0.05em' }}
            >
              {cat.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders (Apple-level performance)
export default memo(InspirationCarousel);
