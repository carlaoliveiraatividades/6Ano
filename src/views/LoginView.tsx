import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  GraduationCap,
  KeyRound,
  Compass,
  UserPlus,
  LogIn,
  Eye,
  School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';

const AVATAR_OPTIONS = [
  { id: 'alex', label: 'Explorador', emoji: '🧑‍🚀' },
  { id: 'leonor', label: 'Cientista', emoji: '👧' },
  { id: 'tiago', label: 'Programador', emoji: '👦' },
  { id: 'beatriz', label: 'Investigadora', emoji: '👩‍🔬' },
  { id: 'duarte', label: 'Gamer', emoji: '🧑‍💻' },
  { id: 'ines', label: 'Criativa', emoji: '👩‍🎨' },
  { id: 'miguel', label: 'Músico', emoji: '🧑‍🎤' },
  { id: 'sofia', label: 'Detetive', emoji: '👧' }
];

const CLASS_OPTIONS = [
  { id: 'turma-6a', name: 'Turma 6.º A' },
  { id: 'turma-6b', name: 'Turma 6.º B' },
  { id: 'turma-6c', name: 'Turma 6.º C' },
  { id: 'turma-6d', name: 'Turma 6.º D' }
];

export const LoginView: React.FC = () => {
  const { unifiedLogin, registerStudent, loginGuest } = useAuth();
  const { setCurrentView, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'visitor'>('login');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regAvatar, setRegAvatar] = useState('alex');
  const [regClassId, setRegClassId] = useState('turma-6a');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacherSelected = 
    identifier.toLowerCase().includes('carla') || 
    identifier.toLowerCase().includes('prof') ||
    identifier.toLowerCase() === 'imaginebycarla2023@gmail.com';

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Por favor, escreve o teu nome, utilizador ou email.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await unifiedLogin(identifier, password);
      if (res.success) {
        if (res.role === 'teacher') {
          addToast({
            title: 'Bem-vinda, Prof.ª Carla!',
            message: 'Painel da docente autenticado com segurança.',
            type: 'success'
          });
          setCurrentView('teacher');
        } else {
          addToast({
            title: 'Sessão Iniciada!',
            message: `Bem-vindo de volta à Missão TIC 6.º Ano.`,
            type: 'success'
          });
          setCurrentView('dashboard');
        }
      } else {
        setError(res.error || 'Credenciais inválidas. Tenta novamente.');
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao iniciar sessão. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || regName.trim().length < 2) {
      setError('Por favor, introduz o teu nome completo (mínimo 2 letras).');
      return;
    }
    if (!regUsername.trim() || regUsername.trim().length < 2) {
      setError('Por favor, escolhe um nome de utilizador (ex: maria.s ou tiago22).');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const selectedClass = CLASS_OPTIONS.find(c => c.id === regClassId);
      const res = await registerStudent(
        regName.trim(),
        regUsername.trim(),
        regAvatar,
        regClassId,
        selectedClass?.name || '6.º Ano — Turma A'
      );

      if (res.success) {
        addToast({
          title: `Conta Criada com Sucesso! 🚀`,
          message: `Bem-vindo à Missão TIC, ${regName.trim()}! Começaste com os Mundos 1 e 2 desbloqueados.`,
          type: 'success'
        });
        setCurrentView('dashboard');
      } else {
        setError(res.error || 'Erro ao criar conta. Tenta novamente com outro utilizador.');
      }
    } catch (err: any) {
      setError('Erro ao comunicar com o servidor. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Guest / Visitor Access
  const handleGuestAccess = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginGuest();
      if (res.success) {
        addToast({
          title: 'Modo Visitante Ativado 🌟',
          message: 'Podes explorar livremente todos os 5 mundos, simuladores e conteúdos.',
          type: 'info'
        });
        setCurrentView('dashboard');
      } else {
        setError(res.error || 'Erro ao aceder como visitante.');
      }
    } catch (err: any) {
      setError('Erro ao entrar em modo visitante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-500 selection:text-white">
      {/* Top Header Branding */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-extrabold text-xl">
            🚀
          </div>
          <div>
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
              Missão TIC <span className="text-blue-400 text-sm font-semibold">6.º Ano</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Plataforma Interativa de Tecnologias de Informação e Comunicação
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Top Header Quick Visitor Button */}
          <button
            id="top-btn-visitor-access"
            type="button"
            onClick={handleGuestAccess}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-extrabold transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Aceder imediatamente sem registo"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Acesso a Visitantes</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
            <Database className="w-3.5 h-3.5" />
            <span>Firestore</span>
          </span>
        </div>
      </div>

      {/* Main Single Card with Tabs */}
      <div className="max-w-2xl w-full mx-auto my-6 sm:my-8 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Quick Visitor Highlight Banner at Top of Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-indigo-950/60 to-blue-950/60 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 text-base">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">
                  Acesso Rápido a Visitantes
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  1 Clique
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Queres apenas conhecer a plataforma? Explora os 5 Mundos e simuladores sem criar conta.
              </p>
            </div>
          </div>

          <button
            id="hero-btn-visitor-access"
            type="button"
            onClick={handleGuestAccess}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 shrink-0"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Entrar como Visitante</span>
          </button>
        </div>

        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Escolar e Educativo</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {activeTab === 'login' ? 'Entrar na Missão TIC' : activeTab === 'register' ? 'Criar Conta de Aluno' : 'Acesso para Visitantes'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {activeTab === 'login' 
              ? 'Inicia sessão com o teu utilizador de aluno ou credenciais da docente.' 
              : activeTab === 'register'
              ? 'Regista a tua conta pessoal de aluno para guardares o teu progresso, XP e medalhas.'
              : 'Exploração livre de todos os conteúdos e ferramentas pedagógicas sem necessidade de registo.'}
          </p>
        </div>

        {/* 3-Tab Switcher */}
        <div className="grid grid-cols-3 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 max-w-lg mx-auto mb-6 gap-1">
          <button
            id="tab-btn-login"
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Entrar</span>
          </button>

          <button
            id="tab-btn-register"
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Criar Conta</span>
          </button>

          <button
            id="tab-btn-visitor"
            type="button"
            onClick={() => {
              setActiveTab('visitor');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'visitor'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-900/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Visitante</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-md mx-auto mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4">
            {/* Identifier Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Utilizador, Nome ou Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-identifier"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="ex: Alex Ramos ou o teu nome de utilizador"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Input (Required for teacher, optional for students) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Palavra-passe
                </label>
                {isTeacherSelected && (
                  <button
                    type="button"
                    onClick={() => setPassword('carlamso')}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Preencher demo (carlamso)
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isTeacherSelected ? "Palavra-passe da Prof.ª Carla" : "Palavra-passe (apenas docente)"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                💡 <strong>Alunos</strong> acedem diretamente com o seu nome ou utilizador. A palavra-passe é apenas exigida para a <strong>Prof.ª Carla</strong> (<span className="font-mono text-slate-300">carlamso</span>).
              </p>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading || !identifier.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>A verificar credenciais...</span>
              ) : (
                <>
                  <span>Entrar na Missão TIC</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM (Aluno cria a sua conta) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="max-w-md mx-auto space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nome Completo do Aluno
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-input-name"
                  type="text"
                  value={regName}
                  onChange={e => {
                    setRegName(e.target.value);
                    if (!regUsername) {
                      // Suggest username automatically
                      const suggested = e.target.value
                        .toLowerCase()
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, '.')
                        .replace(/[^a-z0-9.]/g, '');
                      setRegUsername(suggested);
                    }
                  }}
                  placeholder="ex: Matilde Pereira"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nome de Utilizador / Alcunha
              </label>
              <div className="relative">
                <span className="text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm">@</span>
                <input
                  id="reg-input-username"
                  type="text"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                  placeholder="ex: matilde.p"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Usa letras, números ou pontos para o teu utilizador de acesso.
              </p>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Turma do 6.º Ano
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="reg-select-class"
                  value={regClassId}
                  onChange={e => setRegClassId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {CLASS_OPTIONS.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Escolhe o teu Avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setRegAvatar(av.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      regAvatar === av.id
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} size="sm" />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Register */}
            <button
              id="btn-register-submit"
              type="submit"
              disabled={loading || !regName.trim() || !regUsername.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>A criar conta no Firestore...</span>
              ) : (
                <>
                  <span>Criar Conta e Começar a Missão 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: VISITOR ACCESS VIEW */}
        {activeTab === 'visitor' && (
          <div className="max-w-md mx-auto space-y-5 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  O que podes fazer no Modo Visitante?
                </h3>
              </div>

              <ul className="text-xs text-slate-300 space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Todos os 5 Mundos Desbloqueados:</strong> Guardião, Detetive, Laboratório, Oficina e Cidadão Digital.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Simuladores Interativos:</strong> Testador de Passwords, Simulador de Phishing, Pesquisa Booleana, Construtor de Fórmulas e mais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Desafios & Quizzes:</strong> Experimenta a progressão pedagógica sem necessitar de criar conta.</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-visitor-tab-start"
              type="button"
              onClick={handleGuestAccess}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 active:scale-95 disabled:opacity-50 text-slate-950 rounded-xl font-black text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>A carregar modo visitante...</span>
              ) : (
                <>
                  <Compass className="w-5 h-5 text-slate-950" />
                  <span>Entrar Agora como Visitante 🚀</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Divider for Visitor Mode */}
        <div className="relative my-8 text-center max-w-md mx-auto">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Ou explora sem registo
          </span>
        </div>

        {/* VISITOR MODE CARD / BUTTON */}
        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950/40 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Acesso para Visitantes
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explora livremente os 5 Mundos, simuladores e desafios sem criar conta.
              </p>
            </div>
          </div>

          <button
            id="btn-guest-access"
            type="button"
            onClick={handleGuestAccess}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold transition-all hover:border-blue-400 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Explorar como Visitante</span>
          </button>
        </div>

      </div>

      {/* Footer Discreet Link and Copyright */}
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-4 border-t border-slate-800/60">
        <div>
          Missão TIC • Disciplina de TIC do 6.º Ano de Escolaridade • Portugal
        </div>
        <div className="text-[11px] text-slate-400">
          Prof.ª Carla • Turma 6.º A
        </div>
      </div>
    </div>
  );
};
