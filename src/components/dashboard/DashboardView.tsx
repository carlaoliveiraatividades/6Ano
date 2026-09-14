import React from 'react';
import { WeeklyChallengeCard } from './WeeklyChallengeCard';
import { QuickTipCard } from './QuickTipCard';
import { QuoteOfTheDayCard } from './QuoteOfTheDayCard';
import { WorldsMapBanner } from './WorldsMapBanner';
import { AchievementsPreview } from './AchievementsPreview';
import { NextMissionCard } from './NextMissionCard';
import { ClassRankingCard } from './ClassRankingCard';
import { useAuth } from '../../context/AuthContext';
import { Compass, UserPlus, LogOut } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { role, logout } = useAuth();

  return (
    <div className="space-y-6 pb-12">
      {/* Visitor Mode Information Banner */}
      {role === 'visitor' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-indigo-500/15 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700 shrink-0">
              <Compass className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                  Modo Visitante Ativo
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Todos os 5 Mundos Desbloqueados
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Estás a explorar a plataforma livremente. Podes testar simuladores, ver atividades e resolver desafios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Criar Conta / Iniciar Sessão</span>
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
