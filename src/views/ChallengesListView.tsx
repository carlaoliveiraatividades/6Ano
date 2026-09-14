import React from 'react';
import { Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { WEEKLY_CHALLENGES } from '../data/weeklyChallenges';

export const ChallengesListView: React.FC = () => {
  const { openWeeklyChallenge } = useApp();
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
          Desafios &amp; Missões Rápidas
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
          Desafios Semanais
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
          Resolve cenários reais todas as semanas para ganhares XP adicional e manteres os teus reflexos de cidadania digital afiados.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {WEEKLY_CHALLENGES.map((ch) => {
          const isDone = user?.claimedWeeklyChallenges.includes(ch.id);

          return (
            <div
              key={ch.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    {ch.category}
                  </span>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    +{ch.xpReward} XP
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug">
                  {ch.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ch.scenario}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Dificuldade: <strong className="text-slate-800">{ch.difficulty}</strong>
                </span>

                <button
                  onClick={() => openWeeklyChallenge(ch)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Concluído</span>
                    </>
                  ) : (
                    <>
                      <span>Aceitar Desafio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
