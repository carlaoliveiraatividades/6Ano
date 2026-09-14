import React, { useState } from 'react';
import { ArrowLeft, BookOpen, FlaskConical, Target, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { WORLDS_DATA } from '../data/worldsData';

// Simulators
import { PasswordSimulator } from '../components/simulators/PasswordSimulator';
import { PhishingSimulator } from '../components/simulators/PhishingSimulator';
import { PrivacySimulator } from '../components/simulators/PrivacySimulator';
import { AvatarChallenge } from '../components/simulators/AvatarChallenge';
import { NewsDetectiveSim } from '../components/simulators/NewsDetectiveSim';
import { CriadorSimulators } from '../components/simulators/CriadorSimulators';
import { EngenheiroSimulators } from '../components/simulators/EngenheiroSimulators';
import { AiSimulators } from '../components/simulators/AiSimulators';
import { WorldAssessmentModal } from '../components/assessments/WorldAssessmentModal';
import { RealMissionModal } from '../components/simulators/RealMissionModal';

export const WorldDetailView: React.FC = () => {
  const { selectedWorldId, activeWorldTab, setActiveWorldTab, setCurrentView } = useApp();
  const { user } = useAuth();

  const [showAssessment, setShowAssessment] = useState(false);
  const [showRealMission, setShowRealMission] = useState(false);

  const world = WORLDS_DATA.find(w => w.id === selectedWorldId) || WORLDS_DATA[0];
  const assessmentScore = user?.completedAssessments[world.id];

  const themeColors: Record<string, { bg: string; text: string; lightBg: string; border: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-200' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-200' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', lightBg: 'bg-indigo-50', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200' }
  };

  const currentTheme = themeColors[world.color] || themeColors.blue;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('worlds')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Mundos</span>
        </button>

        <button
          onClick={() => setShowAssessment(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-100" />
          <span>Avaliação Oficial ({assessmentScore !== undefined ? `${assessmentScore}%` : 'Fazer Teste'})</span>
        </button>
      </div>

      {/* World Hero Card */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden ${currentTheme.bg}`}>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Mundo {world.number} • TIC 6.º Ano
            </span>
            {assessmentScore !== undefined && assessmentScore >= 75 && (
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-900 text-xs font-bold">
                ✓ Concluído
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            {world.title}
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-medium mt-1">
            {world.summary}
          </p>

          <p className="text-xs sm:text-sm text-white/80 mt-3 leading-relaxed whitespace-pre-line">
            {world.description}
          </p>
        </div>
      </div>

      {/* 4 Pillars Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveWorldTab('aprende')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeWorldTab === 'aprende'
              ? `${currentTheme.bg} text-white shadow-xs`
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Aprende</span>
        </button>

        <button
          onClick={() => setActiveWorldTab('experimenta')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeWorldTab === 'experimenta'
              ? `${currentTheme.bg} text-white shadow-xs`
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>2. Experimenta (Simulador)</span>
        </button>

        <button
          onClick={() => setActiveWorldTab('resolve')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeWorldTab === 'resolve'
              ? `${currentTheme.bg} text-white shadow-xs`
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>3. Resolve (Desafios)</span>
        </button>

        <button
          onClick={() => setActiveWorldTab('cria')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeWorldTab === 'cria'
              ? `${currentTheme.bg} text-white shadow-xs`
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>4. Cria (Missão Real)</span>
        </button>
      </div>

      {/* Pillar Content Area */}
      <div>
        {/* PILLAR 1: APRENDE */}
        {activeWorldTab === 'aprende' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="space-y-4">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                Conteúdos Pedagógicos do {world.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {world.sections.descobre.map((sec, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{sec.title}</h3>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1.5 pl-9">
                      {sec.content.slice(0, 3).map((line, lIdx) => (
                        <p key={lIdx} className="leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Narrative */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h3 className="font-bold text-slate-900">Resumo Teórico Essencial:</h3>
              <p>
                No {world.title}, cada aluno desenvolve competências sólidas de literacia digital. É fundamental compreender que as ferramentas digitais são instrumentos poderosos que exigem sentido crítico, responsabilidade e regras claras de utilização.
              </p>
              <p>
                Avança para a secção <strong className="text-blue-600">Experimenta</strong> para testares os teus conhecimentos em simuladores práticos interativos!
              </p>
            </div>
          </div>
        )}

        {/* PILLAR 2: EXPERIMENTA (SIMULATORS) */}
        {activeWorldTab === 'experimenta' && (
          <div>
            {world.id === 'mundo-1' && (
              <div className="space-y-6">
                <PasswordSimulator />
                <PhishingSimulator />
              </div>
            )}
            {world.id === 'mundo-2' && <NewsDetectiveSim />}
            {world.id === 'mundo-3' && <CriadorSimulators />}
            {world.id === 'mundo-4' && <EngenheiroSimulators />}
            {world.id === 'mundo-5' && <AiSimulators />}
          </div>
        )}

        {/* PILLAR 3: RESOLVE (DILEMMAS & SITUATIONS) */}
        {activeWorldTab === 'resolve' && (
          <div>
            {world.id === 'mundo-1' && (
              <div className="space-y-6">
                <PrivacySimulator />
                <AvatarChallenge />
              </div>
            )}
            {world.id === 'mundo-2' && <NewsDetectiveSim />}
            {world.id === 'mundo-3' && <CriadorSimulators />}
            {world.id === 'mundo-4' && <EngenheiroSimulators />}
            {world.id === 'mundo-5' && <AiSimulators />}
          </div>
        )}

        {/* PILLAR 4: CRIA (REAL MISSION) */}
        {activeWorldTab === 'cria' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Produção Autêntica de Aluno
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mt-2">
                  {world.sections.missaoReal.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Aplica o que aprendeste numa missão do mundo real para a tua turma ou para ti próprio.
                </p>
              </div>

              <button
                onClick={() => setShowRealMission(true)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                Abrir Editor da Missão (+50 XP) &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
              <p><strong>Descrição da Missão:</strong> {world.sections.missaoReal.description}</p>
              <p className="text-slate-500">
                Ao clicares no botão acima podes redigir e submeter o teu trabalho. O professor terá acesso direto à tua submissão na área pedagógica.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Modal */}
      {showAssessment && (
        <WorldAssessmentModal
          worldId={world.id}
          onClose={() => setShowAssessment(false)}
        />
      )}

      {/* Real Mission Modal */}
      {showRealMission && (
        <RealMissionModal
          worldId={world.id}
          onClose={() => setShowRealMission(false)}
        />
      )}
    </div>
  );
};
