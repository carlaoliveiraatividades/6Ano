import React, { useState, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Bug, Table, CheckCircle2, ArrowUp, ArrowDown, ChevronRight, CornerDownRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EngenheiroSimulators: React.FC = () => {
  const { completeSimulator } = useApp();
  const [activeTab, setActiveTab] = useState<'passos' | 'blocos' | 'debugging' | 'dados'>('passos');

  // ==========================================
  // 1. ORDENA OS PASSOS (MOCHILA)
  // ==========================================
  const initialSteps = [
    { id: 'fechar', text: 'Fechar a mochila' },
    { id: 'horario', text: 'Verificar o horário escolar' },
    { id: 'livros', text: 'Colocar os livros e cadernos' },
    { id: 'estojo', text: 'Colocar o estojo e material' },
    { id: 'abrir', text: 'Abrir a mochila' }
  ];
  const correctStepsOrder = ['horario', 'abrir', 'livros', 'estojo', 'fechar'];
  const [steps, setSteps] = useState(initialSteps);
  const [stepsSolved, setStepsSolved] = useState(false);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    setSteps(newSteps);

    const isOrderCorrect = newSteps.every((s, i) => s.id === correctStepsOrder[i]);
    if (isOrderCorrect && !stepsSolved) {
      setStepsSolved(true);
      completeSimulator('sim-steps', 30);
    }
  };

  // ==========================================
  // 2. PROGRAMA E EXPERIMENTA (5 NÍVEIS GRID)
  // ==========================================
  interface LevelConfig {
    level: number;
    title: string;
    startPos: [number, number]; // [row, col]
    startDir: number; // 0: Up, 1: Right, 2: Down, 3: Left
    targetPos: [number, number];
    obstacles: [number, number][];
    optimalBlocks: number;
  }

  const levels: LevelConfig[] = [
    { level: 1, title: 'Nível 1: Primeiro Passo', startPos: [4, 2], startDir: 0, targetPos: [1, 2], obstacles: [], optimalBlocks: 3 },
    { level: 2, title: 'Nível 2: Virar a Esquina', startPos: [4, 0], startDir: 0, targetPos: [2, 3], obstacles: [[3, 0], [4, 1]], optimalBlocks: 4 },
    { level: 3, title: 'Nível 3: O Labirinto', startPos: [4, 0], startDir: 0, targetPos: [0, 4], obstacles: [[3, 1], [3, 2], [1, 3]], optimalBlocks: 6 },
    { level: 4, title: 'Nível 4: Usar Ciclos', startPos: [4, 0], startDir: 1, targetPos: [4, 4], obstacles: [], optimalBlocks: 2 },
    { level: 5, title: 'Nível 5: Desafio Final do Robô', startPos: [4, 0], startDir: 0, targetPos: [0, 4], obstacles: [[2, 1], [2, 2], [2, 3]], optimalBlocks: 7 }
  ];

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = levels[currentLevelIdx];

  const [robotPos, setRobotPos] = useState<[number, number]>(currentLevel.startPos);
  const [robotDir, setRobotDir] = useState<number>(currentLevel.startDir);
  const [program, setProgram] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [levelWon, setLevelWon] = useState(false);

  useEffect(() => {
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setProgram([]);
    setLevelWon(false);
  }, [currentLevelIdx]);

  const addCommand = (cmd: string) => {
    if (program.length < 12 && !isRunning) {
      setProgram(prev => [...prev, cmd]);
    }
  };

  const removeCommand = (idx: number) => {
    if (!isRunning) {
      setProgram(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const runProgram = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    let curPos: [number, number] = [...currentLevel.startPos];
    let curDir = currentLevel.startDir;
    setRobotPos(curPos);
    setRobotDir(curDir);

    // Directions: 0: Up [-1, 0], 1: Right [0, 1], 2: Down [1, 0], 3: Left [0, -1]
    const dirOffsets = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    // Expand repeat cycles if present
    const expanded: string[] = [];
    for (let i = 0; i < program.length; i++) {
      if (program[i] === 'REPETIR_3_AVANCAR') {
        expanded.push('AVANÇAR', 'AVANÇAR', 'AVANÇAR');
      } else if (program[i] === 'REPETIR_4_AVANCAR') {
        expanded.push('AVANÇAR', 'AVANÇAR', 'AVANÇAR', 'AVANÇAR');
      } else {
        expanded.push(program[i]);
      }
    }

    for (const cmd of expanded) {
      await new Promise(r => setTimeout(r, 450));
      if (cmd === 'AVANÇAR') {
        const nextR = curPos[0] + dirOffsets[curDir][0];
        const nextC = curPos[1] + dirOffsets[curDir][1];
        // Check grid boundary
        if (nextR >= 0 && nextR < 5 && nextC >= 0 && nextC < 5) {
          // Check obstacle
          const isObstacle = currentLevel.obstacles.some(o => o[0] === nextR && o[1] === nextC);
          if (!isObstacle) {
            curPos = [nextR, nextC];
            setRobotPos([...curPos]);
          }
        }
      } else if (cmd === 'VIRAR_ESQUERDA') {
        curDir = (curDir + 3) % 4;
        setRobotDir(curDir);
      } else if (cmd === 'VIRAR_DIREITA') {
        curDir = (curDir + 1) % 4;
        setRobotDir(curDir);
      }
    }

    setIsRunning(false);

    // Check target reached
    if (curPos[0] === currentLevel.targetPos[0] && curPos[1] === currentLevel.targetPos[1]) {
      setLevelWon(true);
      if (currentLevelIdx === levels.length - 1) {
        completeSimulator('sim-block-coding', 40);
      }
    }
  };

  const resetRobot = () => {
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setLevelWon(false);
  };

  // ==========================================
  // 3. DEBUGGING (5 DESAFIOS)
  // ==========================================
  const debugChallenges = [
    {
      id: 1,
      goal: 'O robô deve avançar 2 casas e virar à direita para a bandeira.',
      code: ['1. AVANÇAR', '2. AVANÇAR', '3. VIRAR À ESQUERDA (ERRO)', '4. AVANÇAR'],
      errorIndex: 2,
      fixExplanation: 'O passo 3 deveria ser VIRAR À DIREITA, senão o robô afasta-se da bandeira!'
    },
    {
      id: 2,
      goal: 'Lavar os dentes antes de ir dormir.',
      code: ['1. Colocar pasta na escova', '2. Lavar os dentes 2 minutos', '3. Ir para a cama (ERRO)', '4. Bochechar com água'],
      errorIndex: 2,
      fixExplanation: 'O passo 3 está trocado! Devemos bochechar e enxaguar a boca ANTES de ir para a cama.'
    },
    {
      id: 3,
      goal: 'Imprimir 5 cópias de uma ficha de trabalho.',
      code: ['1. Ligar impressora', '2. Colocar papel', '3. REPETIR 1 VEZ: Imprimir (ERRO)', '4. Retirar cópias'],
      errorIndex: 2,
      fixExplanation: 'Para 5 cópias o ciclo deve ser REPETIR 5 VEZES, e não apenas 1 vez.'
    },
    {
      id: 4,
      goal: 'Regar a planta apenas se a terra estiver seca.',
      code: ['1. Verificar terra', '2. SE terra estiver húmida: Regar muito (ERRO)', '3. SENÃO: Não regar'],
      errorIndex: 1,
      fixExplanation: 'A condição lógica está invertida: só regamos SE a terra estiver SECA!'
    },
    {
      id: 5,
      goal: 'Calcular a média de 2 testes.',
      code: ['1. Ler nota 1', '2. Ler nota 2', '3. Multiplicar as duas notas (ERRO)', '4. Dividir por 2'],
      errorIndex: 2,
      fixExplanation: 'Para fazer a média somamos as notas (Nota 1 + Nota 2) e não multiplicamos!'
    }
  ];
  const [debugSelections, setDebugSelections] = useState<Record<number, number>>({});

  const handleSelectDebug = (challId: number, stepIdx: number) => {
    setDebugSelections(prev => ({ ...prev, [challId]: stepIdx }));
    if (Object.keys(debugSelections).length >= 4) {
      completeSimulator('sim-debugging', 30);
    }
  };

  // ==========================================
  // 4. ORGANIZA OS DADOS
  // ==========================================
  const initialData = [
    { nome: 'Ana', idade: 12, turma: '6.º A', clube: 'Robótica' },
    { nome: 'Rui', idade: 11, turma: '6.º A', clube: 'Teatro' },
    { nome: 'João', idade: 12, turma: '6.º A', clube: 'Futebol' },
    { nome: 'Marta', idade: 11, turma: '6.º A', clube: 'Música' }
  ];
  const [tableData, setTableData] = useState(initialData);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [filterAge, setFilterAge] = useState<number | null>(null);
  const [dataAnswer, setDataAnswer] = useState<string>('');
  const [dataFeedback, setDataFeedback] = useState<string | null>(null);

  const handleSort = (key: 'nome' | 'idade') => {
    const sorted = [...tableData].sort((a, b) => {
      if (key === 'nome') return a.nome.localeCompare(b.nome);
      return a.idade - b.idade;
    });
    setSortKey(key);
    setTableData(sorted);
  };

  const handleAnswerDataQuery = () => {
    if (dataAnswer.trim() === '2') {
      setDataFeedback('✓ Correto! Exatamente 2 alunos têm 12 anos (a Ana e o João).');
      completeSimulator('sim-data', 30);
    } else {
      setDataFeedback('Tenta novamente: Conta quantos alunos na tabela têm o valor 12 na coluna Idade.');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('passos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'passos' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>1. 🧩 Ordena os Passos</span>
        </button>

        <button
          onClick={() => setActiveTab('blocos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'blocos' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>2. 🧩 Programa e Experimenta (Robô)</span>
        </button>

        <button
          onClick={() => setActiveTab('debugging')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'debugging' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>3. 🐞 Encontra o Erro! (5 Desafios)</span>
        </button>

        <button
          onClick={() => setActiveTab('dados')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'dados' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>4. 🗂️ Organiza os Dados</span>
        </button>
      </div>

      {/* 1. ORDENA OS PASSOS */}
      {activeTab === 'passos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 leading-relaxed">
            <strong>Tarefa Algorítmica:</strong> Preparar a mochila para o dia seguinte.
            Utiliza as setas &uarr; e &darr; para colocar os 5 passos na ordem sequencial e lógica correta!
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {step.text}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === steps.length - 1}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {stepsSolved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Algoritmo Perfeito (+30 XP)!</strong>
                <p className="mt-0.5">
                  1. Verificar horário &rarr; 2. Abrir mochila &rarr; 3. Colocar livros &rarr; 4. Colocar estojo &rarr; 5. Fechar mochila. Parabéns!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PROGRAMA E EXPERIMENTA (ROBOT VISUAL BLOCKS) */}
      {activeTab === 'blocos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                {currentLevel.title}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Leva o Robô 🤖 até à Estrela de Chegada ⭐ programando a sequência de passos!
              </p>
            </div>

            {/* Level selector */}
            <div className="flex items-center gap-1">
              {levels.map((l, i) => (
                <button
                  key={l.level}
                  onClick={() => setCurrentLevelIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    i === currentLevelIdx ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l.level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Grid 5x5 */}
            <div className="bg-slate-900 p-3 rounded-2xl shadow-md flex flex-col items-center">
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {Array.from({ length: 5 }).map((_, r) =>
                  Array.from({ length: 5 }).map((_, c) => {
                    const isRobot = robotPos[0] === r && robotPos[1] === c;
                    const isTarget = currentLevel.targetPos[0] === r && currentLevel.targetPos[1] === c;
                    const isObstacle = currentLevel.obstacles.some(o => o[0] === r && o[1] === c);

                    const dirIcons = ['⬆️', '➡️', '⬇️', '⬅️'];

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg font-bold border transition-all ${
                          isRobot
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-300'
                            : isTarget
                            ? 'bg-amber-500 text-white border-amber-300 animate-pulse'
                            : isObstacle
                            ? 'bg-slate-800 text-slate-500 border-slate-700'
                            : 'bg-slate-850 text-slate-700 border-slate-800'
                        }`}
                      >
                        {isRobot ? dirIcons[robotDir] : isTarget ? '⭐' : isObstacle ? '🧱' : ''}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={runProgram}
                  disabled={isRunning || program.length === 0}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunning ? 'A executar...' : 'Executar Código'}</span>
                </button>

                <button
                  onClick={resetRobot}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>

            {/* Block toolbox & Program sequence */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Caixa de Ferramentas de Blocos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addCommand('AVANÇAR')}
                    className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs text-left cursor-pointer shadow-2xs"
                  >
                    + AVANÇAR
                  </button>
                  <button
                    onClick={() => addCommand('VIRAR_DIREITA')}
                    className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs text-left cursor-pointer shadow-2xs"
                  >
                    + VIRAR À DIREITA
                  </button>
                  <button
                    onClick={() => addCommand('VIRAR_ESQUERDA')}
                    className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs text-left cursor-pointer shadow-2xs"
                  >
                    + VIRAR À ESQUERDA
                  </button>
                  <button
                    onClick={() => addCommand('REPETIR_3_AVANCAR')}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-left cursor-pointer shadow-2xs"
                  >
                    + REPETIR 3x (AVANÇAR)
                  </button>
                </div>
              </div>

              {/* Program Workspace */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>O Teu Programa ({program.length} blocos):</span>
                  {program.length > 0 && (
                    <button
                      onClick={() => setProgram([])}
                      className="text-red-500 hover:text-red-700 text-[11px] cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {program.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Clica nos blocos coloridos para programar a rota.
                  </p>
                ) : (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {program.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800"
                      >
                        <span>{idx + 1}. {cmd}</span>
                        <button
                          onClick={() => removeCommand(idx)}
                          className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {levelWon && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center justify-between">
                  <span>🎉 Chegaste à Estrela no Nível {currentLevel.level}!</span>
                  {currentLevelIdx < levels.length - 1 ? (
                    <button
                      onClick={() => setCurrentLevelIdx(prev => prev + 1)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs cursor-pointer"
                    >
                      Próximo Nível &rarr;
                    </button>
                  ) : (
                    <span className="text-emerald-700">Todos os 5 Níveis Concluídos (+40 XP)!</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DEBUGGING (5 DESAFIOS) */}
      {activeTab === 'debugging' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
            <strong>Debugging:</strong> Clica no passo que contém o erro de lógica em cada um dos algoritmos:
          </div>

          <div className="space-y-4">
            {debugChallenges.map(d => {
              const selected = debugSelections[d.id];
              const isCorrect = selected === d.errorIndex;

              return (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {d.id}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      Objetivo: {d.goal}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {d.code.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectDebug(d.id, idx)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-mono font-bold transition-all cursor-pointer ${
                          selected === idx
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
                              : 'bg-red-100 border-red-400 text-red-950'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {step.replace(' (ERRO)', '')}
                      </button>
                    ))}
                  </div>

                  {selected !== undefined && (
                    <p className={`text-xs p-2.5 rounded-xl font-medium ${
                      isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                    }`}>
                      {isCorrect ? `✓ ${d.fixExplanation}` : 'Não é este o passo com erro. Analisa o objetivo com atenção!'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ORGANIZA OS DADOS */}
      {activeTab === 'dados' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
            <p><strong>Dados e Tabelas:</strong> Dados são registos estruturados que podemos ordenar, agrupar e analisar.</p>
            <p>Ordena a tabela pelas colunas ou responde à questão analítica:</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSort('nome')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
            >
              Ordenar por Nome (A-Z)
            </button>
            <button
              onClick={() => handleSort('idade')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
            >
              Ordenar por Idade
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Idade</th>
                  <th className="p-3">Turma</th>
                  <th className="p-3">Clube Escolar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{row.nome}</td>
                    <td className="p-3 font-mono">{row.idade} anos</td>
                    <td className="p-3">{row.turma}</td>
                    <td className="p-3">{row.clube}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-indigo-950">
              Questão Analítica: Quantos alunos da tabela têm 12 anos?
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={dataAnswer}
                onChange={e => setDataAnswer(e.target.value)}
                placeholder="Introduz um número..."
                className="w-36 px-3 py-2 rounded-xl bg-white border border-indigo-200 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleAnswerDataQuery}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Validar Resposta
              </button>
            </div>
            {dataFeedback && (
              <p className="text-xs font-bold text-indigo-900">{dataFeedback}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
