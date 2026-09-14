import React from 'react';
import { AvatarConfig } from '../../types';
import { BG_COLOR_OPTIONS } from '../../utils/avatarUtils';

interface CustomAvatarProps {
  config: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  config,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  // Color mapping
  const skinColors: Record<AvatarConfig['skin'], string> = {
    light: '#FEE3D2',
    medium: '#F6B798',
    tan: '#D48658',
    dark: '#7A4326',
    cyber: '#67E8F9' // Cyan robotic alloy
  };

  const hairColors: Record<AvatarConfig['hairColor'], string> = {
    black: '#1E293B',
    brown: '#6B4017',
    blonde: '#FACC15',
    red: '#EF4444',
    cyan: '#06B6D4',
    purple: '#A855F7',
    green: '#22C55E',
    white: '#E2E8F0'
  };

  const outfitColors: Record<AvatarConfig['outfitColor'], string> = {
    blue: '#2563EB',
    purple: '#7C3AED',
    emerald: '#059669',
    rose: '#E11D48',
    amber: '#D97706',
    dark: '#334155'
  };

  const skinColor = skinColors[config?.skin || 'light'] || skinColors.light;
  const hairColor = hairColors[config?.hairColor || 'black'] || hairColors.black;
  const outfitColor = outfitColors[config?.outfitColor || 'blue'] || outfitColors.blue;
  const bgOpt = BG_COLOR_OPTIONS.find(b => b.id === config?.bgColor) || BG_COLOR_OPTIONS[0];

  const isCyber = config?.skin === 'cyber';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${bgOpt.gradient} shadow-md overflow-hidden shrink-0 select-none ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Ambient Glow */}
        <circle cx="50" cy="50" r="48" fill="url(#bg-gradient)" fillOpacity="0.15" />

        {/* --- 1. OUTFIT / BODY --- */}
        {config?.outfit === 'tshirt' && (
          <g>
            <path d="M 20 100 Q 24 75 35 70 L 65 70 Q 76 75 80 100 Z" fill={outfitColor} />
            <path d="M 40 70 Q 50 78 60 70 Z" fill={skinColor} />
          </g>
        )}

        {config?.outfit === 'hoodie' && (
          <g>
            <path d="M 18 100 Q 22 72 32 68 L 68 68 Q 78 72 82 100 Z" fill={outfitColor} />
            <path d="M 32 68 Q 50 82 68 68 L 64 74 Q 50 88 36 74 Z" fill="#0F172A" opacity="0.3" />
            <circle cx="45" cy="80" r="1.5" fill="#E2E8F0" />
            <circle cx="55" cy="80" r="1.5" fill="#E2E8F0" />
            <path d="M 45 80 L 45 92 M 55 80 L 55 92" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}

        {config?.outfit === 'polo' && (
          <g>
            <path d="M 20 100 Q 24 74 35 69 L 65 69 Q 76 74 80 100 Z" fill={outfitColor} />
            <polygon points="42,69 50,79 46,80 38,70" fill="#FFFFFF" opacity="0.9" />
            <polygon points="58,69 50,79 54,80 62,70" fill="#FFFFFF" opacity="0.9" />
            <line x1="50" y1="79" x2="50" y2="92" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="50" cy="84" r="1" fill="#1E293B" />
            <circle cx="50" cy="89" r="1" fill="#1E293B" />
          </g>
        )}

        {config?.outfit === 'hero' && (
          <g>
            <path d="M 18 100 Q 22 72 32 67 L 68 67 Q 78 72 82 100 Z" fill={outfitColor} />
            <polygon points="50,73 57,83 50,91 43,83" fill="#FACC15" />
            <polygon points="50,76 54,83 50,88 46,83" fill="#EF4444" />
            <path d="M 28 85 L 38 74 M 72 85 L 62 74" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* --- 2. NECK & HEAD --- */}
        <rect x="44" y="60" width="12" height="12" rx="3" fill={skinColor} />
        {isCyber && (
          <line x1="46" y1="66" x2="54" y2="66" stroke="#0891B2" strokeWidth="1.5" strokeDasharray="2 2" />
        )}

        {/* Head Base */}
        <ellipse cx="50" cy="48" rx="21" ry="24" fill={skinColor} />
        {isCyber && (
          <g opacity="0.6">
            <line x1="33" y1="42" x2="40" y2="42" stroke="#0891B2" strokeWidth="1" />
            <circle cx="33" cy="42" r="1.5" fill="#0891B2" />
            <line x1="60" y1="42" x2="67" y2="42" stroke="#0891B2" strokeWidth="1" />
            <circle cx="67" cy="42" r="1.5" fill="#0891B2" />
          </g>
        )}

        {/* Ears */}
        <circle cx="28" cy="48" r="4.5" fill={skinColor} />
        <circle cx="72" cy="48" r="4.5" fill={skinColor} />

        {/* --- 3. HAIR (BACK LAYER for long/afro) --- */}
        {config?.hair === 'long' && (
          <path d="M 26 40 Q 20 65 24 82 L 30 82 Q 28 65 31 52 Z M 74 40 Q 80 65 76 82 L 70 82 Q 72 65 69 52 Z" fill={hairColor} />
        )}
        {config?.hair === 'afro' && (
          <circle cx="50" cy="44" r="28" fill={hairColor} />
        )}
        {config?.hair === 'ponytail' && (
          <path d="M 68 40 Q 85 45 88 65 Q 82 70 76 56 Z" fill={hairColor} />
        )}

        {/* Re-render Head base if afro was placed behind */}
        {config?.hair === 'afro' && (
          <ellipse cx="50" cy="48" rx="21" ry="24" fill={skinColor} />
        )}

        {/* --- 4. FACIAL EXPRESSIONS --- */}
        {/* Eyebrows */}
        <path d="M 38 38 Q 43 36 47 38" stroke={hairColor} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 53 38 Q 57 36 62 38" stroke={hairColor} strokeWidth="2.2" strokeLinecap="round" />

        {/* Eyes & Mouth per Expression */}
        {config?.expression === 'smile' && (
          <g>
            <circle cx="42" cy="46" r="2.8" fill="#1E293B" />
            <circle cx="58" cy="46" r="2.8" fill="#1E293B" />
            <circle cx="43" cy="45" r="1" fill="#FFFFFF" />
            <circle cx="59" cy="45" r="1" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M 43 56 Q 50 63 57 56" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <circle cx="36" cy="53" r="3" fill="#F43F5E" opacity="0.25" />
            <circle cx="64" cy="53" r="3" fill="#F43F5E" opacity="0.25" />
          </g>
        )}

        {config?.expression === 'laugh' && (
          <g>
            {/* Happy Curved Eyes */}
            <path d="M 39 46 Q 42 42 46 46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 54 46 Q 58 42 61 46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Open Mouth */}
            <path d="M 42 55 Q 50 67 58 55 Z" fill="#991B1B" />
            <path d="M 45 55 Q 50 58 55 55 Z" fill="#FFFFFF" />
            <circle cx="36" cy="53" r="3.5" fill="#F43F5E" opacity="0.3" />
            <circle cx="64" cy="53" r="3.5" fill="#F43F5E" opacity="0.3" />
          </g>
        )}

        {config?.expression === 'cool' && (
          <g>
            <circle cx="42" cy="46" r="2.8" fill="#1E293B" />
            <circle cx="58" cy="46" r="2.8" fill="#1E293B" />
            {/* Cool Smirk */}
            <path d="M 44 57 Q 52 59 58 54" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {config?.expression === 'wink' && (
          <g>
            <circle cx="42" cy="46" r="2.8" fill="#1E293B" />
            <circle cx="43" cy="45" r="1" fill="#FFFFFF" />
            <path d="M 54 46 Q 58 43 62 46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 43 56 Q 50 63 57 56" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="53" r="3" fill="#F43F5E" opacity="0.25" />
          </g>
        )}

        {config?.expression === 'stars' && (
          <g>
            {/* Star eyes */}
            <path d="M 42 41 L 43.5 45 L 47 46 L 44 48.5 L 45 52 L 42 49.5 L 39 52 L 40 48.5 L 37 46 L 40.5 45 Z" fill="#EAB308" />
            <path d="M 58 41 L 59.5 45 L 63 46 L 60 48.5 L 61 52 L 58 49.5 L 55 52 L 56 48.5 L 53 46 L 56.5 45 Z" fill="#EAB308" />
            <path d="M 42 56 Q 50 65 58 56 Z" fill="#991B1B" />
            <circle cx="36" cy="53" r="3.5" fill="#F43F5E" opacity="0.3" />
            <circle cx="64" cy="53" r="3.5" fill="#F43F5E" opacity="0.3" />
          </g>
        )}

        {config?.expression === 'focused' && (
          <g>
            <circle cx="42" cy="46" r="2.8" fill="#1E293B" />
            <circle cx="58" cy="46" r="2.8" fill="#1E293B" />
            {/* Laser focus target glint */}
            <circle cx="42" cy="46" r="4.5" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <circle cx="58" cy="46" r="4.5" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <line x1="44" y1="58" x2="56" y2="58" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* Nose */}
        <path d="M 50 48 Q 52 51 49 52" stroke="#9A3412" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* --- 5. HAIR (FRONT LAYER) --- */}
        {config?.hair === 'short' && (
          <path d="M 28 42 Q 28 24 50 24 Q 72 24 72 42 Q 62 30 50 32 Q 38 30 28 42 Z" fill={hairColor} />
        )}

        {config?.hair === 'spiky' && (
          <path d="M 26 40 L 30 24 L 38 30 L 46 18 L 54 28 L 62 18 L 70 28 L 74 40 Q 64 30 50 32 Q 36 30 26 40 Z" fill={hairColor} />
        )}

        {config?.hair === 'curly' && (
          <g fill={hairColor}>
            <circle cx="34" cy="28" r="8" />
            <circle cx="45" cy="24" r="8" />
            <circle cx="56" cy="24" r="8" />
            <circle cx="66" cy="28" r="8" />
            <circle cx="28" cy="36" r="7" />
            <circle cx="72" cy="36" r="7" />
          </g>
        )}

        {config?.hair === 'long' && (
          <path d="M 28 42 Q 30 24 50 24 Q 70 24 72 42 Q 62 30 50 32 Q 38 30 28 42 Z" fill={hairColor} />
        )}

        {config?.hair === 'ponytail' && (
          <path d="M 28 40 Q 30 24 50 24 Q 70 24 72 40 Q 62 30 50 32 Q 38 30 28 40 Z" fill={hairColor} />
        )}

        {config?.hair === 'braids' && (
          <g fill={hairColor}>
            <path d="M 28 42 Q 30 24 50 24 Q 70 24 72 42 Q 62 30 50 32 Q 38 30 28 42 Z" />
            {/* Braids hanging */}
            <path d="M 30 46 L 27 75 L 33 75 L 32 46 Z M 70 46 L 73 75 L 67 75 L 68 46 Z" />
            <circle cx="30" cy="76" r="3" fill="#F43F5E" />
            <circle cx="70" cy="76" r="3" fill="#F43F5E" />
          </g>
        )}

        {config?.hair === 'shaved' && (
          <path d="M 30 42 Q 30 25 50 25 Q 70 25 70 42 Q 60 32 50 33 Q 40 32 30 42 Z" fill={hairColor} opacity="0.3" />
        )}

        {/* --- 6. GLASSES --- */}
        {config?.glasses === 'round' && (
          <g stroke="#1E293B" strokeWidth="2.2" fill="rgba(255,255,255,0.25)">
            <circle cx="42" cy="46" r="7.5" />
            <circle cx="58" cy="46" r="7.5" />
            <line x1="49.5" y1="46" x2="50.5" y2="46" />
            <line x1="28" y1="45" x2="34.5" y2="46" />
            <line x1="65.5" y1="46" x2="72" y2="45" />
          </g>
        )}

        {config?.glasses === 'modern' && (
          <g stroke="#0F172A" strokeWidth="2" fill="rgba(255,255,255,0.3)">
            <rect x="33" y="41" width="15" height="10" rx="3" />
            <rect x="52" y="41" width="15" height="10" rx="3" />
            <line x1="48" y1="45" x2="52" y2="45" strokeWidth="2.5" />
            <line x1="28" y1="43" x2="33" y2="44" />
            <line x1="67" y1="44" x2="72" y2="43" />
          </g>
        )}

        {config?.glasses === 'sunglasses' && (
          <g fill="#0F172A">
            <path d="M 33 41 L 49 41 L 47 52 L 35 52 Z" />
            <path d="M 51 41 L 67 41 L 65 52 L 53 52 Z" />
            <line x1="48" y1="43" x2="52" y2="43" stroke="#0F172A" strokeWidth="2.5" />
            {/* Reflection lines */}
            <line x1="36" y1="43" x2="42" y2="50" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
            <line x1="54" y1="43" x2="60" y2="50" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
          </g>
        )}

        {config?.glasses === 'vr' && (
          <g>
            <rect x="30" y="38" width="40" height="16" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="34" y="42" width="32" height="8" rx="3" fill="#0284C7" opacity="0.9" />
            <line x1="38" y1="46" x2="62" y2="46" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
            {/* Strap */}
            <path d="M 28 46 L 30 46 M 70 46 L 72 46" stroke="#0F172A" strokeWidth="3" />
          </g>
        )}

        {/* --- 7. HEADWEAR / ACCESSORIES --- */}
        {config?.headwear === 'cap' && (
          <g>
            {/* Cap Dome */}
            <path d="M 26 36 Q 28 18 50 18 Q 72 18 74 36 Z" fill="#EF4444" />
            {/* Visor */}
            <path d="M 24 36 Q 50 30 82 34 L 80 39 Q 50 36 24 39 Z" fill="#DC2626" />
            <circle cx="50" cy="18" r="2" fill="#B91C1C" />
          </g>
        )}

        {config?.headwear === 'beanie' && (
          <g>
            <path d="M 27 38 Q 28 16 50 16 Q 72 16 73 38 Z" fill="#6366F1" />
            <rect x="25" y="34" width="50" height="8" rx="3" fill="#4F46E5" />
            {/* Pom pom */}
            <circle cx="50" cy="14" r="5" fill="#E0E7FF" />
          </g>
        )}

        {config?.headwear === 'headphones' && (
          <g>
            {/* Band */}
            <path d="M 26 48 Q 26 14 50 14 Q 74 14 74 48" stroke="#0F172A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Earcups */}
            <rect x="22" y="38" width="8" height="20" rx="4" fill="#06B6D4" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="70" y="38" width="8" height="20" rx="4" fill="#06B6D4" stroke="#0F172A" strokeWidth="1.5" />
            {/* Glow dots */}
            <circle cx="26" cy="48" r="2" fill="#FFFFFF" />
            <circle cx="74" cy="48" r="2" fill="#FFFFFF" />
          </g>
        )}

        {config?.headwear === 'crown' && (
          <g>
            <polygon points="32,36 32,24 41,30 50,20 59,30 68,24 68,36" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="32" cy="23" r="2" fill="#EF4444" />
            <circle cx="50" cy="19" r="2.5" fill="#3B82F6" />
            <circle cx="68" cy="23" r="2" fill="#EF4444" />
            <rect x="32" y="33" width="36" height="4" rx="1" fill="#EAB308" />
          </g>
        )}

        {config?.headwear === 'wizard' && (
          <g>
            {/* Brim */}
            <ellipse cx="50" cy="36" rx="28" ry="7" fill="#7C3AED" />
            {/* Cone */}
            <path d="M 30 36 L 50 8 L 70 36 Z" fill="#6D28D9" />
            <circle cx="50" cy="8" r="2.5" fill="#FACC15" />
            {/* Stars on hat */}
            <polygon points="50,22 51.5,25 54,25.5 52,27.5 52.5,30 50,28.5 47.5,30 48,27.5 46,25.5 48.5,25" fill="#FDE047" />
          </g>
        )}
      </svg>
    </div>
  );
};
