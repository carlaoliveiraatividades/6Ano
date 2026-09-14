import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, FileText, Camera, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewsDetectiveSim: React.FC = () => {
  const { completeSimulator, awardXp } = useApp();
  const [activeTab, setActiveTab] = useState<'noticia' | 'foto' | 'operacao'>('noticia');

  // Case 1: Água azul
  const [newsAnswer, setNewsAnswer] = useState<string | null>(null);

  // Case 2: Foto fora do contexto
  const [photoAnswer, setPhotoAnswer] = useState<string | null>(null);

  // Case 3: Operação Notícia
  const [checkAnswers, setCheckAnswers] = useState<Record<string, string>>({});
  const [classification, setClassification] = useState<string | null>(null);
  const [operationFinished, setOperationFinished] = useState(false);

  const handleFinishNews = (ans: string) => {
    setNewsAnswer(ans);
    if (ans === 'nao') {
      completeSimulator('sim-news-detective', 30);
    }
  };

  const handleFinishPhoto = (ans: string) => {
    setPhotoAnswer(ans);
    if (ans === 'verificar') {
      completeSimulator('sim-photo-context', 30);
    }
  };

  const handleFinishOperation = () => {
    setOperationFinished(true);
    awardXp(40, 'Operação Notícia concluída com análise crítica exemplar!');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('noticia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'noticia'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. A Notícia da Água Azul</span>
        </button>

        <button
          onClick={() => setActiveTab('foto')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'foto'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>2. Foto Fora de Contexto</span>
        </button>

        <button
          onClick={() => setActiveTab('operacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'operacao'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>3. Desafio: Operação Notícia</span>
        </button>
      </div>

      {/* TAB 1: Água Azul */}
      {activeTab === 'noticia' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
              Manchete Encontrada
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900">
              &ldquo;CIENTISTAS DESCOBRIRAM QUE BEBER ÁGUA AZUL TORNA AS PESSOAS MAIS INTELIGENTES!&rdquo;
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-slate-400 block text-[10px]">Fonte:</span>
                <span className="font-bold text-slate-800">NoticiasFantasticas123</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-slate-400 block text-[10px]">Autor:</span>
                <span className="font-bold text-red-600">Desconhecido</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-slate-400 block text-[10px]">Data:</span>
                <span className="font-bold text-red-600">Desconhecida</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <span className="text-slate-400 block text-[10px]">Evidências:</span>
                <span className="font-bold text-red-600">Nenhuma</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">
              Deves acreditar imediatamente nesta afirmação e partilhá-la?
            </h4>

            <div className="flex gap-3">
              <button
                onClick={() => handleFinishNews('sim')}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  newsAnswer === 'sim'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Sim, parece científico!
              </button>

              <button
                onClick={() => handleFinishNews('nao')}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  newsAnswer === 'nao'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                NÃO, não há evidências nem autoria fidedigna.
              </button>
            </div>

            {newsAnswer && (
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                newsAnswer === 'nao' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'
              }`}>
                {newsAnswer === 'nao' ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Boa investigação!</strong>
                      <p className="mt-1">
                        Não basta uma frase parecer científica. Devemos procurar sempre a origem real, a autoria, a data e se existem estudos comprovados.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>Atenção! Qualquer pessoa pode inventar que "cientistas descobriram" algo sem apresentar quaisquer provas ou nomes.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Foto Fora de Contexto */}
      {activeTab === 'foto' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
            <div className="aspect-video max-w-md mx-auto rounded-xl bg-slate-800 text-white flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
              <span className="text-4xl mb-2">🌧️🚗🌊</span>
              <p className="font-mono text-xs text-sky-200">
                &ldquo;Inundações gigantescas ontem à tarde na Baixa de Lisboa!&rdquo;
              </p>
              <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
                Pesquisa inversa: Publicada originalmente em 2018 na Ásia.
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Esta fotografia está a circular nas redes com a frase: <em>&ldquo;Esta imagem foi tirada ontem em Lisboa&rdquo;</em>. Contudo, a imagem foi tirada há 8 anos noutro continente durante uma monção.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">
              O que devemos verificar perante uma fotografia impressionante?
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => handleFinishPhoto('acreditar')}
                className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  photoAnswer === 'acreditar' ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Acreditar porque uma fotografia não pode ser falsa
              </button>

              <button
                onClick={() => handleFinishPhoto('verificar')}
                className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  photoAnswer === 'verificar' ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Verificar quando e onde a fotografia foi realmente publicada pela primeira vez (pesquisa de imagem inversa)
              </button>
            </div>

            {photoAnswer === 'verificar' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Excelente dedução!</strong>
                  <p className="mt-1">
                    Uma fotografia autêntica pode ser usada com uma legenda completamente falsa. Verificar a origem e a data original evita espalhar desinformação.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Operação Notícia */}
      {activeTab === 'operacao' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-700">
            Aplica a checklist dos 5 pontos a uma notícia suspeita recebida por mensagem de telemóvel e decide a sua classificação final:
          </div>

          <div className="space-y-3">
            {[
              { id: 'q1', text: '1. Quem publicou? Tem autor identificado?', optA: 'Sim, jornalista com perfil profissional', optB: 'Não, canal anónimo sem assinatura' },
              { id: 'q2', text: '2. Quando foi publicada a informação?', optA: 'Data e hora explícitas e atualizadas', optB: 'Sem qualquer data indicada' },
              { id: 'q3', text: '3. Existem provas, links ou relatórios citados?', optA: 'Sim, relatórios oficiais acessíveis', optB: 'Não, apenas frases de efeito' },
              { id: 'q4', text: '4. Outras fontes credíveis e jornais confirmam?', optA: 'Vários jornais de referência noticiam o mesmo', optB: 'Nenhum outro órgão de comunicação menciona' },
              { id: 'q5', text: '5. O título corresponde fielmente ao texto?', optA: 'Sim, é factual e equilibrado', optB: 'Não, o título é sensacionalista e enganoso' }
            ].map(item => (
              <div key={item.id} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900">{item.text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setCheckAnswers(prev => ({ ...prev, [item.id]: 'a' }))}
                    className={`p-2 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                      checkAnswers[item.id] === 'a' ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    A) {item.optA}
                  </button>
                  <button
                    onClick={() => setCheckAnswers(prev => ({ ...prev, [item.id]: 'b' }))}
                    className={`p-2 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                      checkAnswers[item.id] === 'b' ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    B) {item.optB}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              Classificação Global da Notícia:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setClassification('fiável')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  classification === 'fiável' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                🟢 Fiável
              </button>
              <button
                onClick={() => setClassification('verificar')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  classification === 'verificar' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                🟠 Precisa de Mais Verificação
              </button>
              <button
                onClick={() => setClassification('sem-provas')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  classification === 'sem-provas' ? 'bg-red-600 text-white shadow-xs' : 'bg-white hover:bg-red-50 text-red-900 border-red-200'
                }`}
              >
                🔴 Sem Evidências Suficientes
              </button>
            </div>

            {classification && !operationFinished && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleFinishOperation}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Concluir Operação Notícia (+40 XP)
                </button>
              </div>
            )}
            {operationFinished && (
              <p className="text-xs font-bold text-emerald-600 pt-2 text-right">
                ✓ Operação Notícia concluída com sucesso!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
