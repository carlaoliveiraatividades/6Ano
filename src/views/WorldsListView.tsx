import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Search, PenTool, Cpu, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { WORLDS_DATA } from '../data/worldsData';

export const WorldsListView: React.FC = () => {
  const { openWorld } = useApp();
  const { user } = useAuth();

  const iconMap: Record<string, any> = {
    'mundo-1': Shield,
    'mundo-2': Search,
    'mundo-3': PenTool,
    'mundo-4': Cpu,
    'mundo-5': Sparkles,
  };

  const bgMap: Record<string, string> = {
    'blue': 'bg-blue-600',
    'amber': 'bg-amber-500',
    'emerald': 'bg-emerald-600',
    'indigo': 'bg-indigo-600',
    'purple': 'bg-purple-600'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Currículo Nacional de TIC • 6.º Ano
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2 tracking-tight">
            Os 5 Mundos da Missão TIC
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Cada Mundo desenvolve competências essenciais de cidadania digital, pensamento computacional e inteligência artificial através do ciclo: <strong className="text-white">Aprende, Experimenta, Resolve e Cria</strong>.
          </p>
        </div>
      </div>

      {/* Worlds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WORLDS_DATA.map((w, idx) => {
          const Icon = iconMap[w.id] || Shield;
          const bg = bgMap[w.color] || 'bg-blue-600';

          // Unlock rules: Mundo 1 is always unlocked.
          // Mundo 2 is unlocked initially for demo.
          // Mundo 3+ unlocked if previous assessment >= 75%
          const isUnlocked = idx <= 1 || (idx === 2 && (user?.completedAssessments['mundo-2'] || 0) >= 75);
          const assessmentScore = user?.completedAssessments[w.id];

          return (
            <div
              key={w.id}
              className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden ${
                isUnlocked
                  ? 'bg-white border-slate-200/80 hover:shadow-lg hover:border-slate-300'
                  : 'bg-slate-50/80 border-slate-200 opacity-80'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${bg}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    isUnlocked
                      ? assessmentScore !== undefined && assessmentScore >= 75
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-slate-200 text-slate-500 border-slate-300'
                  }`}>
                    {isUnlocked
                      ? assessmentScore !== undefined && assessmentScore >= 75
                        ? '✓ Concluído'
                        : 'Desbloqueado'
                      : '🔒 Bloqueado'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mundo {w.number}
                  </span>
                  <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">
                    {w.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2">
                    {w.summary}
                  </p>
                </div>

                {/* Core Topics Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Temas Chave:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {w.sections.descobre.slice(0, 3).map((sec, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        {sec.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score badge if assessed */}
                {assessmentScore !== undefined && (
                  <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Nota na Avaliação: {assessmentScore}%</span>
                  </div>
                )}
              </div>

              {/* Enter button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {w.activitiesCount} Atividades
                </span>

                <button
                  onClick={() => {
                    if (isUnlocked) {
                      openWorld(w.id);
                    } else {
                      alert(`Conclui a avaliação do Mundo ${w.number - 1} para desbloquear este Mundo!`);
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{isUnlocked ? 'Entrar no Mundo' : 'Bloqueado'}</span>
                  {isUnlocked && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
