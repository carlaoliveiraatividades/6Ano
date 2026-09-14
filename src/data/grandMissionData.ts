export interface GrandMissionStage {
  id: string;
  stepNumber: number;
  title: string;
  pillar: string;
  description: string;
  scenario: string;
  task: string;
  options?: { id: string; text: string; isCorrect: boolean; feedback: string }[];
  codeExercise?: {
    initialCode: string[];
    correctOrder: string[];
    explanation: string;
  };
}

export const GRAND_MISSION_DATA = {
  id: 'missao-final',
  title: 'A Escola do Futuro',
  badgeName: 'Mestre da Missão TIC',
  xpReward: 150,
  intro: `A escola está a preparar uma nova iniciativa digital para modernizar a aprendizagem.
A direção pediu ajuda aos Guardiões, Detetives, Criadores, Engenheiros e Exploradores da IA.

Precisamos de uma solução digital completa e segura que ajude toda a comunidade escolar.
Aceitas a missão de te tornares um Mestre da Missão TIC?`,
  stages: [
    {
      id: 'etapa-1',
      stepNumber: 1,
      title: 'Etapa 1 — Segurança e Privacidade',
      pillar: '🛡️ Guardião Digital',
      description: 'Auditoria ao novo Mural Digital da Escola.',
      scenario: `O novo mural online da escola foi publicado ontem. No perfil de teste de um aluno, encontrámos as seguintes informações:
Nome do Aluno: 'Vasco Silva'
Fotografia: 'Foto do Vasco no recreio com colegas'
Morada: 'Rua das Flores, N.º 12, 3.º Dt, Lisboa'
Localização em direto: 'Ativa (GPS no recreio)'
Password de acesso: 'vasco2013'`,
      task: 'Quais destas informações representam um perigo grave de privacidade e devem ser imediatamente removidas ou alteradas?',
      options: [
        {
          id: 'opt-1',
          text: 'A morada de casa, a localização em direto e a password previsível',
          isCorrect: true,
          feedback: 'Excelente análise de Guardião! A morada residencial, a localização em tempo real e uma palavra-passe previsível expõem gravemente o aluno.'
        },
        {
          id: 'opt-2',
          text: 'Apenas a fotografia do Vasco no recreio',
          isCorrect: false,
          feedback: 'Incorreto. A fotografia requer consentimento dos colegas, mas partilhar a morada de casa e a password em texto são falhas de segurança críticas.'
        },
        {
          id: 'opt-3',
          text: 'Nenhuma, todas as informações devem ser sempre públicas numa escola',
          isCorrect: false,
          feedback: 'Perigoso! Dados pessoais confidenciais nunca devem estar expostos publicamente.'
        }
      ]
    },
    {
      id: 'etapa-2',
      stepNumber: 2,
      title: 'Etapa 2 — Investigação e Combate à Desinformação',
      pillar: '🔎 Detetive Digital',
      description: 'Verificação de um boato viral no chat dos delegados de turma.',
      scenario: `Recebeste esta mensagem urgente:
'ATENÇÃO: Foi aprovada uma lei secreta que vai proibir computadores em todas as escolas portuguesas já na próxima segunda-feira! Partilha com todos os pais e alunos antes que apaguem a notícia!'
Origem: Canal anónimo 'NoticiasBombaPt' no Telegram, sem autor e sem qualquer ligação ao Ministério da Educação.`,
      task: 'Como deve agir o delegado de turma perante esta mensagem?',
      options: [
        {
          id: 'opt-1',
          text: 'Reencaminhar imediatamente para todos os grupos de pais e alunos para prevenir',
          isCorrect: false,
          feedback: 'Isso espalharia pânico injustificado sem qualquer confirmação.'
        },
        {
          id: 'opt-2',
          text: 'Verificar a informação no portal oficial do Ministério da Educação ou perguntar à Direção da Escola antes de partilhar boatos anónimos',
          isCorrect: true,
          feedback: 'Brilhante atitude de Detetive! Fontes anónimas e alarmistas exigem confirmação em canais oficiais.'
        },
        {
          id: 'opt-3',
          text: 'Acreditar porque a mensagem dizia que era urgente e secreta',
          isCorrect: false,
          feedback: 'Dizer que é "secreta" e "urgente" é uma estratégia clássica de manipulação para evitar que as pessoas investiguem.'
        }
      ]
    },
    {
      id: 'etapa-3',
      stepNumber: 3,
      title: 'Etapa 3 — Comunicação e Netiqueta',
      pillar: '💬 Criador Digital',
      description: 'Redação do convite para o Clube de Robótica.',
      scenario: `Precisas de enviar um email à Direção da Escola e a 30 encarregados de educação que não se conhecem entre si, apresentando o novo Clube Digital.`,
      task: 'Qual é o procedimento de envio mais respeitoso e conforme com as regras de privacidade?',
      options: [
        {
          id: 'opt-1',
          text: 'Colocar todos os 30 emails no campo "Para" em texto simples e aberto',
          isCorrect: false,
          feedback: 'Colocar contactos desconhecidos em "Para" expõe os emails privados de todas as famílias a terceiros.'
        },
        {
          id: 'opt-2',
          text: 'Colocar o email oficial da escola no campo "Para", os 30 encarregados de educação em "BCC" (cópia oculta), com assunto claro e saudação educada',
          isCorrect: true,
          feedback: 'Perfeito! O campo BCC protege os endereços das famílias e garante netiqueta exemplar.'
        },
        {
          id: 'opt-3',
          text: 'Enviar sem assunto e escrever apenas: "venham todos ao clube amanhã"',
          isCorrect: false,
          feedback: 'Uma mensagem formal requer assunto explícito, saudação e corpo de texto esclarecedor.'
        }
      ]
    },
    {
      id: 'etapa-4',
      stepNumber: 4,
      title: 'Etapa 4 — Algoritmia e Automatização',
      pillar: '🤖 Engenheiro Digital',
      description: 'Automatização do quiosque digital de empréstimo de livros.',
      scenario: `O quiosque da biblioteca tem um robô de leitura de cartões escolares.
O algoritmo atual tem um erro na ordem dos passos e bloqueia os cartões dos alunos:
Passo 1: Entregar o livro;
Passo 2: Ler o cartão do aluno;
Passo 3: Verificar se o aluno tem multas ou devoluções pendentes;
Passo 4: Registar o empréstimo no sistema.`,
      task: 'Qual é a ordem correta para garantir que nenhum livro sai sem confirmação?',
      options: [
        {
          id: 'opt-1',
          text: '1. Ler o cartão do aluno → 2. Verificar devoluções pendentes → 3. Registar o empréstimo → 4. Entregar o livro',
          isCorrect: true,
          feedback: 'Excelente lógica de Engenheiro! Primeiro identificamos o utilizador, validamos as condições de autorização, registamos a transação e só no final libertamos o recurso.'
        },
        {
          id: 'opt-2',
          text: '1. Entregar o livro → 2. Ler o cartão → 3. Desligar o computador → 4. Verificar multas',
          isCorrect: false,
          feedback: 'Entregar o livro antes de verificar o utilizador causaria perdas e erros no inventário da biblioteca.'
        }
      ]
    },
    {
      id: 'etapa-5',
      stepNumber: 5,
      title: 'Etapa 5 — Auditoria ao Assistente de IA',
      pillar: '🧠 Explorador da IA',
      description: 'Verificação das respostas do chatbot escolar.',
      scenario: `O chatbot escolar de IA respondeu o seguinte a um aluno que preparava uma visita de estudo:
'O Castelo de Guimarães foi construído em 1995 pelo arquiteto Cristiano Ronaldo e fica situado no meio do oceano Atlântico.'`,
      task: 'Como deve o Mestre da Missão TIC classificar esta resposta gerada pela IA?',
      options: [
        {
          id: 'opt-1',
          text: 'Está correta porque uma inteligência artificial tem acesso a todos os livros do mundo',
          isCorrect: false,
          feedback: 'Completamente errado! A resposta contém alucinações absurdas sobre a história de Portugal.'
        },
        {
          id: 'opt-2',
          text: 'É uma alucinação grave da IA com erros históricos e geográficos fictícios, devendo ser corrigida com dados de fontes fidedignas (século X, D. Afonso Henriques)',
          isCorrect: true,
          feedback: 'Exato! O Castelo de Guimarães remonta ao século X e à fundação de Portugal. Jamais devemos confiar cegamente em respostas da IA sem verificação.'
        }
      ]
    }
  ]
};
