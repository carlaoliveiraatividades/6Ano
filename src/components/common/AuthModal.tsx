import React, { useState, useEffect } from 'react';
import { 
  X,
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
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { AvatarCreatorModal } from './AvatarCreatorModal';
import { AvatarConfig } from '../../types';
import { 
  generateRandomNickname, 
  generateDeterministicAvatar, 
  generateRandomAvatar 
} from '../../utils/avatarUtils';

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

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, addToast, setCurrentView } = useApp();
  const { unifiedLogin, registerStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

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

  // Sync tab with AppContext prop when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalTab || 'login');
      setError(null);
    }
  }, [isAuthModalOpen, authModalTab]);

  // Initial nickname generator when register tab opens
  useEffect(() => {
    if (activeTab === 'register' && !regNickname) {
      handleRollNickname();
    }
  }, [activeTab]);

  if (!isAuthModalOpen) return null;

  const handleRollNickname = async () => {
    setIsGeneratingNick(true);
    try {
      const res = await fetch('/api/auth/generate-nickname');
      if (res.ok) {
        const data = await res.json();
        setRegNickname(data.nickname);
        if (!isAvatarCustomizedByUser) {
          setRegAvatar(generateDeterministicAvatar(data.nickname));
        }
      } else {
        const localNick = generateRandomNickname();
        setRegNickname(localNick);
        if (!isAvatarCustomizedByUser) {
          setRegAvatar(generateDeterministicAvatar(localNick));
        }
      }
    } catch {
      const localNick = generateRandomNickname();
      setRegNickname(localNick);
      if (!isAvatarCustomizedByUser) {
        setRegAvatar(generateDeterministicAvatar(localNick));
      }
    } finally {
      setIsGeneratingNick(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await unifiedLogin(identifier.trim(), password);
      if (result.success) {
        const displayName = result.user?.name || (result.role === 'teacher' ? 'Prof.ª Carla' : 'Aluno');
        addToast({
          type: 'success',
          title: `Bem-vindo(a) de volta, ${displayName}!`,
          message: result.role === 'teacher' ? 'Painel Docente pronto.' : 'Missão TIC desbloqueada!'
        });
        closeAuthModal();
        if (result.role === 'teacher') {
          setCurrentView('teacher');
        }
      } else {
        setError(result.error || 'Credenciais inválidas. Verifica o teu nickname/email e palavra-passe.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de comunicação ao iniciar sessão.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || regName.trim().length < 3) {
      setError('Por favor introduz o teu Nome Completo (mínimo 3 caracteres).');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Por favor introduz um Email válido para associar à tua conta.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('A tua palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!regNickname.trim()) {
      setError('Clica no dado para gerar o teu Nickname público seguro.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerStudent({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        classId: regClassId,
        nickname: regNickname.trim(),
        avatar: regAvatar
      });

      if (result.success && result.user) {
        addToast({
          type: 'success',
          title: `Conta criada com sucesso!`,
          message: `Olá, ${result.user.nickname}! Estás pronto para explorar a Missão TIC.`
        });
        closeAuthModal();
        setCurrentView('dashboard');
      } else {
        setError(result.error || 'Não foi possível criar a conta. Tenta novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado no registo de aluno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAuthModal();
        }}
      >
        <div 
          id="auth-modal-dialog"
          className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative shrink-0">
            <button
              id="auth-modal-close-btn"
              onClick={closeAuthModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Missão TIC • 6.º Ano
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                  {activeTab === 'login' ? 'Iniciar Sessão' : 'Criar Conta de Aluno'}
                </h2>
              </div>
            </div>

            {/* 2 Tabs (No visitor tab) */}
            <div className="flex bg-black/20 p-1 rounded-2xl mt-5 gap-1">
              <button
                id="auth-tab-login-btn"
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Iniciar Sessão</span>
              </button>

              <button
                id="auth-tab-register-btn"
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Criar Conta de Aluno</span>
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Nickname de Aluno ou Email da Professora
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-identifier-input"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="ex: Panda_Curioso_12 ou email docente"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Palavra-passe
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
                >
                  {loading ? (
                    <span>A verificar credenciais...</span>
                  ) : (
                    <>
                      <span>Entrar na Plataforma</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Real Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Nome Completo do Aluno
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-name-input"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="ex: Alexandre Costa"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Privacidade RGPD: O teu nome real só é visível para a tua Professora.
                  </span>
                </div>

                {/* Email & Turma Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-email-input"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="aluno@escola.pt"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Turma
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="reg-class-select"
                        value={regClassId}
                        onChange={(e) => setRegClassId(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50 font-semibold text-slate-800 appearance-none"
                      >
                        {CLASS_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Palavra-passe Segura
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nickname Generation */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      O teu Nickname Público
                    </label>
                    <button
                      type="button"
                      onClick={handleRollNickname}
                      disabled={isGeneratingNick}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>{isGeneratingNick ? 'A rodar...' : 'Gerar Outro'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="reg-nickname-input"
                      type="text"
                      readOnly
                      value={regNickname}
                      className="flex-1 px-3 py-2 rounded-xl border border-indigo-300 bg-white font-mono font-bold text-indigo-950 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRollNickname}
                      className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                      title="Sortear novo Nickname"
                    >
                      <Dices className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-indigo-700 leading-tight">
                    Este nome será o teu pseudónimo nos rankings e nos jogos digitais sem expor o teu nome real!
                  </p>
                </div>

                {/* Avatar Preview & Customize */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatarId={regAvatar} size="lg" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Avatar do Aluno</span>
                      <span className="text-[11px] text-slate-500">
                        {isAvatarCustomizedByUser ? 'Avatar personalizado' : 'Avatar automático'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    <span>Personalizar</span>
                  </button>
                </div>

                <button
                  id="submit-register-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>A registar conta no Firestore...</span>
                  ) : (
                    <>
                      <span>Criar Conta &amp; Começar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Creator Modal */}
      {isAvatarModalOpen && (
        <AvatarCreatorModal
          initialConfig={regAvatar}
          onSave={(cfg) => {
            setRegAvatar(cfg);
            setIsAvatarCustomizedByUser(true);
            setIsAvatarModalOpen(false);
          }}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </>
  );
};
