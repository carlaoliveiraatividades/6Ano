import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { WorldsListView } from './views/WorldsListView';
import { WorldDetailView } from './views/WorldDetailView';
import { GrandMissionView } from './views/GrandMissionView';
import { ChallengesListView } from './views/ChallengesListView';
import { AchievementsView } from './views/AchievementsView';
import { RankingView } from './views/RankingView';
import { TeacherDashboardView } from './views/TeacherDashboardView';

// Modals
import { AuthModal } from './components/common/AuthModal';
import { WeeklyChallengeModal } from './components/common/WeeklyChallengeModal';
import { DailyModals } from './components/common/DailyModals';
import { CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toasts, openAuthModal } = useApp();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If loading initial state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 animate-bounce flex items-center justify-center text-3xl text-white shadow-xl shadow-blue-500/30">
          🚀
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          A carregar a Missão TIC...
        </p>
      </div>
    );
  }

  // NOTE: The main page is ALWAYS visible regardless of whether users are logged in or not.
  // The Login/Register options are accessible via the button in the top right corner of the Header.
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'worlds':
        return <WorldsListView />;
      case 'world-detail':
        return <WorldDetailView />;
      case 'grand-mission':
        return <GrandMissionView />;
      case 'challenges':
        return <ChallengesListView />;
      case 'achievements':
        return <AchievementsView />;
      case 'ranking':
        return <RankingView />;
      case 'teacher':
        if (user?.role === 'teacher') {
          return <TeacherDashboardView />;
        }
        return (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto mt-12 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mx-auto">
              👩‍🏫
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Área Restrita à Docente
            </h2>
            <p className="text-xs text-slate-600">
              O Painel de Gestão de Turmas é exclusivo para a Professora Carla. Inicia sessão para aceder às avaliações e submissões.
            </p>
            <button
              onClick={() => openAuthModal('login')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Iniciar Sessão Docente
            </button>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      <div className="flex flex-1 min-h-screen relative">
        {/* Persistent Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Login/Register button on top right */}
          <Header onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />

          {/* Primary View Outlet */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Auth Modal for Login and Student Registration (No visitor tab) */}
      <AuthModal />

      {/* Global Modals */}
      <WeeklyChallengeModal />
      <DailyModals />

      {/* Toast Notifications Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto max-w-sm ${
                t.type === 'xp'
                  ? 'bg-amber-950/95 text-amber-100 border-amber-600/60'
                  : t.type === 'badge'
                  ? 'bg-purple-950/95 text-purple-100 border-purple-600/60'
                  : t.type === 'success'
                  ? 'bg-emerald-950/95 text-emerald-100 border-emerald-600/60'
                  : t.type === 'error'
                  ? 'bg-rose-950/95 text-rose-100 border-rose-600/60'
                  : 'bg-slate-900/95 text-slate-100 border-slate-700'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {t.type === 'badge' && <Award className="w-5 h-5 text-purple-300 shrink-0" />}
              {t.type === 'xp' && <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {t.type === 'info' && <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />}
              <div>
                <span className="block font-bold">{t.title}</span>
                <span className="text-[11px] font-normal opacity-90">{t.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
