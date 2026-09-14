import React, { useState } from 'react';
import { Search, Bell, LogOut, Lightbulb, ChevronDown, Database, KeyRound, GraduationCap } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { getLevelForXp } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { TeacherLoginModal } from '../common/TeacherLoginModal';

export const Header: React.FC = () => {
  const { user, role, logout, switchDemoUser } = useAuth();
  const { setCurrentView, addToast } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Sessão Terminada',
      message: 'Terminaste a sessão na Missão TIC com sucesso.',
      type: 'info'
    });
  };

  const xp = user?.xp || 320;
  const levelData = getLevelForXp(xp);

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
      {/* Left: User Avatar & Greeting Banner matching the reference image */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={() => setCurrentView('profile')}
          className="relative group cursor-pointer focus:outline-none"
          title="Ver perfil"
        >
          <UserAvatar avatarId={user?.avatar || 'alex'} size="xl" />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
            N{levelData.level}
          </div>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              Olá, <span className="text-blue-600">{user?.name || 'Alex'}</span>!
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
              <Database className="w-2.5 h-2.5" />
              Firestore Ativo
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            {role === 'teacher' ? 'Painel exclusivo da docente (imaginebycarla2023@gmail.com)' : 'Pronto para mais uma missão?'}
          </p>

          {/* Level and XP Progress bar */}
          <div className="mt-2 bg-slate-100/90 rounded-xl px-3 py-1.5 border border-slate-200/60 max-w-xs sm:max-w-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="text-blue-700 font-bold">
                Nível {levelData.level} <span className="font-medium text-slate-500">– {levelData.title}</span>
              </span>
              <span className="text-slate-500 text-[11px] font-mono">
                {xp} / {levelData.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${levelData.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Motivational quote banner with lightbulb matching reference image */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-amber-50/60 border border-amber-100/80 rounded-2xl">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400 text-white shadow-xs">
          <Lightbulb className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col text-right">
          <p className="text-xs font-semibold italic text-slate-700">
            &ldquo;A tecnologia é uma ferramenta. Tu decides como a usar.&rdquo;
          </p>
          <span className="text-[10px] font-bold text-amber-700">
            Grandes ideias começam aqui!
          </span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, role switcher, logout */}
      <div className="flex items-center gap-2.5 self-end md:self-auto">
        {/* Role Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {role === 'teacher' ? 'Prof.ª Carla (Docente)' : 'Aluno (Alex)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 text-xs">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                Alternar Utilizador Demo
              </div>
              <button
                onClick={() => {
                  switchDemoUser('student');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center justify-between"
              >
                <span>Aluno Demo (Alex)</span>
                {role === 'student' && <span className="text-blue-600 font-bold">✓</span>}
              </button>
              <button
                onClick={() => {
                  switchDemoUser('teacher');
                  setShowRoleMenu(false);
                  setCurrentView('teacher');
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium flex flex-col"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold">Prof.ª Carla (Única Docente)</span>
                  {role === 'teacher' && <span className="text-indigo-600 font-bold">✓</span>}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">imaginebycarla2023@gmail.com</span>
              </button>

              <button
                onClick={() => {
                  setShowRoleMenu(false);
                  setShowTeacherLoginModal(true);
                }}
                className="w-full text-left px-2.5 py-2 mt-1 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 font-semibold flex items-center gap-2 border border-indigo-200/60"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Validar Palavra-passe (carlamso)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">Notificações da Missão</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Marcar como lidas</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-slate-700">
                  <p className="font-bold text-blue-900">Novo Desafio da Semana!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Consegues descobrir se esta mensagem é phishing? Ganha +50 XP!</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 text-slate-700">
                  <p className="font-bold text-amber-900">Mundo 2 Desbloqueado!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">O Mundo do Detetive Digital está pronto para ser explorado.</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-slate-700">
                  <p className="font-bold text-emerald-900">Crachá Obtido!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Recebeste o crachá de Guardião Digital.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terminar Sessão (Logout) button matching reference UI */}
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Terminar sessão"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Terminar sessão</span>
        </button>
      </div>

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={showTeacherLoginModal}
        onClose={() => setShowTeacherLoginModal(false)}
      />
    </header>
  );
};
