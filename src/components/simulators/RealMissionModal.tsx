import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WORLDS_DATA } from '../../data/worldsData';

interface RealMissionModalProps {
  worldId: string;
  onClose: () => void;
}

export const RealMissionModal: React.FC<RealMissionModalProps> = ({ worldId, onClose }) => {
  const { completeMission, userSubmissions } = useApp();
  const world = WORLDS_DATA.find(w => w.id === worldId);

  const existing = userSubmissions[world?.sections.missaoReal.id || ''] || '';
  const [content, setContent] = useState(existing);
  const [saved, setSaved] = useState(!!existing);

  if (!world) return null;

  const mission = world.sections.missaoReal;

  const handleSubmit = () => {
    if (content.trim().length > 20) {
      completeMission(mission.id, 50, content);
      setSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Missão Real Autêntica
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl">
                {mission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-2">
            <p className="font-bold">{mission.description}</p>
            <p className="text-slate-600">
              Escreve com as tuas palavras a tua proposta. O teu trabalho fica guardado no teu portfólio digital e visível para o teu professor!
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                O Teu Trabalho / Produção Digital:
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {content.trim().length} carateres
              </span>
            </div>

            <textarea
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escreve aqui o teu trabalho detalhado, regras, passos ou recomendações..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Trabalho Submetido e Guardado (+50 XP)!</strong>
                <p className="mt-0.5">O teu portfólio foi atualizado. Podes editar a tua resposta sempre que quiseres aperfeiçoá-la.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            +50 XP ao submeter
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handleSubmit}
              disabled={content.trim().length < 15}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{saved ? 'Atualizar Trabalho' : 'Submeter Trabalho'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
