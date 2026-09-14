import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Compass emblem matching image */}
      <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 shadow-md shadow-blue-500/25 p-2 text-white shrink-0 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full transform transition-transform group-hover:rotate-45 duration-500"
        >
          <circle cx="12" cy="12" r="10" strokeDasharray="2 2" strokeOpacity="0.6" />
          <polygon
            points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9"
            fill="white"
            fillOpacity="0.9"
            stroke="none"
          />
          <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display font-black tracking-tight text-xl text-slate-900 drop-shadow-sm">
            MISSÃO
          </span>
          <span className="font-display font-black tracking-tight text-xl text-blue-600">
            TIC
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-wider mt-0.5 whitespace-nowrap">
          Aprende. Experimenta. Resolve. Cria.
        </span>
      </div>
    </div>
  );
};
