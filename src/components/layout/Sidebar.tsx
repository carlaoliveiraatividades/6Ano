import React from 'react';
import { Home, Compass, Trophy, Award, User as UserIcon, GraduationCap, LogOut, X, LogIn } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp, MainView } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, addToast, openAuthModal } = useApp();
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Sessão Terminada',
      message: 'Terminaste a sessão na Missão TIC com sucesso.',
      type: 'info'
    });
    if (onCloseMobile) onCloseMobile();
  };

  const handleNavClick = (view: MainView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  interface NavItem {
    id: MainView;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'worlds', label: 'Mundos', icon: Compass },
    { id: 'challenges', label: 'Desafios', icon: Trophy, badge: 'Novo' },
    { id: 'achievements', label: 'Conquistas', icon: Award },
    { id: 'ranking', label: 'Classificação', icon: Trophy }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Logo />
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5" aria-label="Navegação Principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'worlds' && currentView === 'world-detail');

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Teacher Portal Section */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              id="nav-teacher"
              onClick={() => handleNavClick('teacher')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                currentView === 'teacher'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-100 font-bold'
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-indigo-50/50'
              }`}
            >
              <GraduationCap
                className={`w-5 h-5 ${
                  currentView === 'teacher' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <div className="flex items-center justify-between w-full">
                <span>Área do Professor</span>
                {role === 'teacher' && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">
                    Docente
                  </span>
                )}
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Educational Quote Card & Auth action */}
      <div className="p-4 space-y-3">
        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100/80 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl" />
          <p className="text-xs italic text-slate-700 font-medium pl-2 leading-relaxed">
            &ldquo;Pequenas aprendizagens fazem grandes futuros.&rdquo;
          </p>
        </div>

        {user ? (
          <button
            id="sidebar-btn-logout"
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminar Sessão</span>
          </button>
        ) : (
          <button
            id="sidebar-btn-login"
            onClick={() => {
              openAuthModal('login');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar / Criar Conta</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 select-none shadow-xs z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
