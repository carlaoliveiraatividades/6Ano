import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Dices,
  Palette,
  ShieldCheck,
  School,
  Mail,
  UserCheck,
  RefreshCw,
  Compass,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { AvatarCreatorModal } from '../components/common/AvatarCreatorModal';
import { AvatarConfig } from '../types';
import { 
  generateRandomNickname, 
  generateDeterministicAvatar, 
  generateRandomAvatar 
} from '../utils/avatarUtils';

const CLASS_OPTIONS = [
  { id: 'turma-6a', name: '6.º A' },
  { id: 'turma-6b', name: '6.º B' },
  { id: 'turma-6c', name: '6.º C' },
  { id: 'turma-6d', name: '6.º D' },
  { id: 'turma-6e', name: '6.º E' },
  { id: 'turma-6f', name: '6.º F' },
  { id: 'turma-5a', name: '5.º A' },
  { id: 'turma-5b', name: '5.º B' },
  { id: 'turma-5c', name: '5.º C' },
  { id: 'turma-5d', name: '5.º D' }
];

export const LoginView: React.FC = () => {
  const { unifiedLogin, registerStudent, loginGuest } = useAuth();
  const { setCurrentView, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'visitor'>('login');

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regClassId, setRegClassId] = useState('turma-6a');
  const [regNickname, setRegNickname] = useState('');
  const [regAvatar, setRegAvatar] = useState<AvatarConfig>(() => generateRandomAvatar());
  const [isAvatarCustomizedByUser, setIsAvatarCustomizedByUser] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Status & Validation
  const [loading, setLoading] = useState(false);
  const [isGeneratingNick, setIsGeneratingNick] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize unique nickname on mount or tab change
  useEffect(() => {
    if (activeTab === 'register' && !regNickname) {
      handleShuffleNickname();
    }
  }, [activeTab]);

  // Shuffle nickname from server or local generator
  const handleShuffleNickname = async () => {
    setIsGeneratingNick(true);
    try {
      const res = await fetch('/api/auth/generate-nickname');
      if (res.ok) {
        const data = await res.json();
        if (data.nickname) {
          setRegNickname(data.nickname);
          // If user hasn't manually customized their avatar, update deterministic avatar
          if (!isAvatarCustomizedByUser) {
            setRegAvatar(generateDeterministicAvatar(data.nickname));
          }
          setIsGeneratingNick(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to local nickname generation:', e);
    }

    const fallbackNick = generateRandomNickname();
    setRegNickname(fallbackNick);
    if (!isAvatarCustomizedByUser) {
      setRegAvatar(generateDeterministicAvatar(fallbackNick));
    }
    setIsGeneratingNick(false);
  };

  // Shuffle avatar manually
  const handleShuffleAvatar = () => {
    const randomAvatar = generateRandomAvatar();
    setRegAvatar(randomAvatar);
    setIsAvatarCustomizedByUser(true);
  };

  // Handle avatar save from modal
  const handleSaveAvatar = (savedConfig: AvatarConfig) => {
    setRegAvatar(savedConfig);
    setIsAvatarCustomizedByUser(true);
    addToast({
      title: 'Avatar Atualizado! 🎨',
      message: 'O teu novo visual está pronto.',
      type: 'success'
    });
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Por favor, escreve o teu Email ou Nickname de aluno.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await unifiedLogin(identifier.trim(), password);
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
            title: 'Sessão Iniciada! 🚀',
            message: 'Bem-vindo de volta à Missão TIC 6.º Ano.',
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

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Name
    const cleanName = regName.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Por favor, indica o teu nome real completo (mínimo 2 letras).');
      return;
    }

    // 2. Normalize and Validate Email
    const cleanEmail = regEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Por favor, indica um endereço de email válido (ex: aluno@escola.pt).');
      return;
    }

    // 3. Validate Password
    if (!regPassword || regPassword.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    // 4. Validate Nickname
    const cleanNickname = regNickname.trim();
    if (!cleanNickname || cleanNickname.length < 3) {
      setError('O nickname deve conter pelo menos 3 caracteres.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const selectedClass = CLASS_OPTIONS.find(c => c.id === regClassId);
      const res = await registerStudent({
        name: cleanName,
        email: cleanEmail,
        password: regPassword,
        classId: regClassId,
        className: selectedClass?.name || '6.º A',
        nickname: cleanNickname,
        avatar: regAvatar
      });

      if (res.success) {
        addToast({
          title: `Conta Criada com Sucesso! 🚀`,
          message: `Bem-vindo à Missão TIC, ${cleanNickname}! O teu registo foi concluído.`,
          type: 'success'
        });
        setCurrentView('dashboard');
      } else {
        setError(res.error || 'Erro ao criar conta. Tenta novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com o servidor. Tenta novamente.');
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
          message: 'Podes explorar livremente todos os 5 mundos e atividades.',
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
          {/* Quick Visitor Button in Header */}
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
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto my-6">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-700/60 bg-slate-950/40 p-1.5">
            <button
              id="tab-login"
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Iniciar Sessão</span>
            </button>

            <button
              id="tab-register"
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Conta de Aluno</span>
            </button>

            <button
              id="tab-visitor"
              type="button"
              onClick={() => { setActiveTab('visitor'); setError(null); }}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'visitor'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/30'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Visitante</span>
            </button>
          </div>

          {/* Form Area */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* TAB 1: INICIAR SESSÃO */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Email, Nickname ou Nome de Aluno
                  </label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Ex: aluno@escola.pt ou Panda_Feliz_701"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Insere a tua palavra-passe (mínimo 6 carateres)"
                      className="w-full pl-12 pr-12 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>A validar credenciais...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar na Missão TIC</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Demo Access Bar */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                  <span className="font-medium">Acesso Rápido de Demonstração:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setIdentifier('aluno-alex'); setPassword('alunotic2026'); }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
                    >
                      👦 Aluno Alex
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('imaginebycarla2023@gmail.com'); setPassword('carlamso'); }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 font-bold transition-all cursor-pointer"
                    >
                      👩‍🏫 Prof.ª Carla
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: CRIAR CONTA DE ALUNO (REGISTO COMPLETO) */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                
                {/* Privacy Badge Notice */}
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-center gap-3 text-xs text-blue-200">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <strong className="text-white">Privacidade dos Alunos:</strong> O teu <strong>Nome Real</strong> e <strong>Email</strong> são privados (visíveis apenas para o professor). Os teus colegas no ranking verão apenas o teu <strong>Nickname</strong> e <strong>Avatar</strong>.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome Real (Privado) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Nome Real do Aluno</span>
                      <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40">🔒 Privado</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-name"
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Ex: Maria Ramos Silva"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Para identificação escolar com a professora.</span>
                  </div>

                  {/* Email (Privado & Normalizado) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Endereço de Email</span>
                      <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40">🔒 Privado</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="Ex: maria.silva@escola.pt"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Utilizado para iniciar sessão e recuperar a conta.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Palavra-passe */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Palavra-passe (mínimo 6 carateres)
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Palavra-passe segura"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Turma (Lista Selecionável) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-blue-400" />
                      <span>Turma</span>
                    </label>
                    <select
                      id="reg-class"
                      value={regClassId}
                      onChange={e => setRegClassId(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      {CLASS_OPTIONS.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nickname e Avatar Box (Públicos) */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                        <span>Identidade Pública no Jogo</span>
                        <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40">🌍 Público</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Este é o Nickname e Avatar que os teus colegas e professores verão no Ranking.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Avatar Preview + Controls */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                        <div className="w-20 h-20 rounded-2xl border-2 border-blue-500/60 shadow-lg shadow-blue-500/20 overflow-hidden bg-slate-800 transition-transform group-hover:scale-105">
                          <UserAvatar avatar={regAvatar} name={regNickname} size="lg" className="w-full h-full" />
                        </div>
                        <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id="btn-customize-avatar"
                          type="button"
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Palette className="w-3 h-3" />
                          <span>Personalizar</span>
                        </button>

                        <button
                          id="btn-shuffle-avatar"
                          type="button"
                          onClick={handleShuffleAvatar}
                          className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Baralhar novo visual de avatar"
                        >
                          <Dices className="w-3 h-3 text-amber-400" />
                        </button>
                      </div>
                    </div>

                    {/* Nickname Input & Generator */}
                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        Nickname Único de Aluno
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="reg-nickname"
                          type="text"
                          value={regNickname}
                          onChange={e => setRegNickname(e.target.value)}
                          placeholder="Ex: Panda_Feliz_701"
                          required
                          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                          id="btn-shuffle-nickname"
                          type="button"
                          onClick={handleShuffleNickname}
                          disabled={isGeneratingNick}
                          className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 disabled:opacity-50"
                          title="Gerar outro nickname único"
                        >
                          <Dices className={`w-4 h-4 text-amber-400 ${isGeneratingNick ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">Baralhar Outro Nickname</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        O nickname é gerado automaticamente de forma única e sem espaços. Podes clicar em Baralhar sempre que quiseres!
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>A criar a tua conta de aluno...</span>
                    </>
                  ) : (
                    <>
                      <span>Concluir Registo e Entrar na Missão 🚀</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: VISITANTE */}
            {activeTab === 'visitor' && (
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-amber-500/20">
                  <Compass className="w-8 h-8 text-amber-400" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-display font-black text-xl text-white">
                    Explorar em Modo Visitante
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">
                    Não precisas de criar conta nem indicar email para conhecer a Missão TIC. Podes aceder a todos os 5 Mundos, realizar simuladores e experimentar os questionários interativos.
                  </p>
                </div>

                <button
                  id="btn-visitor-start"
                  type="button"
                  onClick={handleGuestAccess}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Entrar Imediatamente como Visitante</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        Missão TIC — 6.º Ano do Ensino Básico • Plataforma Curricular e Pedagógica
      </div>

      {/* Avatar Customizer Modal */}
      {isAvatarModalOpen && (
        <AvatarCreatorModal
          isOpen={isAvatarModalOpen}
          initialConfig={regAvatar}
          onSave={handleSaveAvatar}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </div>
  );
};
