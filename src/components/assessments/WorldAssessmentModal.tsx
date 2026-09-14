import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, Loader2 } from 'lucide-react';
import { useApp, AssessmentResult } from '../../context/AppContext';
import { WORLDS_DATA } from '../../data/worldsData';

interface WorldAssessmentModalProps {
  worldId: string;
  onClose: () => void;
}

export const WorldAssessmentModal: React.FC<WorldAssessmentModalProps> = ({ worldId, onClose }) => {
  const { submitAssessment } = useApp();
  const world = WORLDS_DATA.find(w => w.id === worldId);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverResult, setServerResult] = useState<AssessmentResult | null>(null);

  if (!world) return null;

  const questions = world.sections.avaliacao.questions;
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optId: string) => {
    if (!isSubmitted && !isSubmitting) {
      setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optId }));
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await submitAssessment(worldId, selectedAnswers);
    setIsSubmitting(false);
    if (res) {
      setServerResult(res);
      setIsSubmitted(true);
    } else {
      // Fallback in case of network glitch
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setIsSubmitted(false);
    setServerResult(null);
  };

  const passed = serverResult ? serverResult.passed : false;
  const scorePercent = serverResult ? serverResult.scorePercent : 0;
  const correctCount = serverResult ? serverResult.correctCount : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Avaliação Oficial de Conhecimentos • Firestore Verificado
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl">
                {world.sections.avaliacao.title}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <>
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Pergunta {currentQIndex + 1} de {questions.length}</span>
                <span className="font-mono">{Object.keys(selectedAnswers).length}/{questions.length} respondidas</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Content */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
                  Questão {currentQIndex + 1}
                </span>
                <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map(opt => {
                  const isSelected = selectedAnswers[currentQIndex] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(opt.label)}
                      disabled={isSubmitting}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg ring-8 ring-slate-50"
                style={{ backgroundColor: passed ? '#10b981' : '#f59e0b', color: '#fff' }}
              >
                {passed ? '🏆' : '📚'}
              </div>

              <div>
                <h4 className="font-display font-extrabold text-2xl text-slate-900">
                  {passed ? 'Parabéns! Foste Aprovado!' : 'Quase lá! Tenta Novamente!'}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Obtiveste <strong className="text-slate-900 font-bold">{correctCount}</strong> de {questions.length} corretas ({scorePercent}%).
                  {passed
                    ? ' O resultado e o distintivo foram registados no Firestore!'
                    : ' Precisas de pelo menos 75% para aprovação e desbloqueio do próximo Mundo.'}
                </p>
              </div>

              {/* Review answers list */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-200">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Revisão Pedagógica das Questões (Validada no Servidor):
                </h5>
                {serverResult?.questionFeedback.map((fb, idx) => {
                  const q = questions[idx];
                  const userAns = selectedAnswers[idx];

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                        fb.correct ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-red-50/50 border-red-200 text-red-950'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {fb.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{idx + 1}. {q.question}</p>
                          <p className="text-slate-600 mt-1">
                            <strong>A tua resposta:</strong> {userAns} | <strong>Resposta correta:</strong> {fb.correctAnswer}
                          </p>
                          <p className="mt-1 text-slate-700 font-medium">{fb.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0 || isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentQIndex] || isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Seguinte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length < questions.length || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A Avaliar no Servidor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submeter Avaliação Oficial</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir Teste</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Fechar e Concluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
