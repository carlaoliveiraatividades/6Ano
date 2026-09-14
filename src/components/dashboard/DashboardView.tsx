import React from 'react';
import { WeeklyChallengeCard } from './WeeklyChallengeCard';
import { QuickTipCard } from './QuickTipCard';
import { QuoteOfTheDayCard } from './QuoteOfTheDayCard';
import { WorldsMapBanner } from './WorldsMapBanner';
import { AchievementsPreview } from './AchievementsPreview';
import { NextMissionCard } from './NextMissionCard';
import { ClassRankingCard } from './ClassRankingCard';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
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
