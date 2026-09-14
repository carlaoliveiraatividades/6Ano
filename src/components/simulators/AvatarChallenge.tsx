import React, { useState } from 'react';
import { Shield, CheckCircle2, Award, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AvatarChallenge: React.FC = () => {
  const { awardXp } = useApp();

  const fields = [
    {
      id: 'nome',
      label: 'Nome',
      val: 'Rui',
      correct: 'cuidado',
      hint: '🟠 Analisar com cuidado: Apenas o primeiro nome é aceitável, mas evitar nome completo oficial em perfis públicos.'
    },
    {
      id: 'foto',
      label: 'Fotografia',
      val: 'Avatar ilustrado / Desenho',
      correct: 'partilhar',
      hint: '🟢 Pode ser partilhado: Um avatar ou ilustração personalizada protege a identidade real do aluno.'
    },
    {
      id: 'escola',
      label: 'Escola',
      val: 'Escola Básica X',
      correct: 'cuidado',
      hint: '🟠 Analisar com cuidado: Indicar a escola exata permite associar a tua localização e horários.'
    },
    {
      id: 'localizacao',
      label: 'Localização',
      val: 'Lisboa (cidade geral)',
      correct: 'cuidado',
      hint: '🟠 Analisar com cuidado: Indicar o país ou cidade geral pode ser aceitável, mas nunca a morada ou rua exata.'
    },
    {
      id: 'password',
      label: 'Palavra-passe',
      val: 'Rui123',
      correct: 'privado',
      hint: '🔴 100% PRIVADO: Nunca divulgar palavras-passe! Além disso, "Rui123" é extremamente fraca e previsível.'
    },
    {
      id: 'interesses',
      label: 'Interesses',
      val: 'Futebol e Robótica',
      correct: 'partilhar',
      hint: '🟢 Pode ser partilhado: Gostos gerais, desportos e passatempos ajudam a encontrar amigos de forma segura.'
    }
  ];

  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleDecision = (fieldId: string, level: string) => {
    setDecisions(prev => ({ ...prev, [fieldId]: level }));
  };

  const allSelected = Object.keys(decisions).length === fields.length;
  const correctCount = fields.filter(f => decisions[f.id] === f.correct).length;

  const handleSubmit = () => {
    if (allSelected) {
      setCompleted(true);
      awardXp(40, 'Desafio Protege o teu Avatar superado!');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
            🛡️ Desafio: Protege o teu Avatar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            O Rui criou este perfil fictício. Ajuda-o a decidir o nível de privacidade para cada um dos 6 dados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(f => {
          const currentDecision = decisions[f.id];
          const isCorrect = currentDecision === f.correct;

          return (
            <div
              key={f.id}
              className={`p-4 rounded-2xl border transition-all ${
                currentDecision
                  ? isCorrect
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-amber-50/40 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {f.label}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-xs font-bold text-slate-800">
                  {f.val}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <button
                  onClick={() => handleDecision(f.id, 'partilhar')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                    currentDecision === 'partilhar'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  🟢 Partilhar
                </button>
                <button
                  onClick={() => handleDecision(f.id, 'cuidado')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                    currentDecision === 'cuidado'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  🟠 Cuidado
                </button>
                <button
                  onClick={() => handleDecision(f.id, 'privado')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                    currentDecision === 'privado'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white hover:bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  🔴 Privado
                </button>
              </div>

              {currentDecision && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  {f.hint}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-600 font-medium">
          Decisões tomadas: <span className="font-bold text-slate-900">{Object.keys(decisions).length}/6</span>
          {allSelected && (
            <span className="ml-2 font-bold text-emerald-600">
              ({correctCount} de 6 acertadas!)
            </span>
          )}
        </span>

        <button
          onClick={handleSubmit}
          disabled={!allSelected || completed}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            completed
              ? 'bg-emerald-600 text-white cursor-default'
              : allSelected
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{completed ? 'Desafio Superado! (+40 XP)' : 'Validar Perfil'}</span>
        </button>
      </div>
    </div>
  );
};
