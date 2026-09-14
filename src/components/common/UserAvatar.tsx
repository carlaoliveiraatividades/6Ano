import React from 'react';
import { AvatarConfig } from '../../types';
import { CustomAvatar } from './CustomAvatar';
import { generateDeterministicAvatar } from '../../utils/avatarUtils';

interface UserAvatarProps {
  avatarId?: string | AvatarConfig | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarId,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl'
  };

  // 1. If it's already an AvatarConfig object
  if (avatarId && typeof avatarId === 'object' && 'skin' in avatarId) {
    return <CustomAvatar config={avatarId as AvatarConfig} size={size} className={className} />;
  }

  // 2. If it's a JSON string representing an AvatarConfig
  if (typeof avatarId === 'string' && avatarId.startsWith('{') && avatarId.includes('"skin"')) {
    try {
      const parsed = JSON.parse(avatarId) as AvatarConfig;
      return <CustomAvatar config={parsed} size={size} className={className} />;
    } catch {
      // fallback
    }
  }

  // 3. Fallback to predefined demo profiles
  const profiles: Record<string, { bg: string; ring: string; emoji: string }> = {
    alex: { bg: 'from-blue-400 to-indigo-600', ring: 'ring-blue-400', emoji: '🧑‍🚀' },
    leonor: { bg: 'from-pink-400 to-rose-600', ring: 'ring-pink-400', emoji: '👧' },
    tiago: { bg: 'from-amber-400 to-orange-600', ring: 'ring-amber-400', emoji: '👦' },
    beatriz: { bg: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-400', emoji: '👩‍🔬' },
    duarte: { bg: 'from-cyan-400 to-blue-500', ring: 'ring-cyan-400', emoji: '🧑‍💻' },
    ines: { bg: 'from-purple-400 to-indigo-600', ring: 'ring-purple-400', emoji: '👩‍🎨' },
    miguel: { bg: 'from-orange-400 to-red-500', ring: 'ring-orange-400', emoji: '🧑‍🎤' },
    sofia: { bg: 'from-teal-400 to-emerald-600', ring: 'ring-teal-400', emoji: '👧' },
    'teacher-helena': { bg: 'from-indigo-500 to-purple-700', ring: 'ring-indigo-400', emoji: '👩‍🏫' }
  };

  const strId = typeof avatarId === 'string' ? avatarId : 'alex';

  if (profiles[strId]) {
    const profile = profiles[strId];
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${profile.bg} text-white font-bold shadow-md ring-2 ${profile.ring} ring-offset-2 ring-offset-white select-none overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <span className="transform transition-transform hover:scale-110">
          {profile.emoji}
        </span>
      </div>
    );
  }

  // 4. If arbitrary string (e.g. nickname like Panda_Feliz_701), render deterministic custom avatar
  const deterministicConfig = generateDeterministicAvatar(strId);
  return <CustomAvatar config={deterministicConfig} size={size} className={className} />;
};
