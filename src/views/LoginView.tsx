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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';

interface ClassUser {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  subtitle: string;
  avatar: string;
  xp?: number;
  level?: number;
  email?: string;
}

const CLASS_PROFILES: ClassUser[] = [
  { 
    id: 'prof-carla', 
    name: 'Prof.ª Carla', 
    role: 'teacher', 
    subtitle: 'Docente Titular de TIC', 
    avatar: 'teacher-helena',
    email: 'imaginebycarla2023@gmail.com'
  },
  { 
    id: 'aluno-alex', 
    name: 'Alex Ramos', 
    role: 'student', 
    subtitle: 'Aluno Demo • Nível 3', 
    avatar: 'alex',
    xp: 320,
    level: 3
  },
  { 
    id: 'aluno-leonor', 
    name: 'Leonor Santos', 
    role: 'student', 
    subtitle: 'Aluna • Nível 5', 
    avatar: 'leonor',
    xp: 920,
    level: 5
  },
  { 
    id: 'aluno-tiago', 
    name: 'Tiago Ferreira', 
    role: 'student', 
    subtitle: 'Aluno • Nível 5', 
    avatar: 'tiago',
    xp: 850,
    level: 5
  },
  { 
    id: 'aluno-beatriz', 
    name: 'Beatriz Costa', 
    role: 'student', 
    subtitle: 'Aluna • Nível 3', 
    avatar: 'beatriz',
    xp: 290,
    level: 3
  },
  { 
    id: 'aluno-duarte', 
    name: 'Duarte Lima', 
    role: 'student', 
    subtitle: 'Aluno • Nível 2', 
    avatar: 'duarte',
    xp: 210,
    level: 2
  },
  { 
    id: 'aluno-ines', 
    name: 'Inês Mendes', 
    role: 'student', 
    subtitle: 'Aluna • Nível 2', 
    avatar: 'ines',
    xp: 180,
    level: 2
  },
  { 
    id: 'aluno-miguel', 
    name: 'Miguel Rocha', 
    role: 'student', 
    subtitle: 'Aluno • Nível 2', 
    avatar: 'miguel',
    xp: 120,
    level: 2
  },
  { 
    id: 'aluno-sofia', 
    name: 'Sofia Martins', 
    role: 'student', 
    subtitle: 'Aluna • Nível 1', 
    avatar: 'sofia',
    xp: 90,
    level: 1
  }
];

export const LoginView: React.FC = () => {
  const { unifiedLogin, switchDemoUser } = useAuth();
  const { setCurrentView, addToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacherSelected = 
    identifier.toLowerCase().includes('carla') || 
    identifier.toLowerCase().includes('prof') ||
    identifier.toLowerCase() === 'imaginebycarla2023@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
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
            message: 'Painel da docente sincronizado com o Firestore.',
            type: 'success'
          });
          setCurrentView('teacher');
        } else {
          addToast({
            title: 'Sessão Iniciada!',
            message: `Bem-vindo à Missão TIC 6.º Ano.`,
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

  // Quick 1-click login for any profile (teacher or student)
  const handleQuickSelect = async (profile: ClassUser) => {
    setError(null);
    setLoading(true);

    if (profile.role === 'teacher') {
      setIdentifier(profile.email || 'imaginebycarla2023@gmail.com');
      setPassword('carlamso');
      const res = await unifiedLogin(profile.email || 'imaginebycarla2023@gmail.com', 'carlamso');
      setLoading(false);
      if (res.success) {
        addToast({
          title: 'Bem-vinda, Prof.ª Carla!',
          message: 'Painel da docente sincronizado com o Firestore.',
          type: 'success'
        });
        setCurrentView('teacher');
      } else {
        setError(res.error || 'Erro ao entrar como professora.');
      }
    } else {
      setIdentifier(profile.name);
      setPassword('');
      const res = await unifiedLogin(profile.id, '');
      setLoading(false);
      if (res.success) {
        addToast({
          title: `Bem-vindo, ${profile.name}!`,
          message: 'Sessão iniciada na Missão TIC 6.º Ano.',
          type: 'success'
        });
        setCurrentView('dashboard');
      } else {
        setError(res.error || 'Erro ao entrar como aluno.');
      }
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
              Aprende. Experimenta. Resolve. Cria.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Firestore Conectado</span>
          </span>
        </div>
      </div>

      {/* Main Single Unified Login Card */}
      <div className="max-w-3xl w-full mx-auto my-6 sm:my-8 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal de Entrada da Turma</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Entrar na Missão TIC
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Alunos e docente entram no mesmo portal. Escreve os teus dados ou escolhe o teu perfil da Turma 6.º A abaixo.
          </p>
        </div>

        {/* Unified Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-8">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/60 text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                placeholder="ex: Alex Ramos ou imaginebycarla2023@gmail.com"
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
              💡 <strong>Alunos</strong> acedem diretamente sem palavra-passe. A senha (<span className="font-mono text-slate-300">carlamso</span>) é apenas exigida para a conta da <strong>Prof.ª Carla</strong>.
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

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-4 bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Ou escolhe o teu perfil da turma
          </span>
        </div>

        {/* Quick Profiles Grid: Teacher & Students Together */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {CLASS_PROFILES.map(p => {
            const isTeacher = p.role === 'teacher';
            return (
              <button
                key={p.id}
                id={`btn-profile-${p.id}`}
                onClick={() => handleQuickSelect(p)}
                disabled={loading}
                className={`p-3.5 rounded-2xl border text-left transition-all group cursor-pointer flex items-center gap-3.5 ${
                  isTeacher
                    ? 'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-500/40 hover:border-indigo-400'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-blue-500/50'
                }`}
              >
                <div className="relative shrink-0">
                  <UserAvatar name={p.name} avatarId={p.avatar} size="md" />
                  {isTeacher && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded bg-indigo-600 text-[9px] font-bold text-white uppercase">
                      Prof
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`font-bold text-xs truncate ${isTeacher ? 'text-indigo-200 group-hover:text-white' : 'text-slate-200 group-hover:text-blue-400'}`}>
                      {p.name}
                    </p>
                    {p.xp && (
                      <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                        {p.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {p.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
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
