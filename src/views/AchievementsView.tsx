import React from 'react';
import { Award, CheckCircle2, Lock, Shield, Search, PenTool, Cpu, Sparkles, Trophy, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BADGES, LEVELS } from '../data/initialData';

export const AchievementsView: React.FC = () => {
  const { user } = useAuth();

  const iconMap: Record<string, any> = {
    'badge-guardiao': Shield,
    'badge-detetive': Search,
    'badge-criador': PenTool,
    'badge-engenheiro': Cpu,
    'badge-ia': Sparkles,
    'badge-mestre-tic': Trophy,
    'badge-password-master': Award,
    'badge-fact-checker': Search,
    'badge-coder-pro': Cpu,
    'badge-netiqueta-gold': Star,
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
          Gamificação &amp; Conquistas
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
          As Minhas Conquistas &amp; Níveis
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
          Coleciona distintivos especiais ao completares simuladores, avaliações e missões nos 5 Mundos de TIC.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-900">
            Galeria de Distintivos ({user?.badges?.length || 0} de {BADGES.length} desbloqueados)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada distintivo atesta o domínio de competências digitais curriculares.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b) => {
            const isUnlocked = Boolean(user?.badges?.includes(b.id));
            const Icon = iconMap[b.id] || Award;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-white to-sky-50/50 border-sky-200 shadow-xs ring-1 ring-sky-100'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-tight">
                      {b.name}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.description}
                  </p>

                  <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {b.rarity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Levels Progression Track */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-900">
            Escalada dos Níveis de Mestria TIC
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acumula pontos de experiência (XP) através de atividades para subires de patente.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LEVELS.map((lvl) => {
            const isPassed = (user?.level || 1) >= lvl.level;
            const isCurrent = user?.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                    : isPassed
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <span className="w-8 h-8 rounded-xl mx-auto flex items-center justify-center font-bold text-xs mb-2 bg-white border border-slate-200 text-slate-800">
                  {lvl.level}
                </span>
                <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                  {lvl.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">
                  {lvl.minXp} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
