import React, { useState } from 'react';
import { Trophy, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GRAND_MISSION_DATA } from '../data/grandMissionData';

export const GrandMissionView: React.FC = () => {
  const { awardXp, awardBadge } = useApp();
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [stageAnswers, setStageAnswers] = useState<Record<number, string>>({});
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  const stages = GRAND_MISSION_DATA.stages;
  const currentStage = stages[activeStageIdx];

  const handleStageSubmit = () => {
    const text = stageAnswers[activeStageIdx] || '';
    if (text.trim().length > 20) {
      setCompletedStages(prev => [...new Set([...prev, activeStageIdx])]);
      awardXp(50, `Etapa ${currentStage.stepNumber} da Grande Missão concluída!`);

      if (completedStages.length + 1 === stages.length) {
        awardBadge('badge-mestre-tic', 'Distintivo MESTRE DA MISSÃO TIC!');
        awardXp(GRAND_MISSION_DATA.xpReward, 'Grande Missão Final concluída com distinção!');
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Desafio Culminante • Todos os 5 Mundos
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl mt-2 tracking-tight">
            🏆 {GRAND_MISSION_DATA.title}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-2 leading-relaxed whitespace-pre-line">
            {GRAND_MISSION_DATA.intro}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="px-3 py-1 rounded-xl bg-slate-900/40 text-amber-200 text-xs font-bold border border-white/10">
              Progresso: {completedStages.length} de {stages.length} etapas concluídas
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-200" />
              Prémio Total: +{GRAND_MISSION_DATA.xpReward} XP &amp; Distintivo Mestre TIC
            </span>
          </div>
        </div>
      </div>

      {/* 5 Stages Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stages.map((stg, idx) => {
          const isDone = completedStages.includes(idx);
          const isCurrent = activeStageIdx === idx;

          return (
            <button
              key={stg.id}
              onClick={() => setActiveStageIdx(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Etapa {stg.stepNumber}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] font-bold text-amber-700">+50 XP</span>
                )}
              </div>
              <h4 className="font-display font-bold text-xs text-slate-900 mt-2 leading-tight">
                {stg.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details & Solution Workspace */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {currentStage.pillar}
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mt-2">
              {currentStage.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {currentStage.description}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs font-bold text-amber-600">Recompensa</span>
            <p className="text-lg font-mono font-black text-slate-900">+50 XP</p>
          </div>
        </div>

        {/* Scenario */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-2">
          <p className="font-bold text-slate-900">Cenário da Situação:</p>
          <p className="whitespace-pre-line text-slate-700 leading-relaxed">{currentStage.scenario}</p>
          <p className="font-bold text-amber-900 pt-1">A tua tarefa: {currentStage.task}</p>
        </div>

        {/* Input area */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Apresenta a tua proposta para a Escola do Futuro:
          </label>
          <textarea
            rows={7}
            value={stageAnswers[activeStageIdx] || ''}
            onChange={e => setStageAnswers(prev => ({ ...prev, [activeStageIdx]: e.target.value }))}
            placeholder="Descreve as medidas, regras, fluxos ou soluções que propões para esta etapa..."
            className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Mínimo 20 carateres para submeter a etapa.
          </span>

          <button
            onClick={handleStageSubmit}
            disabled={(stageAnswers[activeStageIdx] || '').trim().length < 20}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              completedStages.includes(activeStageIdx)
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-xs cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{completedStages.includes(activeStageIdx) ? 'Etapa Concluída! (Atualizar)' : 'Submeter Etapa (+50 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
