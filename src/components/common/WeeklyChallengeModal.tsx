import React, { useState } from 'react';
import { X, Trophy, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeeklyChallengeModal: React.FC = () => {
  const { activeWeeklyChallenge, closeWeeklyChallenge, claimWeeklyChallenge } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!activeWeeklyChallenge) return null;

  const challenge = activeWeeklyChallenge;

  const handleSelect = (id: string) => {
    if (!submitted) {
      setSelectedOption(id);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption) {
      setSubmitted(true);
      await claimWeeklyChallenge(challenge.id, selectedOption);
    }
  };

  const isCorrect = selectedOption === challenge.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Desafio da Semana • {challenge.difficulty}
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl">
                {challenge.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeWeeklyChallenge}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <p className="font-bold text-amber-950 mb-1">Cenário do Desafio:</p>
            {challenge.scenario}
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">
              {challenge.question}
            </h4>

            <div className="space-y-2">
              {challenge.options.map(opt => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {submitted && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
              isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
            }`}>
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="font-bold">
                    {isCorrect ? 'Resposta Correta!' : 'Não é a melhor resposta:'}
                  </strong>
                  <p className="mt-0.5 text-slate-700">{challenge.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700">
            Recompensa: +{challenge.xpReward} XP
          </span>

          <div className="flex gap-2">
            <button
              onClick={closeWeeklyChallenge}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Fechar
            </button>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Validar Resposta
              </button>
            ) : (
              <button
                onClick={closeWeeklyChallenge}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Concluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
