import React from 'react';
import { Trophy, ArrowRight, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WEEKLY_CHALLENGES } from '../../data/weeklyChallenges';

export const WeeklyChallengeCard: React.FC = () => {
  const { openWeeklyChallenge, setCurrentView } = useApp();
  const currentChallenge = WEEKLY_CHALLENGES[0];

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-orange-100/40 rounded-3xl p-5 border border-amber-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Desafio da Semana
              </span>
              <h3 className="font-display font-bold text-slate-900 text-base leading-tight mt-0.5">
                {currentChallenge.title}
              </h3>
            </div>
          </div>

          {/* Floating graphic icon matching screenshot */}
          <div className="relative shrink-0 w-12 h-12 rounded-2xl bg-white shadow-xs border border-amber-200 flex items-center justify-center text-blue-500">
            <Mail className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              !
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
            +{currentChallenge.xpReward} XP
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-amber-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {currentChallenge.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-amber-200/60">
        <button
          onClick={() => openWeeklyChallenge(currentChallenge)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <span>Aceitar desafio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setCurrentView('challenges')}
          className="text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
        >
          Ver todos &rarr;
        </button>
      </div>
    </div>
  );
};
