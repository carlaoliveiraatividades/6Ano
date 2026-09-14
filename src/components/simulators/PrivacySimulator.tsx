import React, { useState } from 'react';
import { Eye, CheckCircle2, XCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrivacySimulator: React.FC = () => {
  const { completeSimulator } = useApp();

  const situations = [
    {
      id: 1,
      title: 'A tua password.',
      correct: 'nunca',
      explanation: '🔴 NUNCA PARTILHAR: A tua palavra-passe é a chave mestra da tua conta. Nem aos amigos mais chegados deves facultá-la.'
    },
    {
      id: 2,
      title: 'A morada de tua casa.',
      correct: 'nunca',
      explanation: '🔴 NÃO PUBLICAR: Divulgar a morada real coloca em risco a segurança física da tua família e da tua residência.'
    },
    {
      id: 3,
      title: 'Uma fotografia tua.',
      correct: 'cuidado',
      explanation: '🟠 PENSAR ANTES DE PUBLICAR: Pensa quem vai ver, se o perfil é público e se a imagem não revela a escola ou detalhes íntimos.'
    },
    {
      id: 4,
      title: 'Uma fotografia de um amigo.',
      correct: 'cuidado',
      explanation: '🟠 PERGUNTAR PRIMEIRO: O direito à imagem exige sempre pedir consentimento à outra pessoa antes de qualquer publicação.'
    },
    {
      id: 5,
      title: 'A tua localização em tempo real.',
      correct: 'nunca',
      explanation: '🔴 NÃO PUBLICAR: Saber onde estás ao segundo permite que desconhecidos saibam quando estás sozinho ou fora de casa.'
    },
    {
      id: 6,
      title: 'Uma fotografia do teu cão.',
      correct: 'seguro',
      explanation: '🟢 NORMALMENTE PODE SER PARTILHADA: Desde que a imagem não mostre o número da porta de casa nem a coleira com o teu telemóvel.'
    },
    {
      id: 7,
      title: 'A tua data de nascimento completa.',
      correct: 'cuidado',
      explanation: '🟠 TER CUIDADO: A data de nascimento completa é muito usada para recuperação de contas e roubo de identidade.'
    }
  ];

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleSelect = (sitId: number, category: string) => {
    setAnswers(prev => ({ ...prev, [sitId]: category }));
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = situations.filter(s => answers[s.id] === s.correct).length;

  const handleFinish = () => {
    if (answeredCount === situations.length) {
      setCompleted(true);
      completeSimulator('sim-privacy', 30);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
            🕵️ O Que Posso Partilhar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Classifica cada uma das 7 situações: Nunca Partilhar, Cuidado / Perguntar, ou Normalmente Seguro.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {situations.map(s => {
          const userChoice = answers[s.id];
          const isSelected = !!userChoice;
          const isCorrect = userChoice === s.correct;

          return (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border transition-all ${
                isSelected
                  ? isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {s.id}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                    &ldquo;{s.title}&rdquo;
                  </span>
                </div>

                {/* 3 Categories Options */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelect(s.id, 'nunca')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      userChoice === 'nunca'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white hover:bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span>🔴 Nunca / Não Publicar</span>
                  </button>

                  <button
                    onClick={() => handleSelect(s.id, 'cuidado')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      userChoice === 'cuidado'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span>🟠 Cuidado / Perguntar</span>
                  </button>

                  <button
                    onClick={() => handleSelect(s.id, 'seguro')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      userChoice === 'seguro'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span>🟢 Seguro</span>
                  </button>
                </div>
              </div>

              {/* Feedback explanation after selection */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs sm:text-sm flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-slate-700">{s.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-600">
          Progresso: <span className="font-bold text-slate-900">{answeredCount}/{situations.length}</span> respondidas
          {answeredCount > 0 && (
            <span className="ml-2 font-bold text-emerald-600">
              ({correctCount} corretas)
            </span>
          )}
        </div>

        <button
          onClick={handleFinish}
          disabled={answeredCount < situations.length || completed}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            completed
              ? 'bg-emerald-600 text-white cursor-default'
              : answeredCount === situations.length
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{completed ? 'Concluído com Sucesso! (+30 XP)' : 'Concluir Classificação'}</span>
        </button>
      </div>
    </div>
  );
};
