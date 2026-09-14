import React from 'react';
import { Home, Compass, Trophy, Award, User as UserIcon, GraduationCap } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp, MainView } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const { role } = useAuth();

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
    { id: 'profile', label: 'Perfil', icon: UserIcon }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none shadow-xs z-20">
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-slate-100">
          <Logo />
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
                onClick={() => setCurrentView(item.id)}
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
              onClick={() => setCurrentView('teacher')}
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

      {/* Bottom Educational Quote Card matching reference UI */}
      <div className="p-4 m-4 rounded-2xl bg-sky-50/70 border border-sky-100/80 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl" />
        <p className="text-xs italic text-slate-700 font-medium pl-2 leading-relaxed">
          &ldquo;Pequenas aprendizagens fazem grandes futuros.&rdquo;
        </p>
      </div>
    </aside>
  );
};
