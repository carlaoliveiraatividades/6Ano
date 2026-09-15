import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  FlaskConical, 
  Target, 
  Sparkles, 
  Trophy, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Send, 
  FileCheck, 
  Compass, 
  Shield, 
  Lock,
  HelpCircle,
  Clock,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';
import { useApp, WorldStageTab, AssessmentResult } from '../context/AppContext';
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
import { BADGES } from '../data/initialData';

export const WorldDetailView: React.FC = () => {
  const { selectedWorldId, activeWorldTab, setActiveWorldTab, setCurrentView, openWorld, submitAssessment, completeMission, triggerCelebration } = useApp();
  const { user } = useAuth();

  const world = WORLDS_DATA.find(w => w.id === selectedWorldId) || WORLDS_DATA[0];
  const assessmentScore = user?.completedAssessments?.[world.id];
  const isWorldPassed = assessmentScore !== undefined && assessmentScore >= 75;

  // Normalize legacy tab names to 6-stage names
  const currentTab: WorldStageTab = 
    activeWorldTab === 'aprende' ? 'descobre' :
    activeWorldTab === 'resolve' ? 'desafio' :
    activeWorldTab === 'cria' ? 'missao-real' :
    activeWorldTab;

  // Mini-quizzes state in "Descobre"
  const [descobreAnswers, setDescobreAnswers] = useState<Record<string, string>>({});
  const [descobreSubmitted, setDescobreSubmitted] = useState<Record<string, boolean>>({});

  // Real mission state
  const [missionText, setMissionText] = useState('');
  const [missionSubmitted, setMissionSubmitted] = useState(user?.completedMissions?.includes(world.id) || false);
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);

  // Assessment state
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const themeColors: Record<string, { bg: string; text: string; lightBg: string; border: string; activeRing: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', activeRing: 'ring-blue-500' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-200', activeRing: 'ring-amber-500' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-200', activeRing: 'ring-emerald-500' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', lightBg: 'bg-indigo-50', border: 'border-indigo-200', activeRing: 'ring-indigo-500' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200', activeRing: 'ring-purple-500' }
  };

  const currentTheme = themeColors[world.color] || themeColors.blue;
  const worldBadge = BADGES.find(b => b.id === world.badgeId);

  // Stages configuration
  const STAGES: { id: WorldStageTab; number: number; label: string; icon: any; shortDesc: string }[] = [
    { id: 'descobre', number: 1, label: 'Descobre', icon: BookOpen, shortDesc: 'Narrativa & Teoria' },
    { id: 'experimenta', number: 2, label: 'Experimenta', icon: FlaskConical, shortDesc: 'Simuladores Práticos' },
    { id: 'desafio', number: 3, label: 'Desafio', icon: Target, shortDesc: 'Decisões & Problemas' },
    { id: 'missao-real', number: 4, label: 'Missão Real', icon: Sparkles, shortDesc: 'Produção Autêntica' },
    { id: 'avaliacao', number: 5, label: 'Avaliação', icon: Trophy, shortDesc: 'Teste Oficial (Server)' },
    { id: 'recompensa', number: 6, label: 'Recompensa', icon: Award, shortDesc: 'Distintivo & Conquista' }
  ];

  // Specific narrative details per world for "Descobre"
  const NARRATIVE_CONTEXT: Record<string, {
    location: string;
    threat: string;
    learn: string[];
    importance: string;
    studentRole: string;
  }> = {
    'mundo-1': {
      location: 'Cidadela da Segurança Digital • Fortaleza das Contas',
      threat: 'Tentativas crescentes de phishing, passwords fracas e partilhas imprudentes de dados privados que ameaçam a privacidade.',
      learn: [
        'Criar palavras-passe longas, únicas e memoráveis',
        'Detetar pistas de phishing em emails, SMS e redes sociais',
        'Controlar a privacidade e compreender a pegada digital duradoura',
        'Adotar hábitos ergonómicos saudáveis de postura e pausas visuais'
      ],
      importance: 'No 6.º ano, começas a gerir contas escolares, emails e jogos online. Saber proteger as tuas credenciais evita roubo de identidade e perdas de acesso.',
      studentRole: 'És o Guardião Digital. A tua missão é auditar a tua segurança pessoal e ensinar as melhores práticas à tua turma e família.'
    },
    'mundo-2': {
      location: 'Arquivo Central da Informação • Labirinto da Web',
      threat: 'Desinformação, boatos virais e notícias falsas que circulam rapidamente nas redes e enganam os cibernautas.',
      learn: [
        'Construir pesquisas eficientes com operadores e palavras-chave precisas',
        'Aplicar o método das 5 Perguntas de Ouro para avaliar fontes',
        'Distinguir factos comprovados de opiniões e boatos manipulados',
        'Verificar imagens fora de contexto e notícias sensacionalistas'
      ],
      importance: 'Nem tudo o que está na Internet é verdade. A capacidade de distinguir fontes fidedignas é um superpoder essencial para os teus estudos e vida cívica.',
      studentRole: 'És o Detetive da Informação. A tua missão é investigar notícias suspeitas, recolher provas e separar os factos da desinformação.'
    },
    'mundo-3': {
      location: 'Estúdio Criativo Digital • Praça da Colaboração',
      threat: 'Plágio não intencional, uso indevido de obras protegidas por direitos de autor e falta de netiqueta em canais digitais.',
      learn: [
        'Estruturar emails formais e informais com assunto, Para, CC e BCC',
        'Praticar regras de ouro da netiqueta e comunicação respeitosa',
        'Compreender direitos de autor e licenças Creative Commons (CC)',
        'Citar fontes corretamente e evitar o plágio em trabalhos escolares'
      ],
      importance: 'Criar e partilhar conteúdos digitais exige respeito pelo trabalho alheio e uma comunicação ética com professores e colegas.',
      studentRole: 'És o Criador Digital. A tua missão é produzir trabalhos de excelência com licenciamento transparente e comunicação exemplar.'
    },
    'mundo-4': {
      location: 'Laboratório de Automação • Núcleo de Algoritmos',
      threat: 'Processos ineficientes, bugs lógicos e problemas complexos que precisam de ser decompostos e automatizados.',
      learn: [
        'Dominar os 4 pilares do pensamento computacional: Decomposição, Padrões, Abstração e Algoritmos',
        'Construir sequências lógicas, condições (Se... Então) e ciclos de repetição',
        'Depurar erros e encontrar bugs de execução em programas',
        'Organizar e interpretar dados em tabelas de informação'
      ],
      importance: 'Programar não é apenas escrever código: é treinar o cérebro para resolver qualquer problema difícil passo a passo com clareza.',
      studentRole: 'És o Engenheiro Digital. A tua missão é programar robôs virtuais, otimizar fluxos e resolver enigmas lógicos.'
    },
    'mundo-5': {
      location: 'Observatório de Inteligência Artificial • Fronteira do Futuro',
      threat: 'Uso cego de respostas geradas por IA sem verificação, gerando alucinações, enviesamentos e dependência tecnológica.',
      learn: [
        'Compreender o que é a IA e como aprende com dados (Machine Learning)',
        'Escrever prompts estruturados com contexto, instruções claras e restrições',
        'Identificar alucinações factuais e enviesamentos (bias) nos modelos',
        'Usar a IA como assistente de aprendizagem responsável e ético'
      ],
      importance: 'A inteligência artificial está a transformar o mundo. Quem compreende o seu funcionamento e limites usa-a com vantagem e sentido crítico.',
      studentRole: 'És o Explorador da IA. A tua missão é dominar a engenharia de prompts, testar os limites dos modelos e promover um uso ético.'
    }
  };

  const narrative = NARRATIVE_CONTEXT[world.id] || NARRATIVE_CONTEXT['mundo-1'];

  // Handle Assessment Submission
  const handleAssessmentSubmit = async () => {
    setIsSubmittingAssessment(true);
    try {
      const res = await submitAssessment(world.id, assessmentAnswers);
      if (res) {
        setAssessmentResult(res);
        if (res.passed) {
          triggerCelebration();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  // Handle Real Mission Submit
  const handleMissionSubmit = async () => {
    if (missionText.trim().length < 25) return;
    setIsSubmittingMission(true);
    try {
      await completeMission(world.id, missionText);
      setMissionSubmitted(true);
      triggerCelebration();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingMission(false);
    }
  };

  // Next World helper
  const getNextWorldId = () => {
    const num = world.number;
    if (num < 5) return `mundo-${num + 1}`;
    return null;
  };

  const nextWorldId = getNextWorldId();
  const nextWorld = WORLDS_DATA.find(w => w.id === nextWorldId);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Bar with Back Button & Assessment Quick Link */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-worlds"
          onClick={() => setCurrentView('worlds')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Lista de Mundos</span>
        </button>

        <div className="flex items-center gap-2">
          {isWorldPassed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Avaliação Concluída: {assessmentScore}%</span>
            </span>
          ) : (
            <button
              onClick={() => setActiveWorldTab('avaliacao')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-100" />
              <span>Fazer Avaliação Oficial (+100 XP)</span>
            </button>
          )}
        </div>
      </div>

      {/* World Hero Header */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden ${currentTheme.bg}`}>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Mundo {world.number} • TIC 6.º Ano
            </span>
            <span className="px-3 py-1 rounded-full bg-black/20 text-xs font-mono font-medium backdrop-blur-xs">
              {world.theme}
            </span>
            {isWorldPassed && (
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Mundo Conquistado</span>
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            {world.title}
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-medium mt-1">
            {world.summary}
          </p>
        </div>
      </div>

      {/* 6-STAGE PROGRESSION NAV BAR */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-1 pb-2">
          Ciclo de Aprendizagem Pedagógica (6 Etapas):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = currentTab === stage.id;
            
            // Check completion indicators
            const isCompleted = 
              (stage.id === 'descobre' && Object.keys(descobreSubmitted).length > 0) ||
              (stage.id === 'experimenta' && Boolean(user?.completedSimulators?.some(s => s.includes(world.id) || s.startsWith('sim-')))) ||
              (stage.id === 'desafio' && Boolean(user?.completedActivities?.some(a => a.includes(world.id) || a.startsWith('sim-')))) ||
              (stage.id === 'missao-real' && (missionSubmitted || Boolean(user?.completedMissions?.includes(world.id)))) ||
              (stage.id === 'avaliacao' && isWorldPassed) ||
              (stage.id === 'recompensa' && Boolean(user?.badges?.includes(world.badgeId)));

            return (
              <button
                key={stage.id}
                id={`stage-nav-${stage.id}`}
                onClick={() => setActiveWorldTab(stage.id)}
                className={`py-2.5 px-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? `${currentTheme.bg} text-white border-transparent shadow-xs`
                    : isCompleted
                    ? 'bg-slate-50 border-emerald-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stage.number}.
                  </span>
                  {isCompleted && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold truncate">{stage.label}</span>
                </div>
                <span className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                  {stage.shortDesc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STAGE: DESCOBRE (NARRATIVE ADVENTURE & THEORY) */}
      {/* ========================================================================= */}
      {currentTab === 'descobre' && (
        <div className="space-y-6">
          {/* Narrative Storyline Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Narrativa da Missão</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {narrative.location}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Context & Threat */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    📍 Onde estás?
                  </h3>
                  <p className="text-sm font-semibold text-white mt-1">
                    {narrative.location}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    ⚠️ O Problema e Desafio Digital:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {narrative.threat}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    💡 Porque é Importante para Ti?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {narrative.importance}
                  </p>
                </div>
              </div>

              {/* Right Column: What you'll learn & Your Role */}
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>🎯 O que vais aprender:</span>
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {narrative.learn.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    🧑‍🚀 O Teu Papel de Explorador:
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
                    &ldquo;{narrative.studentRole}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Curricular Theory Topics with Quick-Check Quizzes */}
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              Conceitos Fundamentais do {world.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {world.sections.descobre.map((sec, secIdx) => (
                <div key={secIdx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {secIdx + 1}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{sec.title}</h3>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed pl-10">
                      {sec.content.map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>

                    {/* Good / Bad Examples if present */}
                    {sec.examples && (
                      <div className="mt-3 pl-10 space-y-2 text-xs">
                        {sec.examples.bad && sec.examples.bad.length > 0 && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                            <span className="font-bold block text-rose-700">❌ Exemplos a Evitar:</span>
                            {sec.examples.bad.map((b, bIdx) => (
                              <p key={bIdx} className="font-mono text-[11px]">{b}</p>
                            ))}
                          </div>
                        )}
                        {sec.examples.good && sec.examples.good.length > 0 && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                            <span className="font-bold block text-emerald-700">✓ Exemplo Recomendado:</span>
                            {sec.examples.good.map((g, gIdx) => (
                              <p key={gIdx} className="font-mono text-[11px]">{g}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Important Note */}
                    {sec.importantNote && (
                      <div className="mt-3 pl-10 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="font-bold block text-amber-800">💡 Nota Importante:</span>
                        <p className="leading-relaxed">{sec.importantNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Quick-Check Quiz if present */}
                  {sec.quickQuiz && sec.quickQuiz.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                        <span>Verificação Rápida de Compreensão</span>
                      </span>

                      {sec.quickQuiz.map((quiz, qIdx) => {
                        const qKey = `${secIdx}_${qIdx}`;
                        const selectedOpt = descobreAnswers[qKey];
                        const isSubmittedQ = descobreSubmitted[qKey];
                        const isCorrect = selectedOpt === quiz.correctAnswer;

                        return (
                          <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <p className="text-xs font-bold text-slate-800">{quiz.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {quiz.options.map((opt) => (
                                <button
                                  key={opt.label}
                                  type="button"
                                  onClick={() => {
                                    setDescobreAnswers(prev => ({ ...prev, [qKey]: opt.label }));
                                    setDescobreSubmitted(prev => ({ ...prev, [qKey]: true }));
                                  }}
                                  className={`p-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                                    isSubmittedQ && opt.label === quiz.correctAnswer
                                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                      : isSubmittedQ && selectedOpt === opt.label && !isCorrect
                                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                                      : selectedOpt === opt.label
                                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {opt.label}
                                  </span>
                                  <span className="truncate">{opt.text}</span>
                                </button>
                              ))}
                            </div>

                            {isSubmittedQ && (
                              <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                                isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                              }`}>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                )}
                                <span className="leading-relaxed">{quiz.feedback}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stage Advancement Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Concluíste a leitura e exploração da teoria?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Avança agora para a etapa de experimentação prática em simuladores interativos!
              </p>
            </div>

            <button
              id="btn-advance-to-experimenta"
              onClick={() => setActiveWorldTab('experimenta')}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Avançar para: 2. EXPERIMENTA (Simuladores)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STAGE: EXPERIMENTA (HANDS-ON SIMULATORS) */}
      {/* ========================================================================= */}
      {currentTab === 'experimenta' && (
        <div className="space-y-6">
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-blue-950">
                  Laboratório de Experimentação Prática
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  Interage diretamente com as ferramentas. Cada simulador concluído regista XP e grava o teu progresso no Firestore.
                </p>
              </div>
            </div>
          </div>

          {/* Render World-Specific Simulator */}
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

          {/* Bottom Stage Advancement Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Já experimentaste os simuladores deste Mundo?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Passa agora à resolução de dilemas e situações desafiantes da vida real.
              </p>
            </div>

            <button
              id="btn-advance-to-desafio"
              onClick={() => setActiveWorldTab('desafio')}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Avançar para: 3. DESAFIO (Decisões)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STAGE: DESAFIO (DECISIONS, PROBLEMS & DILEMMAS) */}
      {/* ========================================================================= */}
      {currentTab === 'desafio' && (
        <div className="space-y-6">
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-amber-950">
                  Desafio de Aplicação & Pensamento Crítico
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Aplica o teu conhecimento para tomar as melhores decisões e resolver problemas práticos com explicação detalhada.
                </p>
              </div>
            </div>
          </div>

          {/* Render World-Specific Challenges */}
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

          {/* Bottom Stage Advancement Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Desafios superados com sucesso?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Passa à Missão Real e cria a tua produção autêntica para o teu portfólio digital.
              </p>
            </div>

            <button
              id="btn-advance-to-missao-real"
              onClick={() => setActiveWorldTab('missao-real')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Avançar para: 4. MISSÃO REAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STAGE: MISSÃO REAL (AUTHENTIC PRODUCTION) */}
      {/* ========================================================================= */}
      {currentTab === 'missao-real' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Produção Autêntica • Missão Real do 6.º Ano
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-2">
                  {world.sections.missaoReal.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {world.sections.missaoReal.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                  +50 XP Recompensa
                </span>
              </div>
            </div>

            {/* Mission Guidelines */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-3 leading-relaxed">
              <p className="font-bold">Instruções da Missão:</p>
              <p>{world.sections.missaoReal.description}</p>
              {world.sections.missaoReal.placeholderExamples && (
                <div className="pt-2 border-t border-emerald-200/60">
                  <span className="font-semibold block text-emerald-900 mb-1">Exemplos de tópicos a abordar:</span>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-800">
                    {world.sections.missaoReal.placeholderExamples.map((ex, exIdx) => (
                      <li key={exIdx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submission Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>A Tua Resposta / Trabalho Autêntico:</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {missionText.trim().length} carateres (mínimo 25)
                </span>
              </div>

              <textarea
                id="input-mission-text"
                rows={8}
                value={missionText}
                onChange={e => setMissionText(e.target.value)}
                placeholder="Redige aqui as tuas regras, proposta, algoritmo ou reflexão com as tuas próprias palavras..."
                className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-slate-500">
                  💡 A tua submissão é gravada no Firestore e fica visível para a tua docente na área de acompanhamento de turmas.
                </p>

                <button
                  id="btn-submit-mission"
                  type="button"
                  onClick={handleMissionSubmit}
                  disabled={isSubmittingMission || missionText.trim().length < 25}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingMission ? 'A gravar no Firestore...' : missionSubmitted ? 'Atualizar Submissão' : 'Submeter Missão (+50 XP)'}</span>
                </button>
              </div>

              {missionSubmitted && (
                <div className="p-4 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Excelente trabalho! A tua Missão Real foi guardada com sucesso no Firestore.</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stage Advancement Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Pronto para a Avaliação Oficial?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Testa agora os teus conhecimentos no teste oficial do Mundo (4 perguntas calculadas no servidor).
              </p>
            </div>

            <button
              id="btn-advance-to-avaliacao"
              onClick={() => setActiveWorldTab('avaliacao')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Avançar para: 5. AVALIAÇÃO OFICIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STAGE: AVALIAÇÃO (SERVER-AUTHORITATIVE TEST) */}
      {/* ========================================================================= */}
      {currentTab === 'avaliacao' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                  Avaliação Oficial de Conhecimentos • Classificação Server-Side
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-2">
                  {world.sections.avaliacao.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {world.sections.avaliacao.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
                  Nota mínima: 75% • +100 XP
                </span>
              </div>
            </div>

            {/* Assessment UI */}
            {!assessmentResult ? (
              <div className="space-y-6">
                {/* Questions List */}
                <div className="space-y-6">
                  {world.sections.avaliacao.questions.map((q, qIdx) => {
                    const selected = assessmentAnswers[qIdx];

                    return (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-md">
                            Pergunta {qIdx + 1} de {world.sections.avaliacao.questions.length}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                          {q.question}
                        </h4>

                        <div className="space-y-2 pt-1">
                          {q.options.map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: opt.label }))}
                              className={`w-full p-3 rounded-xl text-left text-xs font-medium transition-all cursor-pointer flex items-center gap-3 border ${
                                selected === opt.label
                                  ? 'bg-indigo-100 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                                selected === opt.label ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {opt.label}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    {Object.keys(assessmentAnswers).length} de {world.sections.avaliacao.questions.length} perguntas respondidas
                  </div>

                  <button
                    id="btn-submit-assessment"
                    type="button"
                    onClick={handleAssessmentSubmit}
                    disabled={isSubmittingAssessment || Object.keys(assessmentAnswers).length < world.sections.avaliacao.questions.length}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>{isSubmittingAssessment ? 'A calcular no servidor...' : 'Submeter Avaliação Oficial'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Assessment Results from Server */
              <div className="space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl text-center space-y-3 ${
                  assessmentResult.passed
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                }`}>
                  <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
                    {assessmentResult.passed ? '🏆' : '📚'}
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl">
                    {assessmentResult.passed ? 'Parabéns! Foste Aprovado!' : 'Ainda não foi desta...'}
                  </h3>

                  <p className="text-sm font-medium text-white/90">
                    {assessmentResult.passed
                      ? `Obtiveste ${assessmentResult.scorePercent}% (${assessmentResult.correctCount}/${assessmentResult.totalQuestions} certas). Ganhaste +100 XP e o distintivo deste Mundo!`
                      : `Obtiveste ${assessmentResult.scorePercent}%. É necessário pelo menos 75% para passar. Revê os conteúdos e tenta de novo!`}
                  </p>

                  <div className="pt-2">
                    <span className="px-4 py-1.5 rounded-full bg-black/20 text-xs font-mono font-bold backdrop-blur-xs">
                      Classificação Validada pelo Servidor
                    </span>
                  </div>
                </div>

                {/* Per-question feedback */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800">
                    Correção Detalhada com Justificação Pedagógica:
                  </h4>

                  {assessmentResult.questionFeedback.map((fb, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                        fb.correct
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/80 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {fb.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>Questão {fb.questionIdx + 1}: {fb.correct ? 'Correto!' : `Incorreto. Opção correta: ${fb.correctAnswer}`}</span>
                      </div>
                      <p className="pl-6 text-slate-600">{fb.explanation}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAssessmentResult(null);
                      setAssessmentAnswers({});
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tentar Novamente</span>
                  </button>

                  {assessmentResult.passed && (
                    <button
                      id="btn-advance-to-recompensa"
                      type="button"
                      onClick={() => setActiveWorldTab('recompensa')}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Avançar para: 6. RECOMPENSA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. STAGE: RECOMPENSA (CELEBRATION & NEXT WORLD UNLOCK) */}
      {/* ========================================================================= */}
      {currentTab === 'recompensa' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl text-center space-y-6">
            
            {/* Badge Emblem Display */}
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl shadow-amber-500/40 ring-4 ring-amber-300/30 animate-bounce">
                {world.number === 1 ? '🛡️' : world.number === 2 ? '🔍' : world.number === 3 ? '🎨' : world.number === 4 ? '⚙️' : '🤖'}
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Distintivo Conquistado
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-2">
                {worldBadge?.name || `Mestre do ${world.title}`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                {worldBadge?.description || `Completaste com distinção todas as etapas do Mundo ${world.number}.`}
              </p>
            </div>

            {/* XP and Progression Recap */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Descobre</span>
                <span className="text-sm font-bold text-emerald-400">✓ Concluído</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Simuladores</span>
                <span className="text-sm font-bold text-blue-400">+60 XP</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Missão Real</span>
                <span className="text-sm font-bold text-purple-400">+50 XP</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Avaliação</span>
                <span className="text-sm font-bold text-amber-400">+100 XP</span>
              </div>
            </div>

            {/* Next Step / Next World Banner */}
            <div className="pt-4 max-w-md mx-auto space-y-3">
              {nextWorld ? (
                <button
                  id="btn-go-to-next-world"
                  type="button"
                  onClick={() => openWorld(nextWorld.id, 'descobre')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Avançar para o {nextWorld.title}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  id="btn-go-to-grand-mission"
                  type="button"
                  onClick={() => setCurrentView('grand-mission')}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Ir para a Grande Missão Final! 🚀</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentView('worlds')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Voltar ao Mapa dos 5 Mundos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
