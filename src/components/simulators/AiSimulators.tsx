import React, { useState } from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, CheckCircle2, XCircle, Sliders, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiSimulators: React.FC = () => {
  const { completeSimulator } = useApp();
  const [activeTab, setActiveTab] = useState<'prompts' | 'alucinacoes' | 'bias' | 'recomendacao'>('prompts');

  // 1. Prompt Lab
  const [chosenPromptType, setChosenPromptType] = useState<'fraco' | 'forte' | null>(null);

  // 2. Alucinações
  const hallucinationStatements = [
    { id: 1, text: 'A capital de Portugal é Lisboa.', correct: 'correto', hint: 'Verdadeiro: facto geográfico incontestável.' },
    { id: 2, text: 'O rio Tejo nasce no Porto.', correct: 'errado', hint: 'Falso/Alucinação! O Tejo nasce na serra de Albarracín em Espanha e desagua em Lisboa.' },
    { id: 3, text: 'Os computadores funcionam com energia solar mágica sem eletricidade.', correct: 'errado', hint: 'Falso/Absurdo: tecnologia requer energia elétrica real, não há magia.' },
    { id: 4, text: 'A fotossíntese é o processo pelo qual as plantas produzem alimento com luz solar.', correct: 'correto', hint: 'Verdadeiro: facto científico biológico.' },
    { id: 5, text: 'Luís de Camões escreveu Os Lusíadas.', correct: 'correto', hint: 'Verdadeiro: facto histórico literário.' },
    { id: 6, text: 'D. Afonso Henriques usava um smartphone no século XII para falar com a mãe.', correct: 'errado', hint: 'Falso/Alucinação anacrónica: smartphones foram inventados séculos mais tarde.' },
    { id: 7, text: 'A água ferve a 100 ºC ao nível do mar sob pressão normal.', correct: 'correto', hint: 'Verdadeiro: lei da física e química.' },
    { id: 8, text: 'A inteligência artificial sabe sempre 100% da verdade sem quaisquer falhas.', correct: 'errado', hint: 'Falso! Modelos de IA prevêem palavras estatisticamente e podem alucinar ou errar.' }
  ];
  const [halluAnswers, setHalluAnswers] = useState<Record<number, string>>({});

  // 3. Enviesamento
  const biasStatements = [
    { id: 1, text: '“Pessoas de um certo país são todas preguiçosas.”', isBiased: true, feedback: 'Generalização discriminatória sem fundamento real.' },
    { id: 2, text: '“A Terra orbita em torno do Sol.”', isBiased: false, feedback: 'Facto científico astronómico verificado.' },
    { id: 3, text: '“Meninas só gostam de brincar com bonecas e meninos só de carros.”', isBiased: true, feedback: 'Estereótipo de género sem validade universal.' },
    { id: 4, text: '“Os seres humanos precisam de água para sobreviver.”', isBiased: false, feedback: 'Facto biológico objetivo.' },
    { id: 5, text: '“Quem usa óculos é sempre mais esperto nos computadores.”', isBiased: true, feedback: 'Estereótipo popular falso.' },
    { id: 6, text: '“A linguagem Python é muito utilizada em ciência de dados.”', isBiased: false, feedback: 'Facto estatístico da indústria tecnológica.' }
  ];
  const [biasAnswers, setBiasAnswers] = useState<Record<number, boolean>>({});

  // 4. Recomendação
  const [selectedProfileStep, setSelectedProfileStep] = useState<number>(0);

  const handleSelectHallu = (sId: number, val: string) => {
    setHalluAnswers(prev => ({ ...prev, [sId]: val }));
    if (Object.keys(halluAnswers).length >= 7) {
      completeSimulator('sim-hallucination', 30);
    }
  };

  const handleSelectBias = (bId: number, val: boolean) => {
    setBiasAnswers(prev => ({ ...prev, [bId]: val }));
    if (Object.keys(biasAnswers).length >= 5) {
      completeSimulator('sim-bias', 30);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'prompts' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. 🤖 Fala com a IA (Prompt Lab)</span>
        </button>

        <button
          onClick={() => setActiveTab('alucinacoes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'alucinacoes' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>2. 🧠 A IA Pode Enganar-se? (8 Afirmações)</span>
        </button>

        <button
          onClick={() => setActiveTab('bias')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bias' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>3. 🧠 Deteta o Enviesamento</span>
        </button>

        <button
          onClick={() => setActiveTab('recomendacao')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recomendacao' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>4. 📱 Como Funcionam as Recomendações?</span>
        </button>
      </div>

      {/* 1. PROMPT LAB */}
      {activeTab === 'prompts' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs sm:text-sm text-purple-950 leading-relaxed">
            <strong>Laboratório de Prompts:</strong> Um prompt é a instrução dada à IA. A qualidade da resposta depende diretamente do contexto, do papel e da clareza da pergunta!
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { setChosenPromptType('fraco'); completeSimulator('sim-prompt-lab', 30); }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                chosenPromptType === 'fraco'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Opção A: Prompt Vago / Fraco
                </span>
              </div>
              <p className="font-mono text-sm font-bold text-slate-900">&ldquo;Vulcões&rdquo;</p>
              <p className="text-xs text-slate-500">Apenas uma palavra solta sem objetivo nem formato definido.</p>
            </button>

            <button
              onClick={() => { setChosenPromptType('forte'); completeSimulator('sim-prompt-lab', 30); }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                chosenPromptType === 'forte'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Opção B: Prompt Estruturado / Eficaz ⭐
                </span>
              </div>
              <p className="font-mono text-xs font-bold text-slate-900">
                &ldquo;Explica como funciona um vulcão para um aluno de 11 anos, com 3 tópicos simples e um exemplo prático.&rdquo;
              </p>
              <p className="text-xs text-slate-500">Define o tema, público-alvo, estrutura e exemplos desejados.</p>
            </button>
          </div>

          {chosenPromptType && (
            <div className="p-5 rounded-2xl border bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-purple-300 font-mono font-bold flex items-center gap-1">
                  <BrainCircuit className="w-4 h-4" />
                  Resposta Gerada pelo Modelo de IA:
                </span>
                <span className="text-slate-400 text-[11px]">
                  {chosenPromptType === 'forte' ? 'Qualidade: Alta e Adaptada' : 'Qualidade: Genérica e Dispersa'}
                </span>
              </div>

              {chosenPromptType === 'forte' ? (
                <div className="text-xs sm:text-sm leading-relaxed space-y-2 text-slate-200">
                  <p className="font-bold text-emerald-400">Olá! Aqui tens a explicação em 3 passos fáceis:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>1. Magma sob pressão:</strong> No interior da Terra, as rochas derretidas (magma) acumulam gases e calor intenso.</li>
                    <li><strong>2. Abertura da crosta:</strong> O vulcão funciona como uma chaminé natural que liga as profundezas à superfície.</li>
                    <li><strong>3. Erupção:</strong> Quando a pressão sobe demais, a lava é expelida com cinzas.</li>
                  </ul>
                  <p className="text-amber-300 italic pt-1">
                    Exemplo prático: Imagina agitar uma garrafa de refrigerante com gás e abrir a tampa de repente: o líquido sai disparado pela abertura!
                  </p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>Os vulcões são estruturas geológicas formadas pela acumulação de magma. Existem vulcões compósitos, vulcões-escudo, fendas vulcânicas e caldeiras basálticas. A vulcanologia estuda a litosfera e o manto superior terrestre na escala de pressão de 150 gigapascais...</p>
                  <p className="text-xs text-amber-400 mt-2 italic">
                    (Como o prompt foi apenas uma palavra solta, a IA respondeu com definições difíceis, sem saber a tua idade nem o que pretendias aprender!)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. ALUCINAÇÕES (8 AFIRMAÇÕES) */}
      {activeTab === 'alucinacoes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
            <strong>O Fenómeno da Alucinação:</strong> Um modelo de linguagem gera texto estatisticamente plausível. Por vezes inventa factos falsos com tom de certeza absoluta. Analisa as 8 afirmações e indica se são factualmente corretas ou erradas:
          </div>

          <div className="space-y-2.5">
            {hallucinationStatements.map(h => {
              const selected = halluAnswers[h.id];
              const isCorrect = selected === h.correct;

              return (
                <div
                  key={h.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    selected
                      ? isCorrect
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-red-50/40 border-red-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      &ldquo;{h.text}&rdquo;
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectHallu(h.id, 'correto')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected === 'correto'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        🟢 Correto
                      </button>
                      <button
                        onClick={() => handleSelectHallu(h.id, 'errado')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected === 'errado'
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-white hover:bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        🔴 Errado / Alucinação
                      </button>
                    </div>
                  </div>

                  {selected && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      <span>{h.hint}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BIAS */}
      {activeTab === 'bias' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950">
            <strong>Enviesamento (Bias):</strong> Se a IA treinar com dados que contêm preconceitos humanos, vai reproduzir esses mesmos erros. Identifica se cada afirmação contém enviesamento/generalização injusta ou se é um facto neutro:
          </div>

          <div className="space-y-3">
            {biasStatements.map(b => {
              const selected = biasAnswers[b.id];
              const isCorrect = selected === b.isBiased;

              return (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {b.text}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectBias(b.id, true)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected === true ? 'bg-purple-600 text-white' : 'bg-white text-purple-900 border border-purple-200'
                        }`}
                      >
                        Contém Enviesamento
                      </button>
                      <button
                        onClick={() => handleSelectBias(b.id, false)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected === false ? 'bg-slate-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        Facto Neutro
                      </button>
                    </div>
                  </div>

                  {selected !== undefined && (
                    <p className={`text-xs p-2 rounded-xl ${
                      isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'
                    }`}>
                      {isCorrect ? `✓ ${b.feedback}` : 'Reavalia: analisa se há estereótipos ou se é uma lei científica comprovada.'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. RECOMENDAÇÕES */}
      {activeTab === 'recomendacao' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              O Caso do Rui: Porque é que o feed se encheu de chuteiras e jogos?
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              O Rui assistiu a 2 vídeos de golos no fim de semana e comentou um jogo da seleção.
              No dia seguinte, 90% dos vídeos sugeridos eram sobre futebol e lojas desportivas.
            </p>

            <div className="bg-white p-4 rounded-xl border border-blue-200 text-xs space-y-2">
              <strong className="text-blue-900 block">Como funciona o algoritmo por detrás da aplicação:</strong>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                <li><strong>Registo de Ações:</strong> O tempo que o Rui passou a olhar para o ecrã, os gostos e as partilhas são registados.</li>
                <li><strong>Criação de Perfil:</strong> O algoritmo infere: &ldquo;Este utilizador tem grande interesse em futebol neste momento&rdquo;.</li>
                <li><strong>Otimização de Retenção:</strong> Para manter o Rui o máximo de tempo ligado à aplicação, o sistema entrega continuamente conteúdos do mesmo tema, criando uma <em>bolha informativa</em>.</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => completeSimulator('sim-recommendation', 30)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Concluir Análise de Algoritmos (+30 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
