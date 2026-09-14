import React from 'react';
import { ArrowRight, Shield, Search, PenTool, Cpu, Sparkles, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const AchievementsPreview: React.FC = () => {
  const { setCurrentView } = useApp();
  const { user } = useAuth();

  const badges = [
    { id: 'badge-guardiao', name: 'Guardião Digital', icon: Shield, unlocked: user?.badges.includes('badge-guardiao') ?? true },
    { id: 'badge-detetive', name: 'Detetive Digital', icon: Search, unlocked: user?.badges.includes('badge-detetive') ?? false },
    { id: 'badge-criador', name: 'Criador Digital', icon: PenTool, unlocked: user?.badges.includes('badge-criador') ?? false },
    { id: 'badge-engenheiro', name: 'Engenheiro Digital', icon: Cpu, unlocked: user?.badges.includes('badge-engenheiro') ?? false },
    { id: 'badge-ia', name: 'Explorador da IA', icon: Sparkles, unlocked: user?.badges.includes('badge-ia') ?? false }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-slate-900 text-sm">
          As minhas conquistas
        </h3>
        <button
          onClick={() => setCurrentView('achievements')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 badges in row matching image */}
      <div className="grid grid-cols-5 gap-2 py-2">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.id} className="flex flex-col items-center text-center group">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  b.unlocked
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-200 group-hover:scale-105'
                    : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                }`}
                title={b.name}
              >
                {b.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 leading-tight mt-2 line-clamp-2">
                {b.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
