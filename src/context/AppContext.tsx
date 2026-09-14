import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { Badge, DailyTip, DailyQuote, WeeklyChallenge } from '../types';
import { BADGES } from '../data/initialData';
import { DAILY_TIPS, DAILY_QUOTES } from '../data/dailyContent';
import { WEEKLY_CHALLENGES } from '../data/weeklyChallenges';

export type MainView = 'dashboard' | 'worlds' | 'world-detail' | 'challenges' | 'achievements' | 'profile' | 'teacher' | 'grand-mission' | 'ranking';

interface ToastInfo {
  id: string;
  type: 'xp' | 'badge' | 'success' | 'info';
  title: string;
  message: string;
  xpAmount?: number;
}

export interface AssessmentResult {
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  questionFeedback: { questionIdx: number; correct: boolean; correctAnswer: string; explanation: string }[];
  awardedBadge: string | null;
  newlyUnlockedWorld: string | null;
}

interface AppContextType {
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  selectedWorldId: string | null;
  openWorld: (worldId: string, initialTab?: 'aprende' | 'experimenta' | 'resolve' | 'cria') => void;
  activeWorldTab: 'aprende' | 'experimenta' | 'resolve' | 'cria';
  setActiveWorldTab: (tab: 'aprende' | 'experimenta' | 'resolve' | 'cria') => void;
  
  // Modals
  activeWeeklyChallenge: WeeklyChallenge | null;
  openWeeklyChallenge: (challenge?: WeeklyChallenge) => void;
  closeWeeklyChallenge: () => void;
  
  activeTip: DailyTip | null;
  openDailyTip: (tip?: DailyTip) => void;
  closeDailyTip: () => void;
  
  activeQuote: DailyQuote | null;
  openDailyQuote: (quote?: DailyQuote) => void;
  closeDailyQuote: () => void;
  
  unlockedBadgeModal: Badge | null;
  closeBadgeModal: () => void;
  
  // Server-Authoritative Gamification Actions
  awardXp: (amount: number, reason: string) => Promise<void>;
  awardBadge: (badgeId: string, reason?: string) => void;
  completeActivity: (activityId: string, xp?: number) => Promise<void>;
  completeSimulator: (simId: string, xp?: number) => Promise<void>;
  completeMission: (worldId: string, submissionText: string, evidenceUrl?: string) => Promise<void>;
  submitAssessment: (worldId: string, answers: Record<number, string>) => Promise<AssessmentResult | null>;
  claimWeeklyChallenge: (challengeId: string, selectedOption: string) => Promise<boolean>;
  
  // Notifications
  toasts: ToastInfo[];
  removeToast: (id: string) => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProgress, refreshUser } = useAuth();
  const [currentView, setCurrentView] = useState<MainView>('dashboard');
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>('mundo-1');
  const [activeWorldTab, setActiveWorldTab] = useState<'aprende' | 'experimenta' | 'resolve' | 'cria'>('aprende');

  // Modals state
  const [activeWeeklyChallenge, setActiveWeeklyChallenge] = useState<WeeklyChallenge | null>(null);
  const [activeTip, setActiveTip] = useState<DailyTip | null>(null);
  const [activeQuote, setActiveQuote] = useState<DailyQuote | null>(null);
  const [unlockedBadgeModal, setUnlockedBadgeModal] = useState<Badge | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const addToast = (type: ToastInfo['type'], title: string, message: string, xpAmount?: number) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev.slice(-3), { id, type, title, message, xpAmount }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Client display helper for badge unlock modal
  const checkAndShowBadgeModal = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      setUnlockedBadgeModal(badge);
      triggerCelebration();
    }
  };

  const awardBadge = (badgeId: string, reason?: string) => {
    if (!user) return;
    if (!user.badges.includes(badgeId)) {
      updateUserProgress(prev => ({
        ...prev,
        badges: [...prev.badges, badgeId]
      }));
      checkAndShowBadgeModal(badgeId);
      addToast('badge', 'Novo Distintivo Conquistado!', reason || 'Parabéns pela conquista!');
    }
  };

  const awardXp = async (amount: number, reason: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/action/complete-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, activityId: `custom-xp-${Date.now()}`, xp: amount })
      });
      if (res.ok) {
        const data = await res.json();
        updateUserProgress(prev => ({
          ...prev,
          xp: data.newXp || prev.xp + amount,
          level: data.newLevel || prev.level,
          levelTitle: data.newLevelTitle || prev.levelTitle
        }));
        addToast('xp', `+${amount} XP!`, reason, amount);
        if (data.leveledUp) {
          triggerCelebration();
          addToast('success', 'Subiste de Nível!', `Agora és um ${data.newLevelTitle}!`);
        }
      }
    } catch (e) {
      // Fallback
      addToast('xp', `+${amount} XP!`, reason, amount);
    }
  };

  const completeActivity = async (activityId: string, xp = 20) => {
    if (!user) return;
    try {
      const res = await fetch('/api/action/complete-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, activityId, xp })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alreadyCompleted) {
          addToast('info', 'Atividade Concluída', 'Já tinhas completado esta atividade.');
          return;
        }
        updateUserProgress(prev => ({
          ...prev,
          xp: data.newXp || prev.xp + xp,
          level: data.newLevel || prev.level,
          levelTitle: data.newLevelTitle || prev.levelTitle,
          completedActivities: [...prev.completedActivities, activityId]
        }));
        addToast('xp', `+${xp} XP`, 'Atividade registada no Firestore com sucesso!', xp);
        if (data.leveledUp) {
          triggerCelebration();
          addToast('success', 'Subiste de Nível!', `Agora és um ${data.newLevelTitle}!`);
        }
      }
    } catch (e) {
      console.error('Error completing activity:', e);
    }
  };

  const completeSimulator = async (simId: string, xp = 30) => {
    if (!user) return;
    try {
      const res = await fetch('/api/action/complete-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, simulatorId: simId, xp })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alreadyCompleted) {
          addToast('info', 'Simulador Finalizado', 'Desafio prático já registado no teu histórico.');
          return;
        }
        updateUserProgress(prev => ({
          ...prev,
          xp: data.newXp || prev.xp + xp,
          level: data.newLevel || prev.level,
          levelTitle: data.newLevelTitle || prev.levelTitle,
          completedSimulators: [...prev.completedSimulators, simId]
        }));
        addToast('xp', `+${xp} XP`, 'Simulador concluído e gravado no Firestore!', xp);
        triggerCelebration();
        if (data.leveledUp) {
          addToast('success', 'Subiste de Nível!', `Novo Nível: ${data.newLevelTitle}!`);
        }
      }
    } catch (e) {
      console.error('Error completing simulator:', e);
    }
  };

  const completeMission = async (worldId: string, submissionText: string, evidenceUrl?: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/action/submit-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, worldId, submissionText, evidenceUrl })
      });
      if (res.ok) {
        const data = await res.json();
        updateUserProgress(prev => ({
          ...prev,
          xp: data.newXp || prev.xp + 50,
          level: data.newLevel || prev.level,
          levelTitle: data.newLevelTitle || prev.levelTitle,
          completedMissions: Array.from(new Set([...prev.completedMissions, worldId]))
        }));
        addToast('xp', '+50 XP', 'Missão Real gravada no Firestore para avaliação docente!', 50);
        triggerCelebration();
      }
    } catch (e) {
      console.error('Error submitting mission:', e);
    }
  };

  const submitAssessment = async (worldId: string, answers: Record<number, string>): Promise<AssessmentResult | null> => {
    if (!user) return null;
    try {
      const res = await fetch('/api/action/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, worldId, answers })
      });
      if (res.ok) {
        const result: AssessmentResult = await res.json();
        
        // Update user progress in state
        updateUserProgress(prev => {
          const updatedScores = {
            ...prev.completedAssessments,
            [worldId]: Math.max(prev.completedAssessments[worldId] || 0, result.scorePercent)
          };
          const badges = result.awardedBadge && !prev.badges.includes(result.awardedBadge)
            ? [...prev.badges, result.awardedBadge]
            : prev.badges;

          return {
            ...prev,
            completedAssessments: updatedScores,
            badges,
            xp: result.passed ? prev.xp + 100 : prev.xp
          };
        });

        if (result.passed) {
          triggerCelebration();
          addToast('success', 'Avaliação Superada!', `Excelente! Obtiveste ${result.scorePercent}% no teste oficial.`);
          if (result.awardedBadge) {
            checkAndShowBadgeModal(result.awardedBadge);
          }
        } else {
          addToast('info', 'Avaliação Não Concluída', `Obtiveste ${result.scorePercent}%. Revê os conteúdos e tenta novamente (mínimo 75%).`);
        }

        return result;
      }
    } catch (e) {
      console.error('Error submitting assessment:', e);
    }
    return null;
  };

  const claimWeeklyChallenge = async (challengeId: string, selectedOption: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch('/api/action/claim-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, challengeId, selectedOption })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isCorrect && !data.alreadyClaimed) {
          updateUserProgress(prev => ({
            ...prev,
            xp: data.newXp || prev.xp + (data.awardedXp || 50),
            level: data.newLevel || prev.level,
            levelTitle: data.newLevelTitle || prev.levelTitle,
            claimedWeeklyChallenges: [...prev.claimedWeeklyChallenges, challengeId]
          }));
          addToast('xp', `+${data.awardedXp || 50} XP`, 'Desafio semanal concluído com sucesso!', data.awardedXp || 50);
          triggerCelebration();
          return true;
        }
      }
    } catch (e) {
      console.error('Error claiming challenge:', e);
    }
    return false;
  };

  const openWorld = (worldId: string, initialTab: 'aprende' | 'experimenta' | 'resolve' | 'cria' = 'aprende') => {
    setSelectedWorldId(worldId);
    setActiveWorldTab(initialTab);
    setCurrentView('world-detail');
  };

  const openWeeklyChallenge = (challenge?: WeeklyChallenge) => {
    setActiveWeeklyChallenge(challenge || WEEKLY_CHALLENGES[0]);
  };

  const closeWeeklyChallenge = () => {
    setActiveWeeklyChallenge(null);
  };

  const openDailyTip = (tip?: DailyTip) => {
    setActiveTip(tip || DAILY_TIPS[0]);
  };

  const closeDailyTip = () => {
    setActiveTip(null);
  };

  const openDailyQuote = (quote?: DailyQuote) => {
    setActiveQuote(quote || DAILY_QUOTES[0]);
  };

  const closeDailyQuote = () => {
    setActiveQuote(null);
  };

  const closeBadgeModal = () => {
    setUnlockedBadgeModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedWorldId,
        openWorld,
        activeWorldTab,
        setActiveWorldTab,
        activeWeeklyChallenge,
        openWeeklyChallenge,
        closeWeeklyChallenge,
        activeTip,
        openDailyTip,
        closeDailyTip,
        activeQuote,
        openDailyQuote,
        closeDailyQuote,
        unlockedBadgeModal,
        closeBadgeModal,
        awardXp,
        awardBadge,
        completeActivity,
        completeSimulator,
        completeMission,
        submitAssessment,
        claimWeeklyChallenge,
        toasts,
        removeToast,
        triggerCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
