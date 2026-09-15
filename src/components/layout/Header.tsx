import React, { useState } from 'react';
import { 
  Bell, 
  LogOut, 
  Lightbulb, 
  Database, 
  Sparkles,
  Menu,
  GraduationCap,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { getLevelForXp } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { TeacherLoginModal } from '../common/TeacherLoginModal';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, role, logout } = useAuth();
  const { setCurrentView, addToast, openAuthModal } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Sessão Terminada',
      message: 'Terminaste a tua sessão na Missão TIC. Podes continuar a explorar livremente.',
      type: 'info'
    });
  };

  const xp = user?.xp || 0;
  const levelData = getLevelForXp(xp);

  return (
    <header 
      id="app-header"
      className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-20 shadow-xs"
    >
      {/* Left: Mobile hamburger & User info / Public Welcome */}
      <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              id="header-mobile-menu-btn"
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {user ? (
            /* Logged in Avatar & Greeting */
            <button
              id="header-profile-btn"
              onClick={() => setCurrentView('achievements')}
              className="relative group cursor-pointer focus:outline-none shrink-0"
              title="Ver o meu perfil e conquistas"
            >
              <UserAvatar avatarId={user.avatar || 'alex'} size="xl" />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                N{levelData.level}
              </div>
            </button>
          ) : (
            /* Public Guest Header Brand Icon */
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                {user ? (
                  <>
                    Olá, <span className="text-blue-600">{user.nickname || user.name}</span>!
                  </>
                ) : (
                  <>
                    Missão <span className="text-blue-600">TIC</span> • 6.º Ano
                  </>
                )}
              </h1>

              {user?.role === 'teacher' ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-700">
                  <GraduationCap className="w-2.5 h-2.5" />
                  Docente
                </span>
              ) : user ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                  <Database className="w-2.5 h-2.5" />
                  Aluno ({user.className || '6.º Ano'})
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[10px] font-bold text-sky-700">
                  Modo Aberto • Explora os 5 Mundos
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {user?.role === 'teacher'
                ? 'Painel de Gestão Pedagógica da Professora Carla'
                : user
                ? 'Pronto para explorar novos desafios curriculares?'
                : 'Acesso livre a simuladores, jogos e conteúdos de TIC.'}
            </p>

            {/* Level and XP Progress bar for authenticated user */}
            {user && (
              <div className="mt-1.5 bg-slate-100/90 rounded-xl px-2.5 py-1 border border-slate-200/60 max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span className="text-blue-700 font-bold">
                    Nível {levelData.level} <span className="font-medium text-slate-500">– {levelData.title}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {xp} / {levelData.nextLevelXp} XP
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${levelData.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only login/register trigger when !user */}
        {!user && (
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <button
              id="header-mobile-login-btn"
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </div>
        )}
      </div>

      {/* Middle: Motivational quote banner with lightbulb */}
      <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400 text-white shadow-xs shrink-0">
          <Lightbulb className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <p className="text-[11px] font-semibold italic text-slate-700">
            &ldquo;A tecnologia é uma ferramenta. Tu decides como a usar.&rdquo;
          </p>
          <span className="text-[10px] font-bold text-amber-800">
            Aprende, cria e protege a tua pegada digital!
          </span>
        </div>
      </div>

      {/* Right: Actions / Auth buttons */}
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
        {!user ? (
          /* =========================================================================
             CORNER TOP-RIGHT LOGIN & REGISTER BUTTONS (When not logged in)
             "No canto superior direito devera surgir um botao onde se ainda se faz login ou criaca-se a conta"
             ========================================================================= */
          <div id="header-auth-actions" className="flex items-center gap-2">
            <button
              id="btn-header-login"
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl border border-slate-300 transition-all cursor-pointer"
              title="Iniciar sessão de Aluno ou Professora"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Iniciar Sessão</span>
            </button>

            <button
              id="btn-header-register"
              type="button"
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              title="Criar nova conta de aluno"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-100" />
              <span>Criar Conta</span>
            </button>
          </div>
        ) : (
          /* =========================================================================
             LOGGED IN HEADER CONTROLS (Notifications, Teacher shortcuts, Logout)
             ========================================================================= */
          <div id="header-user-actions" className="flex items-center gap-2">
            {role === 'teacher' && (
              <button
                id="btn-header-teacher-panel"
                onClick={() => setCurrentView('teacher')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Painel Docente</span>
              </button>
            )}

            {/* Notifications Button */}
            <div className="relative">
              <button
                id="btn-header-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Notificações"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-xs">
                  2
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Notificações</span>
                    <span 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                      Fechar
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-slate-700">
                      <p className="font-bold text-blue-900">Desafio da Semana Disponível</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Testa as tuas capacidades de detetive digital e ganha XP!</p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-slate-700">
                      <p className="font-bold text-emerald-900">Base de Dados Conectada</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">As tuas conquistas são guardadas no Firestore em tempo real.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Terminar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Terminar sessão</span>
            </button>
          </div>
        )}
      </div>

      {/* Teacher Direct Auth Modal if needed */}
      <TeacherLoginModal
        isOpen={showTeacherLoginModal}
        onClose={() => setShowTeacherLoginModal(false)}
      />
    </header>
  );
};
