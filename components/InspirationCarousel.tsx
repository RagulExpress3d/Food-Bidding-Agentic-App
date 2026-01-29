
import React from 'react';
import { INSPIRATION_CATEGORIES } from '../constants';

interface Props {
  onSelect: (pref: string) => void;
}

const InspirationCarousel: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pt-8">
      {/* Heading removed as requested */}
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-10 gap-x-4 mb-20">
        {/* Custom Order Bubble */}
        <button
          onClick={() => onSelect('')}
          className="group flex flex-col items-center gap-3 transition-transform active:scale-90"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-dd-orange border-4 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-dd-orange/10 group-hover:ring-dd-orange/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-dd-orange text-center leading-tight">Custom<br/>Order</span>
        </button>

        {INSPIRATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.pref)}
            className="group flex flex-col items-center gap-3 transition-transform active:scale-90"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-black/5 group-hover:ring-dd-orange/50 transition-all">
              <img 
                src={cat.img} 
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dd-orange/0 group-hover:bg-dd-orange/20 transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-dd-dark text-center leading-tight">
              {cat.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InspirationCarousel;
