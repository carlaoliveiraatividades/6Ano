import { WeeklyChallenge } from '../types';

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'wc-1',
    title: 'Consegues descobrir se esta mensagem é phishing?',
    subtitle: 'Alerta de Segurança Bancária e Escolar',
    category: 'Segurança',
    difficulty: 'Médio',
    xpReward: 50,
    question: 'Analisa atentamente o email recebido na caixa de correio escolar:',
    scenario: `De: suport-escola-segura123@gmail.com
Para: aluno@escola.pt
Assunto: URGENTE: A tua conta será eliminada em 10 minutos!

"Caro aluno, detetámos uma anomalia na tua conta da Missão TIC.
Para não perderes todos os teus trabalhos e os teus 320 XP, clica imediatamente no link abaixo e introduz a tua palavra-passe atual:
🔗 http://verificar-conta-escola-segura.xyz/login"`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Clicar logo no link e meter a password para não perder o progresso',
        isCorrect: false,
        feedback: 'Cuidado! Foi exatamente para isso que o burlão criou a mensagem urgente com ameaça de eliminar a conta.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Reconhecer que é Phishing: o remetente é um gmail estranho, há pressão urgente e o link aponta para um domínio suspeito (.xyz)',
        isCorrect: true,
        feedback: 'Excelente olhar de Guardião! Remetente não oficial (@gmail.com em vez de @escola.pt), pressão psicológica de 10 minutos e link externo desconhecido são sinais evidentes de phishing.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Reencaminhar a mensagem para todos os colegas da turma com a mesma password',
        isCorrect: false,
        feedback: 'Nunca deves partilhar nem espalhar tentativas de fraude entre colegas.'
      }
    ],
    explanation: 'Sinais de Phishing identificados: 1. Endereço falso de remetente gratuito; 2. Urgência excessiva com ameaça de perda de conta; 3. Pedido direto de palavra-passe através de endereço .xyz não oficial.'
  },
  {
    id: 'wc-2',
    title: 'Qual é a melhor password?',
    subtitle: 'Comprimento e Incerteza vs Complexidade',
    category: 'Passwords',
    difficulty: 'Fácil',
    xpReward: 50,
    question: 'Qual das seguintes palavras-passe é a mais segura para proteger a tua conta pessoal?',
    scenario: `O Pedro quer criar uma nova password para a sua conta de jogos e trabalhos escolares. Ele pensou em 4 alternativas:
1. Pedro2013!
2. 12345678
3. OMeuCaoTobiasGostaDeMelanciaNoOutono
4. password123`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Pedro2013! (porque tem o nome dele e um ponto de exclamação)',
        isCorrect: false,
        feedback: 'Usar o próprio nome e ano de nascimento é muito fácil de adivinhar por quem nos conhece.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: '12345678 (porque é apenas números rápidos)',
        isCorrect: false,
        feedback: 'É uma das palavras-passe mais pirateadas em todo o mundo em milissegundos.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'OMeúCaoTobiasGostaDeMelanciaNoOutono (uma frase longa, memorável e não previsível)',
        isCorrect: true,
        feedback: 'Correto! Uma frase-passe longa (passphrase) com mais de 25 caracteres é extremamente resistente a ataques de força bruta e muito mais fácil de memorizar.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'password123',
        isCorrect: false,
        feedback: 'Extremamente fraca e presente em todos os dicionários de ataques automáticos.'
      }
    ],
    explanation: 'O comprimento e a imprevisibilidade de uma frase são a defesa mais robusta contra programas automáticos de quebra de passwords.'
  },
  {
    id: 'wc-3',
    title: 'Qual destas fontes é mais credível?',
    subtitle: 'Pesquisa e Credibilidade de Fontes',
    category: 'Fontes',
    difficulty: 'Médio',
    xpReward: 50,
    question: 'Precisas de dados sobre a temperatura média em Portugal para um trabalho de Ciências. Onde deves recolher a informação?',
    scenario: `Estás a comparar 3 fontes encontradas na web sobre as temperaturas registadas em Portugal no último verão:
Fonte 1: Um vídeo curto no TikTok de um utilizador anónimo a dizer que fez 60 graus na sua varanda.
Fonte 2: Portal oficial do IPMA (Instituto Português do Mar e da Atmosfera) com relatório climatológico assinado por meteorologistas.
Fonte 3: Um fórum de discussão de videojogos com um comentário de há 5 anos.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Fonte 1, porque o vídeo tem 100 mil gostos',
        isCorrect: false,
        feedback: 'Gostos não garantem rigor meteorológico; medições em varandas ao sol não são dados científicos.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Fonte 2: O portal oficial do IPMA com dados técnicos fundamentados e autoria institucional verificada',
        isCorrect: true,
        feedback: 'Perfeito! O IPMA é a autoridade pública oficial para meteorologia e clima em Portugal, com medições rigorosas e cientificamente validadas.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Fonte 3: O fórum antigo de jogos',
        isCorrect: false,
        feedback: 'Fontes sem contexto e desatualizadas não servem para estudos rigorosos.'
      }
    ],
    explanation: 'A credibilidade de uma fonte depende da sua autoridade no assunto, método de recolha de dados, autoria identificada e transparência de processos.'
  },
  {
    id: 'wc-4',
    title: 'Encontra o erro no algoritmo',
    subtitle: 'Debugging de Robô Escolar',
    category: 'Programação',
    difficulty: 'Difícil',
    xpReward: 50,
    question: 'O robô aspirador da sala de aula precisa de limpar um corredor com 3 metros e regressar à base.',
    scenario: `O algoritmo programado foi:
1. Avançar 1 metro
2. Avançar 1 metro
3. Avançar 1 metro
4. Limpar o chão
5. Desligar de imediato

Resultado: O robô limpou, mas ficou parado no fim do corredor sem voltar à base e os alunos tropeçaram nele!`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'O erro é não ter colocado a instrução de virar 180º e recuar 3 metros até à base antes de desligar',
        isCorrect: true,
        feedback: 'Excelente debugging! Faltou o algoritmo prever o regresso à base antes de terminar a rotina.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'O robô devia ter avançado 10 metros para a rua',
        isCorrect: false,
        feedback: 'Isso bateria contra a parede ou sairia do edifício escolar.'
      }
    ],
    explanation: 'Em algoritmos de robótica, garantir a condição final (retorno em segurança à estação de carregamento) é fundamental.'
  },
  {
    id: 'wc-5',
    title: 'Melhora este prompt de IA',
    subtitle: 'Engenharia de Prompts',
    category: 'IA',
    difficulty: 'Médio',
    xpReward: 50,
    question: 'Qual é a melhor forma de melhorar o prompt "Faz um texto sobre o espaço"?',
    scenario: `A Mariana precisa de um resumo para a disciplina de Físico-Química sobre os planetas rochosos do Sistema Solar para apresentar à turma do 6.º ano durante 2 minutos.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: '"Escreve um resumo de 2 minutos para alunos do 6.º ano sobre os 4 planetas rochosos do Sistema Solar (Mercúrio, Vénus, Terra, Marte), em tópicos simples e linguagem clara"',
        isCorrect: true,
        feedback: 'Excelente! Especifica tema exato, público-alvo, tempo de leitura e formato em tópicos.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: '"Espaço tudo rápido"',
        isCorrect: false,
        feedback: 'Vago e sem qualquer especificação de formato ou audiência.'
      }
    ],
    explanation: 'Prompts claros, com contexto, delimitação de tema e formato pretendido produzem respostas muito mais úteis e de maior qualidade.'
  }
];
