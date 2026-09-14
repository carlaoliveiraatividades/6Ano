import React from 'react';

interface UserAvatarProps {
  avatarId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarId, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl'
  };

  // Specific visual profiles for students & teacher matching friendly 3D cartoon style
  const profiles: Record<string, { bg: string; ring: string; emoji: string; initial: string; badgeColor: string }> = {
    alex: { bg: 'from-blue-400 to-indigo-600', ring: 'ring-blue-400', emoji: '🧑‍🚀', initial: 'A', badgeColor: 'bg-blue-600' },
    leonor: { bg: 'from-pink-400 to-rose-600', ring: 'ring-pink-400', emoji: '👧', initial: 'L', badgeColor: 'bg-pink-600' },
    tiago: { bg: 'from-amber-400 to-orange-600', ring: 'ring-amber-400', emoji: '👦', initial: 'T', badgeColor: 'bg-amber-600' },
    beatriz: { bg: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-400', emoji: '👩‍🔬', initial: 'B', badgeColor: 'bg-emerald-600' },
    duarte: { bg: 'from-cyan-400 to-blue-500', ring: 'ring-cyan-400', emoji: '🧑‍💻', initial: 'D', badgeColor: 'bg-cyan-600' },
    ines: { bg: 'from-purple-400 to-indigo-600', ring: 'ring-purple-400', emoji: '👩‍🎨', initial: 'I', badgeColor: 'bg-purple-600' },
    miguel: { bg: 'from-orange-400 to-red-500', ring: 'ring-orange-400', emoji: '🧑‍🎤', initial: 'M', badgeColor: 'bg-orange-600' },
    sofia: { bg: 'from-teal-400 to-emerald-600', ring: 'ring-teal-400', emoji: '👧', initial: 'S', badgeColor: 'bg-teal-600' },
    'teacher-helena': { bg: 'from-indigo-500 to-purple-700', ring: 'ring-indigo-400', emoji: '👩‍🏫', initial: 'H', badgeColor: 'bg-indigo-700' }
  };

  const profile = profiles[avatarId] || profiles.alex;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${profile.bg} text-white font-bold shadow-md ring-2 ${profile.ring} ring-offset-2 ring-offset-white select-none overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span className="transform transition-transform hover:scale-110">
        {profile.emoji}
      </span>
    </div>
  );
};
