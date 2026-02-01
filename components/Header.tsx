import React from 'react';

/**
 * Apple-level header: Clean, minimal, purposeful
 * Removed status text for clarity
 */
const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-50 backdrop-blur-xl bg-white/95">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-dd-orange rounded-xl flex items-center justify-center text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-tight leading-none text-gray-900" style={{ letterSpacing: '-0.01em' }}>
          MunchMatch
        </h1>
      </div>
    </header>
  );
};

export default Header;
