import React, { useState } from 'react';
import { X, Lock, Mail, CheckCircle2, AlertCircle, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginTeacher } = useAuth();
  const { setCurrentView, addToast } = useApp();
  const [email, setEmail] = useState('imaginebycarla2023@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await loginTeacher(password, email);
    setLoading(false);

    if (result.success) {
      addToast({
        title: 'Bem-vinda, Prof.ª Carla!',
        message: 'Sessão de professora iniciada com sucesso.',
        type: 'success'
      });
      setCurrentView('teacher');
      onClose();
    } else {
      setError(result.error || 'Credenciais inválidas. Confirme a palavra-passe.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Acesso Docente Exclusivo
            </span>
            <h2 className="font-display font-extrabold text-xl text-slate-900 mt-0.5">
              Login da Prof.ª Carla
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Esta plataforma foi configurada exclusivamente para a <strong>Prof.ª Carla</strong>. Não é necessário administrar nem criar novos professores.
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email do Professor
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                readOnly
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-medium text-slate-800 focus:outline-none cursor-default"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Único email docente associado à plataforma.
            </span>
          </div>

          <div>
            <div className="mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Palavra-passe
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Insere a palavra-passe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>A autenticar no Firestore...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entrar como Prof.ª Carla</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Credenciais:</span>
          <span className="font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            carlamso
          </span>
        </div>
      </div>
    </div>
  );
};
