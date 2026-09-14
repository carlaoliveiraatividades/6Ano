import React from 'react';
import { X, Lightbulb, Quote, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DailyModals: React.FC = () => {
  const { activeDailyTip, closeDailyTip, activeDailyQuote, closeDailyQuote } = useApp();

  return (
    <>
      {/* Daily Tip Modal */}
      {activeDailyTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Dica Rápida do Dia
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-slate-900">
                    {activeDailyTip.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={closeDailyTip}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
              <p className="font-semibold text-emerald-950">&ldquo;{activeDailyTip.snippet}&rdquo;</p>
              <p className="text-slate-700">{activeDailyTip.fullTip}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeDailyTip}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Quote Modal */}
      {activeDailyQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                  <Quote className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                    Frase do Dia • Reflexão TIC
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-slate-900">
                    Pensamento Crítico Digital
                  </h3>
                </div>
              </div>

              <button
                onClick={closeDailyQuote}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-slate-800 leading-relaxed space-y-3">
              <p className="font-display font-extrabold text-base sm:text-lg text-purple-950 italic">
                &ldquo;{activeDailyQuote.quote}&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                {activeDailyQuote.context}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeDailyQuote}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Inspirador!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
