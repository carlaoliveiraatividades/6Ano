import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DAILY_TIPS } from '../../data/dailyContent';

export const QuickTipCard: React.FC = () => {
  const { openDailyTip } = useApp();
  const currentTip = DAILY_TIPS[0];

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-50/70 to-teal-100/40 rounded-3xl p-5 border border-emerald-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Dica Rápida
          </span>
          <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-snug mt-1">
            {currentTip.snippet}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-emerald-200/60">
        <button
          onClick={() => openDailyTip(currentTip)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <span>Saber mais</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
