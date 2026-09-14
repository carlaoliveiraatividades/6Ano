import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PasswordSimulator: React.FC = () => {
  const { completeSimulator } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customPassword, setCustomPassword] = useState<string>('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);

  const presetOptions = [
    { text: '123456', isBest: false, feedback: 'Extremamente fraca e previsível! Qualquer programa de ataque descobre em menos de 1 segundo.' },
    { text: 'maria2013', isBest: false, feedback: 'Fraca: utiliza um nome comum e o ano provável de nascimento, o que pessoas conhecidas adivinham facilmente.' },
    { text: 'gato123', isBest: false, feedback: 'Fraca: curta e muito previsível.' },
    { text: 'EuAdoroLerLivrosNoVerão', isBest: true, feedback: 'Excelente escolha! É uma frase-passe longa, única, fácil de memorizar para ti e quase impossível de adivinhar.' },
    { text: 'Futebol', isBest: false, feedback: 'Fraca: uma só palavra comum presente em dicionários.' }
  ];

  // Word blocks for building a passphrase
  const availableBlocks = [
    'O_Meu_Gato', 'Salta_Alto', 'Na_Praia', 'No_Verão',
    'Gosta_De_Manga', 'Laranja_Azul', 'Corre_Depressa', '2026!'
  ];

  const toggleWordBlock = (block: string) => {
    if (selectedWords.includes(block)) {
      setSelectedWords(prev => prev.filter(w => w !== block));
    } else {
      setSelectedWords(prev => [...prev, block]);
    }
  };

  const activePass = customPassword || selectedWords.join('_');

  const analyzePassword = (pwd: string) => {
    const length = pwd.length;
    let score = 0;
    const notes: string[] = [];

    if (length >= 16) {
      score += 50;
      notes.push('Comprimento excecional (+16 caracteres)');
    } else if (length >= 10) {
      score += 30;
      notes.push('Bom comprimento (10-15 caracteres)');
    } else if (length >= 6) {
      score += 15;
      notes.push('Comprimento curto (< 10 caracteres)');
    } else if (length > 0) {
      score += 5;
      notes.push('Demasiado curta');
    }

    if (pwd.includes('_') || pwd.includes(' ') || pwd.includes('-')) {
      score += 25;
      notes.push('Estrutura de frase com separadores');
    }

    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) {
      score += 15;
      notes.push('Mistura de maiúsculas e minúsculas');
    }

    if (/[0-9!@#$%^&*]/.test(pwd)) {
      score += 10;
      notes.push('Contém números ou símbolos');
    }

    let rating = 'Muito Fraca';
    let barColor = 'bg-red-500';
    if (score >= 75) {
      rating = 'Excelente (Inquebrável!)';
      barColor = 'bg-emerald-500';
    } else if (score >= 50) {
      rating = 'Boa e Segura';
      barColor = 'bg-blue-500';
    } else if (score >= 30) {
      rating = 'Razoável';
      barColor = 'bg-amber-500';
    }

    return { score, rating, barColor, notes };
  };

  const analysis = analyzePassword(activePass);

  const handleFinish = () => {
    setCompleted(true);
    completeSimulator('sim-password', 30);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              🔐 Constrói uma Password Forte
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Aprende porque o comprimento e a unicidade de uma frase são mais seguros do que palavras curtas.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Choose from presets */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          Parte 1: Das seguintes 5 opções, qual é a mais segura?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presetOptions.map((opt) => (
            <button
              key={opt.text}
              onClick={() => setSelectedOption(opt.text)}
              className={`p-3.5 rounded-xl border text-left font-mono text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                selectedOption === opt.text
                  ? opt.isBest
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                    : 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span>{opt.text}</span>
              {selectedOption === opt.text && (
                opt.isBest ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-500" />
              )}
            </button>
          ))}
        </div>

        {selectedOption && (
          <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm leading-relaxed">
            {presetOptions.find(o => o.text === selectedOption)?.isBest ? (
              <div className="text-emerald-800 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Boa escolha!</strong>
                  <p className="mt-1">
                    A opção escolhida é mais longa e muito menos previsível. Lembra-te: uma boa palavra-passe deve ser longa e única para cada serviço!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-700 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900">Análise da Opção:</strong>
                  <p className="mt-0.5 text-slate-600">
                    {presetOptions.find(o => o.text === selectedOption)?.feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Part 2: Passphrase Builder */}
      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-5 border border-blue-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Parte 2: Laboratório de Frases-passe
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Clica nos blocos de palavras abaixo para construir uma frase memorável ou escreve a tua:
            </p>
          </div>
          {selectedWords.length > 0 && (
            <button
              onClick={() => { setSelectedWords([]); setCustomPassword(''); }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Limpar
            </button>
          )}
        </div>

        {/* Word Blocks */}
        <div className="flex flex-wrap gap-2">
          {availableBlocks.map(block => {
            const isSelected = selectedWords.includes(block);
            return (
              <button
                key={block}
                onClick={() => toggleWordBlock(block)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                + {block}
              </button>
            );
          })}
        </div>

        {/* Display Password Input & Live Meter */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              A tua Palavra-passe em teste:
            </label>
            <input
              type="text"
              value={activePass}
              onChange={(e) => {
                setCustomPassword(e.target.value);
                setSelectedWords([]);
              }}
              placeholder="Clica nos blocos acima ou escreve aqui..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm sm:text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activePass.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Força: <span className="text-slate-900">{analysis.rating}</span></span>
                <span className="font-mono text-slate-500">{analysis.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${analysis.barColor}`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.notes.map((n, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    ✓ {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Ganha <span className="font-bold text-amber-600">+30 XP</span> ao concluir este simulador.
        </p>
        <button
          onClick={handleFinish}
          disabled={completed}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
            completed
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{completed ? 'Simulador Concluído! (+30 XP)' : 'Concluir Simulador'}</span>
        </button>
      </div>
    </div>
  );
};
