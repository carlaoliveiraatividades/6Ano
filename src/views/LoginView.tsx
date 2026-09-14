import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Database,
  Users,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';

const CLASSMATES = [
  { id: 'aluno-alex', name: 'Alex Ramos', xp: 320, level: 3, avatar: 'alex', isDefault: true },
  { id: 'aluno-leonor', name: 'Leonor Santos', xp: 920, level: 5, avatar: 'leonor' },
  { id: 'aluno-tiago', name: 'Tiago Ferreira', xp: 850, level: 5, avatar: 'tiago' },
  { id: 'aluno-beatriz', name: 'Beatriz Costa', xp: 290, level: 3, avatar: 'beatriz' },
  { id: 'aluno-duarte', name: 'Duarte Lima', xp: 210, level: 2, avatar: 'duarte' },
  { id: 'aluno-ines', name: 'Inês Mendes', xp: 180, level: 2, avatar: 'ines' },
  { id: 'aluno-miguel', name: 'Miguel Rocha', xp: 120, level: 2, avatar: 'miguel' },
  { id: 'aluno-sofia', name: 'Sofia Martins', xp: 90, level: 1, avatar: 'sofia' },
];

export const LoginView: React.FC = () => {
  const { login, loginTeacher, switchDemoUser } = useAuth();
  const { setCurrentView, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [customStudentName, setCustomStudentName] = useState('');
  const [teacherEmail] = useState('imaginebycarla2023@gmail.com');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student Login Handler
  const handleStudentLogin = async (studentId: string, studentName?: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(studentId, 'student');
      addToast({
        title: `Bem-vindo, ${studentName || 'Aluno'}!`,
        message: 'Sessão iniciada na Missão TIC 6.º Ano.',
        type: 'success'
      });
      setCurrentView('dashboard');
    } catch (err: any) {
      setError('Erro ao aceder à conta do aluno.');
    } finally {
      setLoading(false);
    }
  };

  // Custom Student Name Submit
  const handleCustomStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStudentName.trim()) return;
    handleStudentLogin('aluno-alex', customStudentName.trim());
  };

  // Teacher Login Handler
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await loginTeacher(teacherPassword);
    setLoading(false);

    if (result.success) {
      addToast({
        title: 'Bem-vinda, Prof.ª Carla!',
        message: 'Painel da docente sincronizado com o Firestore.',
        type: 'success'
      });
      setCurrentView('teacher');
    } else {
      setError(result.error || 'Credenciais inválidas. Confirme a palavra-passe.');
    }
  };

  // Admin Login Handler
  const handleAdminLogin = async () => {
    setLoading(true);
    await switchDemoUser('admin');
    setLoading(false);
    addToast({
      title: 'Modo Administrador TIC',
      message: 'Acesso às configurações técnicas do sistema.',
      type: 'info'
    });
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-500 selection:text-white">
      {/* Top Header Branding */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
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

      {/* Main Login Container */}
      <div className="max-w-4xl w-full mx-auto my-6 sm:my-10 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal de Entrada da Turma</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Escolhe como queres entrar
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Acede como aluno da turma para explorar os 5 mundos ou entra com as credenciais exclusivas da <strong>Prof.ª Carla</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-950/70 border border-slate-800 rounded-2xl max-w-md mx-auto mb-8">
          <button
            id="tab-btn-student"
            type="button"
            onClick={() => {
              setActiveTab('student');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Área do Aluno</span>
          </button>
          <button
            id="tab-btn-teacher"
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Prof.ª Carla (Docente)</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 max-w-md mx-auto p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Student Area */}
        {activeTab === 'student' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Featured Student Demo (Alex) */}
            <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-3xl shadow-inner">
                    👨‍🚀
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-[10px] font-bold text-white uppercase">
                    Demo
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-display font-bold text-lg text-white">Alex Ramos</h3>
                    <span className="text-[11px] font-semibold text-blue-300 bg-blue-950 px-2 py-0.5 rounded-md border border-blue-800">
                      Turma 6.º A
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Nível 3 • Explorador Digital • 320 XP • Pronto para o Mundo 2
                  </p>
                </div>
              </div>

              <button
                id="btn-login-alex"
                onClick={() => handleStudentLogin('aluno-alex', 'Alex Ramos')}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Entrar como Aluno Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Other Classmates in Turma 6.º A */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ou entra como outro aluno da Turma 6.º A:
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CLASSMATES.filter(c => c.id !== 'aluno-alex').map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleStudentLogin(c.id, c.name)}
                    disabled={loading}
                    className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <UserAvatar name={c.name} avatarId={c.avatar} size="sm" />
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        +{c.xp} XP
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Nível {c.level}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Name */}
            <form onSubmit={handleCustomStudentSubmit} className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={customStudentName}
                onChange={e => setCustomStudentName(e.target.value)}
                placeholder="Ou escreve o teu nome de aluno..."
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!customStudentName.trim() || loading}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Entrar com este Nome
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Teacher Exclusive Portal (Prof.ª Carla) */}
        {activeTab === 'teacher' && (
          <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-indigo-100 mb-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Docente Titular Exclusiva</span>
              </div>
              Esta plataforma educativa foi concebida exclusivamente para a <strong>Prof.ª Carla</strong>. Não é necessário administrar nem criar novos professores.
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email da Docente
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    readOnly
                    value={teacherEmail}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-indigo-300 cursor-default focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Identificador único registado no Firestore.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Palavra-passe Docente
                  </label>
                  <button
                    type="button"
                    onClick={() => setTeacherPassword('carlamso')}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Preencher demo (carlamso)
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={teacherPassword}
                    onChange={e => setTeacherPassword(e.target.value)}
                    placeholder="Insere a palavra-passe..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-teacher"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>A validar no Firestore...</span>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Entrar no Painel da Prof.ª Carla</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Palavra-passe de demonstração:</span>
              <span className="font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                carlamso
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Discreet Link for Admin and Copyright */}
      <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-4 border-t border-slate-800/60">
        <div>
          Missão TIC • Disciplina de TIC do 6.º Ano de Escolaridade • Portugal
        </div>

        <button
          onClick={handleAdminLogin}
          className="text-slate-400 hover:text-slate-200 transition-colors text-[11px] hover:underline cursor-pointer"
        >
          Acesso Técnico (Administrador TIC)
        </button>
      </div>
    </div>
  );
};
