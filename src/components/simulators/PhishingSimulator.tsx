import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PhishingSimulator: React.FC = () => {
  const { completeSimulator } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const messages = [
    {
      id: 0,
      sender: 'Premio-Facil-Digital <sorteio99@gmail.com>',
      subject: 'PARABÉNS!!! Ganhaste um telemóvel topo de gama!',
      content: 'PARABÉNS!!! Foste o visitante número 1.000.000 e ganhaste um telemóvel novinho! Clica AGORA no botão abaixo e coloca a tua palavra-passe e morada para receberes o prémio em 24 horas.',
      question: 'Qual é a melhor atitude perante esta mensagem?',
      options: [
        { label: 'A', text: 'Clicar imediatamente para não perder o telemóvel', isCorrect: false },
        { label: 'B', text: 'Enviar a password pedida no formulário', isCorrect: false },
        { label: 'C', text: 'Verificar a mensagem com cuidado, desconfiar e nunca fornecer a password', isCorrect: true },
        { label: 'D', text: 'Reencaminhar para toda a turma', isCorrect: false }
      ],
      feedback: 'Boa! A mensagem cria urgência artificial, promete um prémio absurdo e pede uma informação extremamente sensível.'
    },
    {
      id: 1,
      sender: 'Aviso de Segurança <servico-alerta@plataforma-xyz.online>',
      subject: 'A tua conta escolar precisa de atualização imediata',
      content: 'Olá! A tua conta escolar precisa de ser atualizada com urgência. Entra diretamente na aplicação oficial que costumas utilizar para verificar se existe algum aviso verdadeiro, ou clica aqui.',
      question: 'Qual é a atitude mais segura a tomar?',
      options: [
        { label: 'A', text: 'Clicar logo no link do email sem pensar', isCorrect: false },
        { label: 'B', text: 'Entrar diretamente na plataforma oficial habitual através do navegador em vez de clicar no link inesperado', isCorrect: true },
        { label: 'C', text: 'Responder ao email enviando o cartão de cidadão', isCorrect: false }
      ],
      feedback: 'Correto! Entrar diretamente na plataforma oficial que conheces em vez de seguir um link recebido por mensagem inesperada é a regra mais segura.'
    },
    {
      id: 2,
      sender: 'Suporte Técnico <admin-urgente@escola-falsa.net>',
      subject: 'Confirmação obrigatória de palavra-passe',
      content: 'Olá! Estamos a fazer uma manutenção técnica aos servidores escolares. Precisamos que nos envies a tua password atual para confirmar a tua conta ativa.',
      question: 'O que deves fazer quando te pedem a password?',
      options: [
        { label: 'A', text: 'Nunca fornecer a password a ninguém, pois nenhuma equipa técnica oficial a solicita', isCorrect: true },
        { label: 'B', text: 'Dar a password se a pessoa parecer simpática', isCorrect: false },
        { label: 'C', text: 'Mudar a password para 123456 e depois enviar', isCorrect: false }
      ],
      feedback: 'Excelente! Nenhuma empresa, escola ou técnico informático legítimo alguma vez pedirá a tua palavra-passe pessoal.'
    }
  ];

  const currentMsg = messages[currentStep];
  const userAnswer = selectedAnswers[currentStep];

  const handleSelect = (label: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentStep]: label }));
  };

  const handleNext = () => {
    if (currentStep < messages.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      completeSimulator('sim-phishing', 30);
    }
  };

  const isCurrentCorrect = currentMsg.options.find(o => o.label === userAnswer)?.isCorrect;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              🎣 Apanha o Burlão!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Caso {currentStep + 1} de {messages.length}: Inspeciona a mensagem e decide com segurança.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {messages.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-amber-500 scale-110'
                  : selectedAnswers[idx]
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Simulated Email Client UI */}
      <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-xs bg-white">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-mono font-semibold">Mensagem Recebida</span>
          <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">
            Atenção aos sinais
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3 bg-slate-50/50">
          <div className="text-xs space-y-1">
            <p><strong className="text-slate-700">De:</strong> <span className="font-mono text-slate-600">{currentMsg.sender}</span></p>
            <p><strong className="text-slate-700">Assunto:</strong> <span className="font-bold text-slate-900">{currentMsg.subject}</span></p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm leading-relaxed text-slate-800">
            {currentMsg.content}
          </div>
        </div>
      </div>

      {/* Question & Options */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
          {currentMsg.question}
        </h3>

        <div className="space-y-2">
          {currentMsg.options.map(opt => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                userAnswer === opt.label
                  ? opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                    : 'bg-red-50 border-red-300 text-red-950'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  {opt.label}
                </span>
                <span>{opt.text}</span>
              </div>
              {userAnswer === opt.label && (
                opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback & Progression */}
      {userAnswer && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
          isCurrentCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-start gap-2.5">
            {isCurrentCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{isCurrentCorrect ? 'Correto!' : 'Não é a melhor escolha:'}</p>
              <p className="mt-0.5">{currentMsg.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next step / Finish button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">
          Recompensa do simulador: <span className="text-amber-600 font-bold">+30 XP</span>
        </span>

        {userAnswer && isCurrentCorrect && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <span>{currentStep < messages.length - 1 ? 'Próxima Mensagem' : 'Concluir Desafio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
