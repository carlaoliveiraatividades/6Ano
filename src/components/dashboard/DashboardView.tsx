import React from 'react';
import { WeeklyChallengeCard } from './WeeklyChallengeCard';
import { QuickTipCard } from './QuickTipCard';
import { QuoteOfTheDayCard } from './QuoteOfTheDayCard';
import { WorldsMapBanner } from './WorldsMapBanner';
import { AchievementsPreview } from './AchievementsPreview';
import { NextMissionCard } from './NextMissionCard';
import { ClassRankingCard } from './ClassRankingCard';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Compass, UserPlus } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { openAuthModal } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Unauthenticated exploration banner */}
      {!user && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <Compass className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  Exploração Aberta
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  5 Mundos Curriculares
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Experimenta simuladores, jogos e missões digitais. Para gravares as tuas conquistas, XP e medalhas no Firestore, cria uma conta de aluno ou inicia sessão!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta de Aluno</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Top row: 3 cards side-by-side matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <WeeklyChallengeCard />
        <QuickTipCard />
        <QuoteOfTheDayCard />
      </div>

      {/* 2. Middle broad section: Os 5 Mundos da Missão TIC map */}
      <WorldsMapBanner />

      {/* 3. Bottom row: 3 cards side-by-side matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AchievementsPreview />
        <NextMissionCard />
        <ClassRankingCard />
      </div>
    </div>
  );
};
