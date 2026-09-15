import React from 'react';
import { ArrowRight, Lock, Shield, Search, MessageSquare, Terminal, BrainCircuit, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const WorldsMapBanner: React.FC = () => {
  const { openWorld, setCurrentView } = useApp();
  const { user } = useAuth();

  // Determine unlock status
  // Mundo 1 is always unlocked.
  // Mundo 2 is unlocked if Mundo 1 assessment >= 75% or demo initial (in demo Alex has Mundo 2 unlocked)
  const isWorld1Complete = (user?.completedAssessments?.['mundo-1'] || 0) >= 75 || true; // In screenshot Mundo 1 is in progress (60%) and Mundo 2 is Desbloqueado (20%)
  const isWorld2Unlocked = true; // In screenshot Mundo 2 is Desbloqueado
  const isWorld3Unlocked = (user?.completedAssessments?.['mundo-2'] || 0) >= 75;
  const isWorld4Unlocked = isWorld3Unlocked && (user?.completedAssessments?.['mundo-3'] || 0) >= 75;
  const isWorld5Unlocked = isWorld4Unlocked && (user?.completedAssessments?.['mundo-4'] || 0) >= 75;
  const isGrandMissionUnlocked = isWorld5Unlocked && (user?.completedAssessments?.['mundo-5'] || 0) >= 75;

  const worldsList = [
    {
      id: 'mundo-1',
      number: 1,
      name: 'Guardião Digital',
      icon: Shield,
      unlocked: true,
      progress: 60,
      status: 'Em progresso',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconBg: 'bg-blue-600',
      themeColor: 'blue'
    },
    {
      id: 'mundo-2',
      number: 2,
      name: 'Detetive Digital',
      icon: Search,
      unlocked: isWorld2Unlocked,
      progress: 20,
      status: isWorld2Unlocked ? 'Desbloqueado' : 'Bloqueado',
      statusColor: isWorld2Unlocked ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200',
      iconBg: 'bg-amber-500',
      themeColor: 'amber'
    },
    {
      id: 'mundo-3',
      number: 3,
      name: 'Criador Digital',
      icon: MessageSquare,
      unlocked: isWorld3Unlocked,
      progress: isWorld3Unlocked ? 10 : 0,
      status: isWorld3Unlocked ? 'Desbloqueado' : 'Bloqueado',
      statusColor: isWorld3Unlocked ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200',
      iconBg: 'bg-emerald-600',
      themeColor: 'emerald'
    },
    {
      id: 'mundo-4',
      number: 4,
      name: 'Engenheiro Digital',
      icon: Terminal,
      unlocked: isWorld4Unlocked,
      progress: isWorld4Unlocked ? 10 : 0,
      status: isWorld4Unlocked ? 'Desbloqueado' : 'Bloqueado',
      statusColor: isWorld4Unlocked ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200',
      iconBg: 'bg-indigo-600',
      themeColor: 'indigo'
    },
    {
      id: 'mundo-5',
      number: 5,
      name: 'Explorador da IA',
      icon: BrainCircuit,
      unlocked: isWorld5Unlocked,
      progress: isWorld5Unlocked ? 10 : 0,
      status: isWorld5Unlocked ? 'Desbloqueado' : 'Bloqueado',
      statusColor: isWorld5Unlocked ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200',
      iconBg: 'bg-purple-600',
      themeColor: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
      {/* Header of Section matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-display font-extrabold text-slate-900 text-xl tracking-tight">
            Os 5 Mundos da Missão TIC
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Explora, completa missões e torna-te um Mestre da Missão TIC!
          </p>
        </div>

        <button
          onClick={() => setCurrentView('worlds')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Ver o meu progresso</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* World Map Container with Sky/Clouds/Pathways */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-100/70 via-blue-50/40 to-slate-50 border border-sky-100 p-6 overflow-x-auto">
        {/* Decorative background clouds & birds */}
        <div className="absolute top-3 left-10 text-sky-300/60 font-mono text-xs select-none">☁️</div>
        <div className="absolute top-6 right-24 text-sky-300/60 font-mono text-xs select-none">☁️</div>
        <div className="absolute top-4 left-1/2 text-slate-400/40 text-[10px] select-none">~ ~ (pássaros no céu)</div>

        <div className="flex items-center justify-between gap-4 min-w-[760px] py-4 relative">
          {/* Connecting dotted trajectory pathway */}
          <div className="absolute top-16 left-12 right-28 h-0.5 border-t-2 border-dashed border-blue-300 -z-0 pointer-events-none" />

          {/* 5 Worlds Islands */}
          {worldsList.map((world, idx) => {
            const Icon = world.icon;

            return (
              <div
                key={world.id}
                className="flex flex-col items-center text-center relative z-10 w-28 group"
              >
                {/* Floating Island Icon & Emblem */}
                <button
                  onClick={() => {
                    if (world.unlocked) {
                      openWorld(world.id);
                    } else {
                      alert(`🔒 Este Mundo está bloqueado! Conclui o Mundo ${world.number - 1} com aprovação na avaliação final para desbloquear.`);
                    }
                  }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer relative ${
                    world.unlocked
                      ? `${world.iconBg} text-white shadow-blue-500/20 ring-4 ring-white`
                      : 'bg-slate-200 text-slate-400 shadow-slate-300/40 ring-4 ring-slate-100 cursor-not-allowed'
                  }`}
                  title={world.unlocked ? `Entrar no Mundo ${world.number}` : 'Mundo bloqueado'}
                >
                  <Icon className="w-8 h-8" />
                  {!world.unlocked && (
                    <div className="absolute -top-1 -right-1 bg-slate-600 text-white rounded-full p-1 shadow-xs">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </button>

                {/* Island Labels */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mundo {world.number}
                  </span>
                  <h4 className="font-display font-bold text-xs text-slate-800 leading-tight mt-0.5">
                    {world.name}
                  </h4>
                </div>

                {/* Progress Mini Bar (for active/unlocked) */}
                {world.unlocked && (
                  <div className="w-20 bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${world.progress}%` }}
                    />
                  </div>
                )}

                {/* Status Pill Button matching screenshot */}
                <div className="mt-2">
                  <button
                    onClick={() => {
                      if (world.unlocked) {
                        openWorld(world.id);
                      }
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs transition-all flex items-center gap-1 ${world.statusColor}`}
                  >
                    {!world.unlocked && <Lock className="w-2.5 h-2.5" />}
                    <span>{world.status}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Epic 6th element: Mountain with Grande Missão Final */}
          <div className="flex flex-col items-center text-center relative z-10 w-36 group">
            <button
              onClick={() => setCurrentView('grand-mission')}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer relative ${
                isGrandMissionUnlocked
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30 ring-4 ring-amber-100 animate-bounce'
                  : 'bg-gradient-to-tr from-slate-700 to-slate-900 text-amber-300 shadow-slate-700/30 ring-4 ring-white'
              }`}
              title="Grande Missão Final: A Escola do Futuro"
            >
              <Trophy className="w-8 h-8 text-amber-300" />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 font-bold text-[9px] shadow-xs">
                ★
              </div>
            </button>

            <div className="mt-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Grande Missão Final
              </span>
              <h4 className="font-display font-extrabold text-[11px] text-slate-900 leading-tight mt-0.5">
                A ESCOLA DO FUTURO
              </h4>
            </div>

            <div className="mt-2">
              <button
                onClick={() => setCurrentView('grand-mission')}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-slate-900 text-amber-300 border-slate-700 shadow-2xs flex items-center gap-1 cursor-pointer hover:bg-slate-800"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Explorar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
