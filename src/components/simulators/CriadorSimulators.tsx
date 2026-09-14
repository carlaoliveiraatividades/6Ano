import React, { useState } from 'react';
import { MessageSquare, Mail, Users, Copyright, CheckCircle2, XCircle, Send, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CriadorSimulators: React.FC = () => {
  const { completeSimulator, awardXp } = useApp();
  const [activeTab, setActiveTab] = useState<'netiqueta' | 'email' | 'bcc' | 'copyright' | 'corrige'>('netiqueta');

  // 1. Netiqueta
  const [netAnswers, setNetAnswers] = useState<Record<number, string>>({});

  // 2. Email composer
  const [emailTo, setEmailTo] = useState('professor@escola.pt');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // 3. BCC
  const [bccChoice, setBccChoice] = useState<string | null>(null);

  // 4. Copyright
  const [copyAnswers, setCopyAnswers] = useState<Record<number, string>>({});

  // 5. Corrige a Mensagem
  const [correctedMessage, setCorrectedMessage] = useState('');
  const [corrigeDone, setCorrigeDone] = useState(false);

  const handleNetAnswer = (qId: number, val: string) => {
    setNetAnswers(prev => ({ ...prev, [qId]: val }));
    if (qId === 2 && val === 'b') {
      completeSimulator('sim-netiquette', 30);
    }
  };

  const handleSendEmail = () => {
    if (emailSubject.trim().length > 3 && emailBody.trim().length > 15) {
      setEmailSent(true);
      completeSimulator('sim-email', 30);
    }
  };

  const handleBccChoice = (choice: string) => {
    setBccChoice(choice);
    if (choice === 'bcc') {
      completeSimulator('sim-bcc', 30);
    }
  };

  const handleCopyAnswer = (cId: number, ans: string) => {
    setCopyAnswers(prev => ({ ...prev, [cId]: ans }));
    if (Object.keys(copyAnswers).length >= 3) {
      completeSimulator('sim-copyright', 30);
    }
  };

  const handleFixMessage = () => {
    if (correctedMessage.toLowerCase().includes('bom dia') || correctedMessage.toLowerCase().includes('boa tarde') || correctedMessage.length > 25) {
      setCorrigeDone(true);
      awardXp(40, 'Mensagem corrigida com rigor e netiqueta exemplar!');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('netiqueta')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'netiqueta' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>1. Como Falamos Online?</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'email' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>2. Escreve o Email</span>
        </button>

        <button
          onClick={() => setActiveTab('bcc')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bcc' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>3. CC e BCC</span>
        </button>

        <button
          onClick={() => setActiveTab('copyright')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'copyright' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Copyright className="w-3.5 h-3.5" />
          <span>4. Posso Usar Isto?</span>
        </button>

        <button
          onClick={() => setActiveTab('corrige')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'corrige' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>5. Desafio: Corrige a Mensagem</span>
        </button>
      </div>

      {/* 1. Netiqueta */}
      {activeTab === 'netiqueta' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Situação 1: Um colega deu uma resposta errada num trabalho de grupo.
            </h3>
            <div className="space-y-2">
              {[
                { id: 'a', text: '“És mesmo burro 😂”' },
                { id: 'b', text: '“A resposta parece estar errada. Vamos verificar juntos?”' },
                { id: 'c', text: 'Publicar a resposta nas redes para gozar com ele' },
                { id: 'd', text: 'Excluir o colega do grupo sem falar com ele' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleNetAnswer(1, opt.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    netAnswers[1] === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-300 text-red-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {netAnswers[1] === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-500" />)}
                </button>
              ))}
            </div>
            {netAnswers[1] === 'b' && (
              <p className="text-xs font-medium text-emerald-800 bg-white p-3 rounded-xl border border-emerald-200">
                Boa escolha! Podemos discordar e apontar correções sem nunca insultar ou diminuir o trabalho do outro.
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Situação 2: Um colega não percebe uma tarefa difícil. Qual a melhor atitude?
            </h3>
            <div className="space-y-2">
              {[
                { id: 'a', text: '“Olha, devias ter prestado atenção na aula.”' },
                { id: 'b', text: '“Queres que te explique como fiz?”' },
                { id: 'c', text: 'Ignorar a mensagem e deixá-lo sozinho.' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleNetAnswer(2, opt.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    netAnswers[2] === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-300 text-red-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {netAnswers[2] === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-500" />)}
                </button>
              ))}
            </div>
            {netAnswers[2] === 'b' && (
              <p className="text-xs font-medium text-emerald-800 bg-white p-3 rounded-xl border border-emerald-200">
                Perfeito! Empatia e colaboração são o coração da cidadania digital na escola.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. Escreve o Email */}
      {activeTab === 'email' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            Tarefa: Escreve um email formal e educado ao professor a pedir ajuda no trabalho de TIC.
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-16 font-bold text-slate-500 uppercase">Para:</span>
              <input
                type="text"
                disabled
                value={emailTo}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-16 font-bold text-slate-500 uppercase">Assunto:</span>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="Ex: Pedido de ajuda no trabalho de TIC"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase text-xs block mb-1">Mensagem:</span>
              <textarea
                rows={4}
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder="Ex: Bom dia, professor. Estou a ter dificuldade numa parte do trabalho de TIC. Pode ajudar-me, por favor? Obrigado."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Verifica: Destinatário, Assunto, Saudação, Conteúdo e Despedida.
              </span>
              <button
                onClick={handleSendEmail}
                disabled={emailSent}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  emailSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{emailSent ? 'Email Enviado com Sucesso!' : 'Enviar Email'}</span>
              </button>
            </div>
          </div>

          {emailSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Excelente!</strong>
                <p className="mt-0.5">O teu email tem destinatário definido, assunto claro, mensagem estruturada e despedida educada. Parabéns!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CC e BCC */}
      {activeTab === 'bcc' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Situação: Queres enviar um email para 25 encarregados de educação da turma sem revelar os endereços de email uns aos outros.
            </h3>
            <p className="text-xs text-slate-600">
              Que campo deves utilizar para colocar os endereços dos destinatários?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleBccChoice('cc')}
                className={`p-4 rounded-xl border text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  bccChoice === 'cc' ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Campo CC (Com Conhecimento)
              </button>

              <button
                onClick={() => handleBccChoice('bcc')}
                className={`p-4 rounded-xl border text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  bccChoice === 'bcc' ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Campo BCC (Com Cópia Oculta)
              </button>
            </div>

            {bccChoice && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm mt-3 ${
                bccChoice === 'bcc' ? 'bg-white border border-emerald-300 text-emerald-900 font-medium' : 'bg-white border border-red-300 text-red-900'
              }`}>
                {bccChoice === 'bcc' ? (
                  <p>✓ <strong>Correto!</strong> O BCC (Blind Carbon Copy) oculta os endereços de todos os restantes destinatários, protegendo a sua privacidade e cumprindo as regras de proteção de dados.</p>
                ) : (
                  <p>Incorreto: Se colocares em CC, todos os 25 encarregados de educação conseguirão ver os emails uns dos outros, violando a privacidade.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Posso Usar Isto? (Copyright) */}
      {activeTab === 'copyright' && (
        <div className="space-y-4">
          {[
            {
              id: 1,
              title: 'Caso 1: Imagem com licença Creative Commons que permite reutilização com atribuição de autoria.',
              opts: [
                { id: 'a', text: 'Pode ser utilizada respeitando a licença e indicando o nome do autor original.', correct: true },
                { id: 'b', text: 'Não pode ser usada de forma alguma.', correct: false }
              ]
            },
            {
              id: 2,
              title: 'Caso 2: Imagem encontrada na web sem nenhuma menção ou informação sobre licença.',
              opts: [
                { id: 'a', text: 'Se não tem licença, é livre e posso usar.', correct: false },
                { id: 'b', text: 'Não assumir que é livre. Procurar os direitos de utilização ou escolher outra com licença aberta.', correct: true }
              ]
            },
            {
              id: 3,
              title: 'Caso 3: Texto de outra pessoa copiado integralmente sem indicar a fonte nem as aspas.',
              opts: [
                { id: 'a', text: 'É plágio! É obrigatório dar crédito e não apresentar o texto como nosso.', correct: true },
                { id: 'b', text: 'Não tem problema desde que mude duas palavras.', correct: false }
              ]
            },
            {
              id: 4,
              title: 'Caso 4: Obra ou imagem em Domínio Público.',
              opts: [
                { id: 'a', text: 'Pode ser utilizada livremente dentro das regras aplicáveis ao domínio público.', correct: true },
                { id: 'b', text: 'É estritamente proibido abrir o ficheiro.', correct: false }
              ]
            }
          ].map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <div className="space-y-1.5">
                {item.opts.map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleCopyAnswer(item.id, o.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      copyAnswers[item.id] === o.id
                        ? o.correct
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-red-50 border-red-300 text-red-900'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{o.text}</span>
                    {copyAnswers[item.id] === o.id && (o.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Corrige a Mensagem */}
      {activeTab === 'corrige' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
              Mensagem Original do Aluno:
            </span>
            <p className="font-mono bg-white p-3 rounded-xl border border-amber-300 text-slate-800">
              &ldquo;ola professor preciso de ajuda mandei o trabalho veja ai&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              A tua versão corrigida e formal:
            </label>
            <textarea
              rows={4}
              value={correctedMessage}
              onChange={e => setCorrectedMessage(e.target.value)}
              placeholder="Ex: Bom dia, professor. Envio o meu trabalho de TIC e gostaria de pedir ajuda numa parte que não consegui concluir. Obrigado."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleFixMessage}
              disabled={corrigeDone}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                corrigeDone ? 'bg-emerald-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs'
              }`}
            >
              {corrigeDone ? 'Mensagem Validada (+40 XP)!' : 'Validar Correção'}
            </button>
          </div>

          {corrigeDone && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Excelente trabalho!</strong>
                <p className="mt-0.5">A tua mensagem agora tem saudação formal, explicação clara da dúvida e agradecimento respeitoso.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
