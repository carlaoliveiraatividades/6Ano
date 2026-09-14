import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NextMissionCard: React.FC = () => {
  const { openWorld } = useApp();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Próxima missão
        </span>

        <div className="flex items-center gap-3.5 mt-3">
          {/* Blue open book/tablet icon in rounded box matching screenshot */}
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs border border-sky-200">
            <BookOpen className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Completa o simulador
            </span>
            <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
              Constrói uma Password Forte
            </h4>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
              +30 XP
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => openWorld('mundo-1', 'experimenta')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <span>Continuar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
