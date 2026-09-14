import React from 'react';
import { Quote, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DAILY_QUOTES } from '../../data/dailyContent';

export const QuoteOfTheDayCard: React.FC = () => {
  const { openDailyQuote } = useApp();
  const currentQuote = DAILY_QUOTES[1]; // "Nem tudo o que aparece online é verdade." matching screenshot

  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-purple-50/70 to-indigo-100/40 rounded-3xl p-5 border border-purple-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
          <Quote className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
            Frase do Dia
          </span>
          <p className="text-slate-800 text-xs sm:text-sm font-semibold italic leading-snug mt-1">
            &ldquo;{currentQuote.quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-purple-200/60">
        <button
          onClick={() => openDailyQuote(currentQuote)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <span>Ver mais</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
