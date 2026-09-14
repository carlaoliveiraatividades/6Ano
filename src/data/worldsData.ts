import { World } from '../types';

export const WORLDS_DATA: World[] = [
  // ==========================================
  // MUNDO 1 — GUARDIÃO DIGITAL
  // ==========================================
  {
    id: 'mundo-1',
    number: 1,
    title: 'Guardião Digital',
    theme: 'Segurança, Privacidade e Bem-estar',
    icon: 'ShieldCheck',
    color: 'blue',
    bgGradient: 'from-blue-600 to-indigo-700',
    description: `Bem-vindo, Guardião Digital!

A Internet permite aprender, comunicar, jogar e criar.
Mas também existem riscos.

Neste Mundo vais aprender a proteger as tuas contas, os teus dados e a tua identidade digital.

A regra principal é:
PENSA ANTES DE CLICAR.
PENSA ANTES DE PARTILHAR.
PENSA ANTES DE PUBLICAR.`,
    summary: 'Protege as tuas contas, passwords, privacidade e aprende a detetar fraudes e phishing.',
    activitiesCount: 6,
    badgeId: 'badge-guardiao',
    badgeName: 'Guardião Digital',
    badgeIcon: 'Shield',
    sections: {
      descobre: [
        {
          title: '4.1 Palavras-passe (Passwords)',
          content: [
            'Uma palavra-passe protege uma conta.',
            'Uma boa palavra-passe deve ser difícil de adivinhar.',
            'É importante que seja longa e única.',
            'Não deves utilizar a mesma palavra-passe em todas as contas.',
            'Também podes utilizar um gestor de palavras-passe e, quando estiver disponível, autenticação multifator.'
          ],
          examples: {
            bad: ['123456', 'password', 'maria2013', 'futebol123'],
            good: ['Uma frase longa e única que não seja previsível (ex: OMeuGatoComeMacaEmAgosto!)']
          },
          importantNote: 'Não ensinamos que uma password é segura apenas porque tem uma maiúscula, um número ou um símbolo. O comprimento, a unicidade e a não reutilização entre serviços são os fatores essenciais.',
          quickQuiz: [
            {
              question: 'Qual destas opções é uma boa característica de uma palavra-passe?',
              options: [
                { label: 'A', text: 'Ser curta' },
                { label: 'B', text: 'Ser longa e única' },
                { label: 'C', text: 'Ter o nosso nome' },
                { label: 'D', text: 'Ser igual em todas as contas' }
              ],
              correctAnswer: 'B',
              feedback: 'Exatamente! Uma palavra-passe longa e única torna mais difícil que alguém a adivinhe ou que uma falha numa conta afete as outras.'
            },
            {
              question: 'Qual destas palavras-passe é claramente fraca?',
              options: [
                { label: 'A', text: '123456' },
                { label: 'B', text: 'Uma frase longa e única' },
                { label: 'C', text: 'Uma password gerada por um gestor' },
                { label: 'D', text: 'Uma password diferente das outras contas' }
              ],
              correctAnswer: 'A',
              feedback: '123456 é extremamente previsível e está em quase todas as listas de palavras-passe mais atacadas do mundo.'
            },
            {
              question: 'Devemos usar a mesma password em todas as contas?',
              options: [
                { label: 'A', text: 'Sim' },
                { label: 'B', text: 'Não' }
              ],
              correctAnswer: 'B',
              feedback: 'Se uma conta for comprometida, reutilizar a mesma password pode colocar todas as outras contas em risco imediato.'
            }
          ]
        },
        {
          title: '4.4 Phishing',
          content: [
            'Phishing é uma tentativa de enganar alguém para conseguir informação, dinheiro ou acesso a uma conta.',
            'Pode acontecer através de emails, mensagens ou redes sociais.',
            'Alguns sinais de alerta a procurar:',
            '• Pedido inesperado',
            '• Link suspeito ou estranho',
            '• Remetente estranho ou com pequenas alterações no nome',
            '• Pedido de informação privada ou palavras-passe',
            '• Erros ortográficos ou linguagem pouco habitual',
            '• Pressão para agir rapidamente ("Clica já nos próximos 5 minutos!")',
            '• Endereço de site estranho ou não oficial'
          ],
          importantNote: 'Não significa que toda a mensagem urgente seja phishing! Devemos analisar o conjunto de sinais com calma e atenção.'
        },
        {
          title: '4.6 Privacidade — O Que Posso Partilhar?',
          content: [
            'Nem toda a informação sobre nós deve ser publicada na Internet.',
            'Antes de partilhares alguma coisa, pensa sempre nestas 4 perguntas:',
            '1. Quem vai ver?',
            '2. Esta informação é privada?',
            '3. Pode ser usada para descobrir onde estou agora?',
            '4. Eu ficaria confortável se muitas pessoas e desconhecidos a vissem?'
          ]
        },
        {
          title: '4.8 Pegada Digital',
          content: [
            'A pegada digital é o conjunto de informações e registos que deixamos quando utilizamos serviços digitais.',
            'Publicações, comentários, fotografias, pesquisas e outras atividades podem contribuir para essa pegada duradoura no tempo.'
          ],
          quickQuiz: [
            {
              question: 'Qual destas ações pode contribuir para a tua pegada digital?',
              options: [
                { label: 'A', text: 'Publicar uma fotografia' },
                { label: 'B', text: 'Fazer um comentário' },
                { label: 'C', text: 'Criar uma conta' },
                { label: 'D', text: 'Todas as anteriores' }
              ],
              correctAnswer: 'D',
              feedback: 'Correto! Quase todas as nossas ações em plataformas digitais deixam registos que compõem a nossa pegada digital.'
            }
          ]
        },
        {
          title: '4.9 Ergonomia e Bem-estar Físico',
          content: [
            'Passar muito tempo com dispositivos também exige atenção ao nosso bem-estar físico.',
            'É importante:',
            '• Ter uma posição confortável e adaptada;',
            '• Ajustar a altura do ecrã e a iluminação da sala;',
            '• Fazer pausas regulares (regra do 20-20-20: a cada 20 minutos, olhar 20 segundos para longe);',
            '• Variar a postura e esticar pernas e braços;',
            '• Evitar ficar demasiado tempo rígido na mesma posição.'
          ],
          importantNote: 'Não existem regras rígidas universais com ângulos milimétricos idênticos para todos. O segredo é conforto, variação de postura e pausas frequentes.'
        }
      ],
      experimenta: [
        {
          id: 'sim-password',
          title: '🔐 Constrói uma Password Forte',
          type: 'simulator',
          description: 'Testa opções pré-definidas ou constrói a tua palavra-passe com blocos e avalia o comprimento, unicidade e previsibilidade.',
          xpReward: 30
        },
        {
          id: 'sim-phishing',
          title: '🎣 Apanha o Burlão!',
          type: 'simulator',
          description: 'Inspeciona 3 mensagens reais de mensagens e email, deteta sinais de alerta e toma a decisão mais segura.',
          xpReward: 30
        },
        {
          id: 'sim-privacy',
          title: '🕵️ O Que Posso Partilhar?',
          type: 'simulator',
          description: 'Classifica 7 situações da vida quotidiana: Nunca Partilhar, Pensar Antes / Perguntar, ou Seguro.',
          xpReward: 30
        }
      ],
      desafio: {
        id: 'desafio-avatar',
        title: 'Protege o teu Avatar',
        description: 'O aluno Rui criou um perfil público online. Analisa os 6 dados do perfil e decide o que pode ser partilhado, o que exige cuidado e o que deve ser 100% privado.',
        instructions: 'Arrasta ou seleciona o nível de privacidade correto para o Nome, Fotografia, Escola, Localização, Password e Interesses do Rui.',
        xpReward: 40
      },
      missaoReal: {
        id: 'missao-guia-guardiao',
        title: 'Cria o Guia do Guardião Digital',
        subtitle: 'Missão Prática de Cidadania Digital',
        description: 'Cria 5 regras pessoais e práticas para ti e para a tua turma utilizarem a Internet e os dispositivos de forma responsável e segura.',
        defaultRulesCount: 5,
        placeholderExamples: [
          'Não partilhar passwords com ninguém, exceto encarregados de educação.',
          'Verificar links suspeitos antes de clicar.',
          'Pensar duas vezes antes de publicar fotografias pessoais.',
          'Não publicar a morada de casa nem localização em tempo real.',
          'Pedir ajuda a um adulto de confiança quando alguma mensagem parecer estranha.'
        ],
        xpReward: 50
      },
      avaliacao: {
        id: 'aval-mundo-1',
        title: 'Avaliação Final — Guardião Digital',
        description: '8 perguntas para comprovar os teus conhecimentos e desbloquear o crachá oficial de Guardião Digital.',
        passingScore: 75,
        xpReward: 60,
        questions: [
          {
            id: 1,
            question: 'O que torna uma password mais segura?',
            options: [
              { label: 'A', text: 'Ser curta' },
              { label: 'B', text: 'Ser longa e única' },
              { label: 'C', text: 'Ter o nosso nome' },
              { label: 'D', text: 'Ser igual em todas as contas' }
            ],
            correctAnswer: 'B',
            explanation: 'Uma palavra-passe longa e única é muito mais difícil de adivinhar ou quebrar através de ataques automáticos.'
          },
          {
            id: 2,
            question: 'O que é phishing?',
            options: [
              { label: 'A', text: 'Um jogo de pesca online' },
              { label: 'B', text: 'Uma tentativa de enganar alguém para obter informação' },
              { label: 'C', text: 'Um programa antivírus' },
              { label: 'D', text: 'Um navegador de internet' }
            ],
            correctAnswer: 'B',
            explanation: 'Phishing é uma técnica de engenharia social que tenta iludir utilizadores fingindo ser entidades legítimas.'
          },
          {
            id: 3,
            question: 'Recebes uma mensagem inesperada a pedir a tua password. O que fazes?',
            options: [
              { label: 'A', text: 'Enviar imediatamente' },
              { label: 'B', text: 'Publicar nas redes sociais' },
              { label: 'C', text: 'Verificar através de um canal oficial e não enviar a password' },
              { label: 'D', text: 'Reencaminhar para amigos' }
            ],
            correctAnswer: 'C',
            explanation: 'Nenhuma plataforma ou entidade fidedigna solicita a tua palavra-passe por mensagem ou email.'
          },
          {
            id: 4,
            question: 'O que é pegada digital?',
            options: [
              { label: 'A', text: 'Uma impressão digital do dedo no ecrã' },
              { label: 'B', text: 'Registos e informações associados à utilização digital' },
              { label: 'C', text: 'Um vírus de computador' },
              { label: 'D', text: 'Um cabo de rede' }
            ],
            correctAnswer: 'B',
            explanation: 'A pegada digital engloba o rasto de publicações, dados, contas e interações que acumulamos online.'
          },
          {
            id: 5,
            question: 'Deves publicar a fotografia de outra pessoa sem perguntar?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'Devemos sempre respeitar a privacidade e consentimento dos outros antes de partilhar imagens deles.'
          },
          {
            id: 6,
            question: 'Qual é uma boa prática para o bem-estar físico com dispositivos?',
            options: [
              { label: 'A', text: 'Nunca fazer pausas' },
              { label: 'B', text: 'Variar a postura e fazer pausas regulares' },
              { label: 'C', text: 'Ficar sempre exatamente na mesma posição imóvel' },
              { label: 'D', text: 'Utilizar dispositivos no escuro sem parar' }
            ],
            correctAnswer: 'B',
            explanation: 'Fazer pausas e variar a postura previne fadiga ocular e dores musculares nas costas e pescoço.'
          },
          {
            id: 7,
            question: 'Uma mensagem urgente é sempre phishing?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'Nem toda a mensagem urgente é burla, mas a urgência excessiva é um sinal de alerta que exige atenção acrescida.'
          },
          {
            id: 8,
            question: 'O que fazer perante um link suspeito?',
            options: [
              { label: 'A', text: 'Clicar depressa para ver o que é' },
              { label: 'B', text: 'Partilhar com a turma toda' },
              { label: 'C', text: 'Verificar com cuidado e não clicar se parecer duvidoso' },
              { label: 'D', text: 'Introduzir a tua password para testar' }
            ],
            correctAnswer: 'C',
            explanation: 'Verificar o endereço real sem clicar e confirmar através de canais oficiais é o comportamento mais seguro.'
          }
        ]
      }
    }
  },

  // ==========================================
  // MUNDO 2 — DETETIVE DIGITAL
  // ==========================================
  {
    id: 'mundo-2',
    number: 2,
    title: 'Detetive Digital',
    theme: 'Pesquisa, Fontes e Pensamento Crítico',
    icon: 'Search',
    color: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    description: `Há milhões de páginas na Internet.
Mas encontrar uma resposta não significa encontrar uma resposta verdadeira.

Neste Mundo vais aprender a investigar como um verdadeiro detetive da informação.`,
    summary: 'Aprende a escolher palavras-chave, avaliar fontes, detetar desinformação e imagens fora de contexto.',
    requiredWorldId: 'mundo-1',
    activitiesCount: 6,
    badgeId: 'badge-detetive',
    badgeName: 'Detetive Digital',
    badgeIcon: 'Search',
    sections: {
      descobre: [
        {
          title: '5.1 Pesquisar e Palavras-chave',
          content: [
            'Antes de começar uma pesquisa, pensa no que queres descobrir.',
            'Depois escolhe palavras-chave.',
            'Palavras-chave são termos importantes e específicos que ajudam os motores de busca a encontrar informação diretamente relacionada com o que procuramos.'
          ],
          examples: {
            bad: ['animais', 'coisas que estão a morrer'],
            good: ['animais em perigo de extinção em Portugal']
          },
          quickQuiz: [
            {
              question: 'Qual é a melhor pesquisa para descobrir animais em perigo de extinção em Portugal?',
              options: [
                { label: 'A', text: 'animais' },
                { label: 'B', text: 'bichos' },
                { label: 'C', text: 'animais em perigo de extinção em Portugal' },
                { label: 'D', text: 'Google animais' }
              ],
              correctAnswer: 'C',
              feedback: 'Quanto mais específica for a pesquisa, maior é a probabilidade de encontrares informação relevante e fidedigna!'
            }
          ]
        },
        {
          title: '5.3 Fontes de Informação',
          content: [
            'Uma fonte é o local ou entidade onde encontramos informação.',
            'Quando investigamos, devemos colocar estas 5 perguntas fundamentais:',
            '1. Quem escreveu? (Tem autor identificado e qualificação?)',
            '2. Quando foi publicado? (A data é recente e atualizada?)',
            '3. Existem provas e referências científicas?',
            '4. A informação aparece noutras fontes independentes?',
            '5. Qual é o objetivo da página? (Informar, vender ou enganar?)'
          ],
          quickQuiz: [
            {
              question: 'Qual destas fontes parece mais adequada para uma pesquisa escolar?',
              options: [
                { label: 'A', text: 'Um comentário anónimo numa rede social' },
                { label: 'B', text: 'Uma publicação num blog sem autor nem data' },
                { label: 'C', text: 'Uma fonte identificada que apresenta evidências e dados' },
                { label: 'D', text: 'Um meme que viste no telemóvel' }
              ],
              correctAnswer: 'C',
              feedback: 'Excelente! Fontes identificadas com dados e evidências verificáveis garantem rigor no teu trabalho.'
            }
          ]
        },
        {
          title: '5.7 Pensamento Crítico',
          content: [
            'Uma informação ter milhares de "gostos" ou partilhas não significa que seja verdadeira.',
            'Uma fotografia verdadeira pode ser manipulada ou utilizada com uma explicação totalmente falsa (fora de contexto).',
            'Um título pode ser exagerado (clickbait) só para atrair cliques.',
            'Uma publicação pode misturar factos verdadeiros com opiniões pessoais sem fundamento.'
          ]
        }
      ],
      experimenta: [
        {
          id: 'sim-news-detective',
          title: '📰 Detetives das Notícias',
          type: 'simulator',
          description: 'Analisa a manchete "Água azul torna pessoas mais inteligentes!" e investiga autor, data e evidências.',
          xpReward: 30
        },
        {
          id: 'sim-photo-context',
          title: '📸 Foto Fora do Contexto',
          type: 'simulator',
          description: 'Uma fotografia partilhada como sendo de ontem em Lisboa foi tirada há 8 anos noutro país. Como investigar?',
          xpReward: 30
        }
      ],
      desafio: {
        id: 'desafio-operacao-noticia',
        title: 'Operação Notícia',
        description: 'Recebeste uma notícia viral com um título sensacionalista. Aplica a checklist dos 5 passos e classifica a notícia.',
        instructions: 'Responde às 5 perguntas de verificação: 1. Quem publicou? 2. Quando? 3. Existem evidências? 4. Outras fontes confirmam? 5. O título corresponde ao texto? No final, classifica em Fiável, Precisa de verificação ou Não há evidências suficientes.',
        xpReward: 40
      },
      missaoReal: {
        id: 'missao-kit-detetive',
        title: 'Cria o Kit do Detetive',
        subtitle: 'Ferramenta de Verificação de Factos',
        description: 'Define as 5 perguntas de ouro que qualquer aluno deve fazer antes de partilhar uma notícia ou trabalho escolar.',
        defaultRulesCount: 5,
        placeholderExamples: [
          'Quem publicou a informação e qual é a sua credibilidade?',
          'Quando foi publicado o artigo ou tirada a fotografia?',
          'Existem dados, estudos ou evidências reais que comprovem a afirmação?',
          'Outros jornais ou entidades reconhecidas confirmam a mesma notícia?',
          'O título reflete com honestidade o conteúdo do texto?'
        ],
        xpReward: 50
      },
      avaliacao: {
        id: 'aval-mundo-2',
        title: 'Avaliação Final — Detetive Digital',
        description: '8 perguntas para comprovar os teus dotes de investigação crítica na web.',
        passingScore: 75,
        xpReward: 60,
        questions: [
          {
            id: 1,
            question: 'Para que servem palavras-chave?',
            options: [
              { label: 'A', text: 'Para bloquear o computador' },
              { label: 'B', text: 'Para ajudar a encontrar informação relevante' },
              { label: 'C', text: 'Para substituir a password' },
              { label: 'D', text: 'Para formatar o texto em negrito' }
            ],
            correctAnswer: 'B',
            explanation: 'Palavras-chave filtram os resultados e ajudam os motores de busca a encontrar exatamente o que precisas.'
          },
          {
            id: 2,
            question: 'Muitos gostos provam que uma informação é verdadeira?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'A popularidade ou número de partilhas não é sinónimo de veracidade; notícias falsas espalham-se muitas vezes rapidamente.'
          },
          {
            id: 3,
            question: 'O que devemos verificar numa fonte?',
            options: [
              { label: 'A', text: 'Apenas a cor de fundo' },
              { label: 'B', text: 'Apenas o número de imagens' },
              { label: 'C', text: 'Apenas os anúncios' },
              { label: 'D', text: 'Autor, data e evidências' }
            ],
            correctAnswer: 'D',
            explanation: 'Conhecer quem escreveu, em que data e quais as evidências é essencial para validar a credibilidade.'
          },
          {
            id: 4,
            question: 'Uma fotografia verdadeira pode ser usada num contexto falso?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'A',
            explanation: 'Sim, uma fotografia autêntica tirada há anos pode ser republicada com uma legenda falsa para enganar as pessoas.'
          },
          {
            id: 5,
            question: 'O primeiro resultado de pesquisa é sempre o melhor?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'Os primeiros resultados podem ser anúncios pagos ou páginas otimizadas para cliques, não necessariamente as mais fidedignas.'
          },
          {
            id: 6,
            question: 'O que fazer perante uma afirmação surpreendente na internet?',
            options: [
              { label: 'A', text: 'Acreditar logo e reencaminhar' },
              { label: 'B', text: 'Verificar noutras fontes antes de acreditar' },
              { label: 'C', text: 'Ignorar o professor e copiar' },
              { label: 'D', text: 'Apagar o computador' }
            ],
            correctAnswer: 'B',
            explanation: 'Afirmações extraordinárias exigem verificação em múltiplas fontes independentes e credíveis.'
          },
          {
            id: 7,
            question: 'Qual é uma boa fonte?',
            options: [
              { label: 'A', text: 'Um perfil falso sem publicações' },
              { label: 'B', text: 'Uma fonte identificada que apresenta evidências' },
              { label: 'C', text: 'Um boato contado no recreio' },
              { label: 'D', text: 'Uma página sem contactos nem data' }
            ],
            correctAnswer: 'B',
            explanation: 'Transparência de autoria e fundamentação com factos distinguem fontes com credibilidade.'
          },
          {
            id: 8,
            question: 'O que é pensamento crítico?',
            options: [
              { label: 'A', text: 'Analisar informação com cuidado antes de aceitar uma conclusão' },
              { label: 'B', text: 'Criticar e insultar todas as pessoas' },
              { label: 'C', text: 'Aceitar tudo o que o primeiro site diz' },
              { label: 'D', text: 'Desligar a internet' }
            ],
            correctAnswer: 'A',
            explanation: 'Pensamento crítico é a capacidade de avaliar argumentos, factos e fontes de forma lógica e fundamentada.'
          }
        ]
      }
    }
  },

  // ==========================================
  // MUNDO 3 — CRIADOR DIGITAL
  // ==========================================
  {
    id: 'mundo-3',
    number: 3,
    title: 'Criador Digital',
    theme: 'Comunicação, Colaboração e Direitos de Autor',
    icon: 'MessageSquare',
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-teal-700',
    description: `Comunicar online também exige responsabilidade.

Neste Mundo vais aprender a escrever, colaborar, respeitar e criar sem prejudicar o trabalho dos outros.`,
    summary: 'Domina a netiqueta, escreve emails claros, aprende as diferenças entre CC e BCC, e respeita direitos de autor e licenças.',
    requiredWorldId: 'mundo-2',
    activitiesCount: 6,
    badgeId: 'badge-criador',
    badgeName: 'Criador Digital',
    badgeIcon: 'PenTool',
    sections: {
      descobre: [
        {
          title: '6.1 Netiqueta',
          content: [
            'Netiqueta é o conjunto de boas práticas para comunicar e comportarmo-nos de forma respeitosa na Internet.',
            'Regras essenciais:',
            '• Respeitar os outros utilizadores;',
            '• Evitar insultos e linguagem agressiva;',
            '• Pensar antes de publicar comentários;',
            '• Não espalhar rumores ou falsidades;',
            '• Respeitar opiniões diferentes de forma construtiva;',
            '• Pedir ajuda imediatamente perante situações de cyberbullying.'
          ]
        },
        {
          title: '6.3 Email Claro e Adequado',
          content: [
            'Um email deve ser claro, bem estruturado e adequado à pessoa que o recebe.',
            'Antes de enviar, verifica sempre:',
            '1. Destinatário (endereço correto)',
            '2. Assunto (resumo claro do motivo)',
            '3. Saudação respeitosa ("Bom dia, professor...")',
            '4. Mensagem estruturada e sem abreviaturas exageradas',
            '5. Anexos anexados quando necessário',
            '6. Despedida e assinatura educada ("Obrigado, João Silva, N.º 5").'
          ]
        },
        {
          title: '6.5 CC e BCC',
          content: [
            'Quando enviamos uma mensagem eletrónica para várias pessoas, podemos utilizar os campos CC ou BCC:',
            '• CC (Com Conhecimento / Carbon Copy): Os destinatários conseguem ver todos os outros endereços de email que receberam a mensagem.',
            '• BCC (Com Cópia Oculta / Blind Carbon Copy): Os destinatários não conseguem ver os outros endereços colocados neste campo. É ideal para proteger a privacidade dos contactos.'
          ]
        },
        {
          title: '6.7 Direitos de Autor e Plágio',
          content: [
            'Nem tudo o que encontramos na Internet pode ser copiado e utilizado sem restrições.',
            'As obras e criações podem estar protegidas por direitos de autor.',
            'Devemos verificar as condições de utilização e respeitar as licenças (como as licenças Creative Commons).',
            'Plágio é apresentar o trabalho ou as ideias de outra pessoa como se fossem nossas.',
            'Direitos de autor e plágio estão relacionados, mas não são a mesma coisa: podemos até ter autorização para usar um texto, mas se não indicarmos a autoria cometemos plágio moral.'
          ],
          importantNote: 'Não afirmamos que todo o plágio é crime nem que todo o copyleft tem exatamente as mesmas regras. Existem licenças públicas diversas com termos próprios.'
        }
      ],
      experimenta: [
        {
          id: 'sim-netiquette',
          title: '💬 Como Falamos Online?',
          type: 'simulator',
          description: 'Situações interativas de diálogo entre colegas e equipas. Escolhe a forma mais respeitosa e construtiva de comunicar.',
          xpReward: 30
        },
        {
          id: 'sim-email',
          title: '✉️ Escreve o Email',
          type: 'simulator',
          description: 'Constrói um email formal ao professor a pedir ajuda num trabalho de TIC, preenchendo os campos essenciais.',
          xpReward: 30
        },
        {
          id: 'sim-bcc',
          title: '📧 Para Quem Vai o Email?',
          type: 'simulator',
          description: 'Aprende na prática quando deves usar Para, CC ou BCC para proteger os emails da turma.',
          xpReward: 30
        },
        {
          id: 'sim-copyright',
          title: '©️ Posso Usar Isto?',
          type: 'simulator',
          description: 'Analisa 4 casos reais de imagens, textos e licenças de domínio público para decidir como utilizar de forma legal.',
          xpReward: 30
        }
      ],
      desafio: {
        id: 'desafio-corrige-mensagem',
        title: 'Corrige a Mensagem',
        description: 'Um aluno escreveu: "ola professor preciso de ajuda mandei o trabalho veja ai". Transforma esta mensagem numa comunicação formal e correta.',
        instructions: 'Escreve a versão corrigida incluindo saudação formal, assunto claro, explicação do pedido de ajuda e despedida educada.',
        xpReward: 40
      },
      missaoReal: {
        id: 'missao-codigo-comunicacao',
        title: 'Código de Comunicação da Turma',
        subtitle: 'Regras de Netiqueta para o Grupo',
        description: 'Cria 7 regras de comunicação respeitosa e colaborativa para os chats e emails da tua turma.',
        defaultRulesCount: 7,
        placeholderExamples: [
          'Tratar todos os colegas com respeito e sem alcunhas ofensivas.',
          'Antes de enviar uma mensagem, reler com atenção para evitar mal-entendidos.',
          'Não partilhar capturas de ecrã de conversas privadas sem autorização.',
          'Colocar os emails em BCC quando enviamos para contactos que não se conhecem.',
          'Ajudar os colegas que têm dúvidas sem gozar nem excluir.',
          'Dar sempre crédito às fontes e autores de imagens e textos nos trabalhos de grupo.',
          'Avisar um professor ou adulto de confiança perante qualquer sinal de cyberbullying.'
        ],
        xpReward: 50
      },
      avaliacao: {
        id: 'aval-mundo-3',
        title: 'Avaliação Final — Criador Digital',
        description: '8 perguntas sobre netiqueta, correio eletrónico e direitos de autor.',
        passingScore: 75,
        xpReward: 60,
        questions: [
          {
            id: 1,
            question: 'O que é netiqueta?',
            options: [
              { label: 'A', text: 'Um cabo de rede moderno' },
              { label: 'B', text: 'Boas práticas de comportamento e respeito online' },
              { label: 'C', text: 'Uma marca de computadores' },
              { label: 'D', text: 'Um programa de desenho' }
            ],
            correctAnswer: 'B',
            explanation: 'Netiqueta resulta da junção de "Net" (rede) com "etiqueta", significando bom senso e boas maneiras online.'
          },
          {
            id: 2,
            question: 'O que devemos fazer antes de enviar um email?',
            options: [
              { label: 'A', text: 'Desligar o monitor' },
              { label: 'B', text: 'Apagar todos os contactos' },
              { label: 'C', text: 'Escrever tudo em maiúsculas aos gritos' },
              { label: 'D', text: 'Rever destinatário, assunto, mensagem e anexos' }
            ],
            correctAnswer: 'D',
            explanation: 'Rever o destinatário, o assunto e o anexo previne o envio de emails incompletos ou para pessoas erradas.'
          },
          {
            id: 3,
            question: 'Qual a principal diferença entre CC e BCC?',
            options: [
              { label: 'A', text: 'BCC permite ocultar os destinatários entre si' },
              { label: 'B', text: 'CC envia o email mais rápido' },
              { label: 'C', text: 'BCC apaga o email depois de lido' },
              { label: 'D', text: 'Não há qualquer diferença' }
            ],
            correctAnswer: 'A',
            explanation: 'O campo BCC oculta os endereços dos destinatários, protegendo a privacidade de todos.'
          },
          {
            id: 4,
            question: 'Podemos copiar qualquer imagem da Internet livremente para os nossos projetos?',
            options: [
              { label: 'A', text: 'Sim, se estiver no Google é pública' },
              { label: 'B', text: 'Não, devemos verificar a licença e os direitos de autor' }
            ],
            correctAnswer: 'B',
            explanation: 'As imagens pertencem aos seus autores; só podemos usá-las de acordo com as permissões da licença.'
          },
          {
            id: 5,
            question: 'O que é plágio?',
            options: [
              { label: 'A', text: 'Comprar um teclado novo' },
              { label: 'B', text: 'Apresentar trabalho ou ideias de outra pessoa como nossas' },
              { label: 'C', text: 'Traduzir uma página web com autorização' },
              { label: 'D', text: 'Fazer uma pergunta ao professor' }
            ],
            correctAnswer: 'B',
            explanation: 'Plagiar é apropriar-se do trabalho intelectual de outrem sem atribuição de autoria.'
          },
          {
            id: 6,
            question: 'Devemos publicar a fotografia de um colega sem perguntar primeiro?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'A imagem de cada pessoa é privada; é fundamental obter consentimento prévio.'
          },
          {
            id: 7,
            question: 'Uma licença de conteúdos pode indicar:',
            options: [
              { label: 'A', text: 'Como uma obra pode ser reutilizada e atribuída' },
              { label: 'B', text: 'A velocidade da ligação de internet' },
              { label: 'C', text: 'O tamanho da memória RAM' },
              { label: 'D', text: 'O nome do computador' }
            ],
            correctAnswer: 'A',
            explanation: 'As licenças estabelecem as condições legais para copiar, modificar ou partilhar uma obra.'
          },
          {
            id: 8,
            question: 'Uma mensagem online num ambiente escolar deve ser:',
            options: [
              { label: 'A', text: 'Agressiva e rápida' },
              { label: 'B', text: 'Cheia de ofensas em tom de piada' },
              { label: 'C', text: 'Totalmente incompreensível' },
              { label: 'D', text: 'Clara, respeitosa e construtiva' }
            ],
            correctAnswer: 'D',
            explanation: 'Comunicar com clareza e respeito promove uma comunidade escolar digital saudável e produtiva.'
          }
        ]
      }
    }
  },

  // ==========================================
  // MUNDO 4 — ENGENHEIRO DIGITAL
  // ==========================================
  {
    id: 'mundo-4',
    number: 4,
    title: 'Engenheiro Digital',
    theme: 'Pensamento Computacional, Algoritmos e Dados',
    icon: 'Terminal',
    color: 'indigo',
    bgGradient: 'from-indigo-600 to-purple-700',
    description: `Os computadores seguem instruções precisas.

Neste Mundo vais aprender a pensar como um verdadeiro programador.
Vais dividir problemas, criar sequências, utilizar decisões, repetições e procurar erros no código.`,
    summary: 'Aprende algoritmos, condições (SE/SENÃO), ciclos (REPETIR), faz debugging e organiza tabelas de dados.',
    requiredWorldId: 'mundo-3',
    activitiesCount: 6,
    badgeId: 'badge-engenheiro',
    badgeName: 'Engenheiro Digital',
    badgeIcon: 'Cpu',
    sections: {
      descobre: [
        {
          title: '7.1 Algoritmos',
          content: [
            'Um algoritmo é uma sequência organizada e finita de passos utilizada para resolver um problema ou realizar uma tarefa.',
            'Exemplo quotidiano — Preparar uma sanduíche:',
            '1. Pegar nas duas fatias de pão;',
            '2. Colocar o recheio numa das fatias;',
            '3. Fechar a sanduíche sobrepondo o pão;',
            '4. Servir.'
          ],
          quickQuiz: [
            {
              question: 'O que é um algoritmo?',
              options: [
                { label: 'A', text: 'Uma fotografia digital' },
                { label: 'B', text: 'Uma sequência organizada de passos' },
                { label: 'C', text: 'Um vírus de computador' },
                { label: 'D', text: 'Uma password forte' }
              ],
              correctAnswer: 'B',
              feedback: 'Perfeito! Tal como uma receita de culinária, um algoritmo dita passo a passo como cumprir um objetivo.'
            }
          ]
        },
        {
          title: '7.4 Condições (Decisões)',
          content: [
            'Uma condição permite ao computador tomar uma decisão com base num teste lógico.',
            'Exemplo do dia a dia:',
            'SE estiver a chover:',
            '  → Levar guarda-chuva.',
            'SENÃO:',
            '  → Não levar guarda-chuva.'
          ]
        },
        {
          title: '7.5 Ciclos (Repetições)',
          content: [
            'Um ciclo permite repetir uma ação várias vezes sem termos de escrever tudo de novo.',
            'Em vez de escrever repetidamente:',
            'AVANÇAR',
            'AVANÇAR',
            'AVANÇAR',
            'AVANÇAR',
            'Podemos simplesmente utilizar um ciclo:',
            'REPETIR 4 VEZES:',
            '  → AVANÇAR'
          ]
        },
        {
          title: '7.7 Debugging (Depuração)',
          content: [
            'Debugging significa procurar, identificar e corrigir erros num programa.',
            'Um programa pode estar quase todo correto e mesmo assim não produzir o resultado esperado por causa de um pequeno passo trocado.'
          ]
        },
        {
          title: '7.9 Dados',
          content: [
            'Dados são informações que podem ser recolhidas, organizadas, filtradas e analisadas.',
            'Exemplos de dados:',
            '• Idades dos alunos;',
            '• Temperaturas registadas ao longo da semana;',
            '• Datas de aniversário;',
            '• Resultados de testes;',
            '• Nomes e turmas.'
          ]
        }
      ],
      experimenta: [
        {
          id: 'sim-steps',
          title: '🧩 Ordena os Passos',
          type: 'simulator',
          description: 'Ordena os 5 passos para preparar a mochila escolar na sequência lógica correta.',
          xpReward: 30
        },
        {
          id: 'sim-block-coding',
          title: '🧩 Programa e Experimenta',
          type: 'simulator',
          description: 'Ambiente de blocos visuais (Avançar, Virar, Repetir, Se) para conduzir o robô até à meta em 5 níveis progressivos.',
          xpReward: 40
        },
        {
          id: 'sim-debugging',
          title: '🐞 Encontra o Erro!',
          type: 'simulator',
          description: 'Analisa 5 algoritmos com erros ocultos, descobre o passo incorreto e corrige o programa.',
          xpReward: 30
        },
        {
          id: 'sim-data',
          title: '🗂️ Organiza os Dados',
          type: 'simulator',
          description: 'Interage com uma tabela de idades dos alunos (Ana, Rui, João, Marta), ordena, filtra e responde a questões analíticas.',
          xpReward: 30
        }
      ],
      desafio: {
        id: 'desafio-programador-dia',
        title: 'Programador por um Dia',
        description: 'Cria a sequência algorítmica para arrumar a secretária e organizar o material de estudo antes de uma aula online.',
        instructions: 'Seleciona os blocos na ordem exata e aplica uma condição para guardar os cadernos.',
        xpReward: 40
      },
      missaoReal: {
        id: 'missao-cria-algoritmo',
        title: 'Cria um Algoritmo',
        subtitle: 'Sequência de Resolução de Problemas',
        description: 'Escolhe uma tarefa do teu dia a dia (ex: fazer a cama, escovar os dentes, preparar um lanche) e decompõe-a em 6 passos claros e precisos.',
        defaultRulesCount: 6,
        placeholderExamples: [
          'Passo 1: Reunir todos os materiais necessários antes de começar.',
          'Passo 2: Iniciar a preparação pela primeira camada ou elemento base.',
          'Passo 3: Se houver sujidade ou resíduos, limpar de imediato antes de prosseguir.',
          'Passo 4: Repetir a colocação do material até atingir a quantidade pretendida.',
          'Passo 5: Fazer a verificação final para assegurar que não ficou nada esquecido.',
          'Passo 6: Guardar os utensílios e deixar o espaço limpo e arrumado.'
        ],
        xpReward: 50
      },
      avaliacao: {
        id: 'aval-mundo-4',
        title: 'Avaliação Final — Engenheiro Digital',
        description: '8 perguntas sobre pensamento computacional, algoritmos e dados.',
        passingScore: 75,
        xpReward: 60,
        questions: [
          {
            id: 1,
            question: 'O que é um algoritmo?',
            options: [
              { label: 'A', text: 'Um tipo de ecrã tátil' },
              { label: 'B', text: 'Uma sequência organizada de passos para resolver um problema' },
              { label: 'C', text: 'Um comando de voz' },
              { label: 'D', text: 'Um ficheiro de música' }
            ],
            correctAnswer: 'B',
            explanation: 'Um algoritmo define com precisão e ordem os passos necessários para executar uma tarefa.'
          },
          {
            id: 2,
            question: 'O que significa debugging?',
            options: [
              { label: 'A', text: 'Ligar o carregador' },
              { label: 'B', text: 'Procurar e corrigir erros num programa' },
              { label: 'C', text: 'Aumentar o volume do som' },
              { label: 'D', text: 'Comprar um robô novo' }
            ],
            correctAnswer: 'B',
            explanation: 'Debugging é o processo de encontrar falhas de lógica ou sintaxe num código e corrigi-las.'
          },
          {
            id: 3,
            question: 'Para que serve um ciclo na programação?',
            options: [
              { label: 'A', text: 'Para repetir ações de forma eficiente' },
              { label: 'B', text: 'Para desligar o computador' },
              { label: 'C', text: 'Para apagar os dados do utilizador' },
              { label: 'D', text: 'Para desenhar um círculo no ecrã' }
            ],
            correctAnswer: 'A',
            explanation: 'Ciclos evitam a repetição manual de código idêntico, poupando esforço e reduzindo potenciais erros.'
          },
          {
            id: 4,
            question: 'O que é uma condição?',
            options: [
              { label: 'A', text: 'Uma decisão baseada numa situação lógica (SE / SENÃO)' },
              { label: 'B', text: 'Um tipo de teclado com fios' },
              { label: 'C', text: 'O cabo que liga à eletricidade' },
              { label: 'D', text: 'Uma imagem estática' }
            ],
            correctAnswer: 'A',
            explanation: 'As condições direcionam o fluxo do programa consoante uma afirmação seja verdadeira ou falsa.'
          },
          {
            id: 5,
            question: 'Como podemos resolver um problema computacional complexo?',
            options: [
              { label: 'A', text: 'Dividi-lo em partes mais pequenas e simples (decomposição)' },
              { label: 'B', text: 'Desistir e fechar a tampa do computador' },
              { label: 'C', text: 'Tentar resolver tudo ao mesmo tempo ao calhas' },
              { label: 'D', text: 'Copiar sem tentar compreender' }
            ],
            correctAnswer: 'A',
            explanation: 'A decomposição é um pilar do pensamento computacional: dividir problemas em subproblemas mais fáceis.'
          },
          {
            id: 6,
            question: 'Qual é um exemplo de dado?',
            options: [
              { label: 'A', text: 'A temperatura de 22ºC registada na sala de aula' },
              { label: 'B', text: 'O plástico do rato' },
              { label: 'C', text: 'A eletricidade da tomada' },
              { label: 'D', text: 'A mesa de madeira' }
            ],
            correctAnswer: 'A',
            explanation: 'Valores, medidas, datas e medições registadas são exemplos diretos de dados digitais.'
          },
          {
            id: 7,
            question: 'Um programa pode ter erros mesmo que comece a correr?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'A',
            explanation: 'Sim, o programa pode executar sem falhar o sistema mas produzir um resultado errado devido a um erro de lógica.'
          },
          {
            id: 8,
            question: 'O que fazemos quando encontramos um erro no nosso programa?',
            options: [
              { label: 'A', text: 'Investigamos o passo a passo com calma e corrigimos' },
              { label: 'B', text: 'Ficamos zangados e partimos o teclado' },
              { label: 'C', text: 'Dizemos que a culpa é sempre do computador' },
              { label: 'D', text: 'Apagamos tudo sem ver o que estava errado' }
            ],
            correctAnswer: 'A',
            explanation: 'Errar faz parte natural do desenvolvimento; analisar com paciência é a melhor atitude de um engenheiro.'
          }
        ]
      }
    }
  },

  // ==========================================
  // MUNDO 5 — EXPLORADOR DA IA
  // ==========================================
  {
    id: 'mundo-5',
    number: 5,
    title: 'Explorador da IA',
    theme: 'Inteligência Artificial, Prompts e Responsabilidade',
    icon: 'BrainCircuit',
    color: 'purple',
    bgGradient: 'from-purple-600 to-pink-600',
    description: `A Inteligência Artificial já faz parte de muitas ferramentas que utilizamos no dia a dia.

Pode ajudar-nos a aprender, pesquisar, criar, programar e resolver problemas.
Mas uma IA também pode errar e inventar respostas falsas.

Neste Mundo vais aprender a utilizá-la com espírito crítico e cabeça!`,
    summary: 'Compreende a IA generativa, domina a arte dos prompts, identifica alucinações e enviesamentos, e protege a tua privacidade.',
    requiredWorldId: 'mundo-4',
    activitiesCount: 6,
    badgeId: 'badge-ia',
    badgeName: 'Explorador da IA',
    badgeIcon: 'Sparkles',
    sections: {
      descobre: [
        {
          title: '8.1 O Que é Inteligência Artificial?',
          content: [
            'Inteligência Artificial (IA) é um conjunto amplo de tecnologias que permite aos computadores realizar determinadas tarefas que tradicionalmente associamos à inteligência humana.',
            'Pode envolver reconhecimento de padrões, visão computacional, previsão, classificação, compreensão de linguagem e criação de novos conteúdos.'
          ],
          importantNote: 'Não definimos a IA apenas como "prever a próxima palavra". Modelos de linguagem generativos preveem tokens na geração de texto, mas a Inteligência Artificial engloba um campo científico muito mais vasto.'
        },
        {
          title: '8.2 IA Generativa',
          content: [
            'IA generativa é uma tecnologia capaz de produzir novos conteúdos originais, como texto, imagens, áudio ou código de programação, a partir de instruções (prompts) fornecidas pelo utilizador.'
          ],
          quickQuiz: [
            {
              question: 'O que é IA generativa?',
              options: [
                { label: 'A', text: 'Uma impressora a jato de tinta' },
                { label: 'B', text: 'Uma tecnologia que pode gerar novos conteúdos (texto, imagens, som)' },
                { label: 'C', text: 'Um teclado retroiluminado' },
                { label: 'D', text: 'Um programa antivírus' }
              ],
              correctAnswer: 'B',
              feedback: 'Correto! Modelos generativos criam respostas e composições inéditas a partir de descrições humanas.'
            }
          ]
        },
        {
          title: '8.5 Prompts — Como Comunicar com a IA',
          content: [
            'Um prompt é a instrução ou pedido que damos a uma ferramenta de IA.',
            'Um bom prompt é muito mais útil e assertivo quando especifica:',
            '1. O que queremos (a tarefa concreta);',
            '2. Para quem é (o público-alvo, ex: um aluno de 11 anos);',
            '3. Que formato queremos (uma lista, uma tabela, uma história curta);',
            '4. Que limitações ou regras existem (tamanho máximo, tom simples, etc.).'
          ],
          quickQuiz: [
            {
              question: 'Qual destes prompts é mais específico e produtivo?',
              options: [
                { label: 'A', text: '"Planetas"' },
                { label: 'B', text: '"Fala sobre planetas."' },
                { label: 'C', text: '"Explica os planetas do Sistema Solar para um aluno de 11 anos, usando linguagem simples e uma tabela."' },
                { label: 'D', text: '"Planetas agora."' }
              ],
              correctAnswer: 'C',
              feedback: 'Excelente! Indica o tema, o público-alvo (11 anos), a linguagem e o formato pretendido (tabela).'
            }
          ]
        },
        {
          title: '8.7 Alucinações da IA',
          content: [
            'Uma "alucinação" acontece quando uma IA produz uma resposta com tom de certeza absoluta, mas que contém factos errados ou completamente inventados.',
            'Exemplo real:',
            'IA: "O rio Tejo nasce no Porto e desagua em Madrid."',
            'Devemos aceitar a resposta? NÃO! Uma resposta convincente e bem escrita não é automaticamente verdadeira.',
            'É indispensável verificar informações críticas em fontes independentes.'
          ]
        },
        {
          title: '8.9 Enviesamento (Bias)',
          content: [
            'Os sistemas de IA aprendem padrões a partir de dados históricos criados por seres humanos.',
            'Esses dados podem conter preconceitos e enviesamentos culturais.',
            'Por isso, uma IA pode produzir respostas que fazem generalizações injustificadas ou que representam certos grupos de forma injusta.'
          ]
        },
        {
          title: '8.11 Sistemas de Recomendação',
          content: [
            'Muitas plataformas (vídeos, redes, música) utilizam algoritmos de recomendação baseados em IA.',
            'Podem analisar:',
            '• Histórico de vídeos vistos;',
            '• Pesquisas anteriores;',
            '• Gostos e comentários;',
            '• Tempo passado a olhar para certos tópicos.'
          ],
          importantNote: 'Os objetivos dos sistemas podem variar (mostrar novidades, manter interesse, sugerir aprendizagem), e compreender como funcionam ajuda-nos a não ficar presos numa "bolha de conteúdo".'
        },
        {
          title: '8.13 Privacidade e IA',
          content: [
            'Nunca deves introduzir informações pessoais ou confidenciais numa ferramenta pública de IA.',
            'Evita absolutamente colocar:',
            '• As tuas palavras-passe;',
            '• A tua morada ou escola;',
            '• Dados de saúde privados;',
            '• Informações ou fotografias de outras pessoas sem autorização.'
          ]
        }
      ],
      experimenta: [
        {
          id: 'sim-prompt-lab',
          title: '🤖 Fala com a IA — Laboratório de Prompts',
          type: 'simulator',
          description: 'Compara na prática o resultado de um prompt fraco ("Vulcões") com um prompt estruturado ("Explica para 11 anos...").',
          xpReward: 30
        },
        {
          id: 'sim-hallucinations',
          title: '🧠 A IA Pode Enganar-se?',
          type: 'simulator',
          description: 'Avalia 8 afirmações feitas por uma IA e classifica em: Correto, Errado (Alucinação) ou Precisa de Análise.',
          xpReward: 30
        },
        {
          id: 'sim-bias',
          title: '🧠 Deteta o Enviesamento',
          type: 'simulator',
          description: 'Identifica generalizações injustificadas em 6 respostas automáticas da IA.',
          xpReward: 30
        },
        {
          id: 'sim-recommendations',
          title: '📱 Porque é que Isto me Aparece?',
          type: 'simulator',
          description: 'Analisa o perfil do Rui (pesquisou chuteiras e viu futebol) e descobre como os sinais orientam o feed de recomendações.',
          xpReward: 30
        }
      ],
      desafio: {
        id: 'desafio-detetive-ia',
        title: 'Detetive da IA',
        description: 'Uma IA gerou um resumo sobre a história dos computadores com uma alucinação histórica no meio. Localiza a afirmação falsa e propõe a correção.',
        instructions: 'Lê o texto, seleciona o parágrafo com erro histórico e escreve a versão fidedigna com base em factos reais.',
        xpReward: 40
      },
      missaoReal: {
        id: 'missao-guia-ia-cabeca',
        title: 'Guia para Usar IA com Cabeça',
        subtitle: 'Manual de Boas Práticas Digitais',
        description: 'Cria as 7 regras de ouro para utilizares a Inteligência Artificial nos teus estudos sem perderes o espírito crítico.',
        defaultRulesCount: 7,
        placeholderExamples: [
          'Nunca confiar cegamente numa resposta só porque está bem escrita.',
          'Verificar sempre factos, datas e cálculos em fontes independentes.',
          'Nunca introduzir palavras-passe nem dados pessoais privados na IA.',
          'Não copiar respostas para trabalhos sem as ler, compreender e aprender.',
          'Indicar de forma honesta quando e como a IA foi utilizada no trabalho.',
          'Rever, editar e melhorar ativamente os rascunhos sugeridos pela IA.',
          'Pensar sempre pela própria cabeça: a IA é um assistente, não substitui o teu cérebro!'
        ],
        xpReward: 50
      },
      avaliacao: {
        id: 'aval-mundo-5',
        title: 'Avaliação Final — Explorador da IA',
        description: '8 perguntas para comprovar os teus conhecimentos em Inteligência Artificial responsável.',
        passingScore: 75,
        xpReward: 60,
        questions: [
          {
            id: 1,
            question: 'O que é Inteligência Artificial (IA)?',
            options: [
              { label: 'A', text: 'Um robô de metal com rodas' },
              { label: 'B', text: 'Um conjunto de tecnologias que permite aos computadores realizar tarefas associadas à inteligência' },
              { label: 'C', text: 'Apenas uma máquina de calcular grande' },
              { label: 'D', text: 'Um tipo de ecrã tátil' }
            ],
            correctAnswer: 'B',
            explanation: 'A IA engloba algoritmos e sistemas desenhados para interpretar dados, aprender e tomar decisões.'
          },
          {
            id: 2,
            question: 'O que é IA generativa?',
            options: [
              { label: 'A', text: 'Tecnologia que pode gerar novos conteúdos (texto, imagem, áudio, código)' },
              { label: 'B', text: 'Um disco rígido externo' },
              { label: 'C', text: 'A velocidade de download da escola' },
              { label: 'D', text: 'Um tipo de pilha recarregável' }
            ],
            correctAnswer: 'A',
            explanation: 'Modelos generativos produzem materiais originais com base nos dados em que foram treinados.'
          },
          {
            id: 3,
            question: 'A Inteligência Artificial pode cometer erros e inventar respostas falsas?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não, ela acerta sempre a 100%' }
            ],
            correctAnswer: 'A',
            explanation: 'Sim, ocorrem alucinações e erros factuais com frequência; a verificação é indispensável.'
          },
          {
            id: 4,
            question: 'O que devemos fazer perante uma informação importante produzida por IA?',
            options: [
              { label: 'A', text: 'Aceitar cegamente sem questionar' },
              { label: 'B', text: 'Verificar em fontes seguras e credíveis' },
              { label: 'C', text: 'Apagar o computador' },
              { label: 'D', text: 'Mudar a cor do texto' }
            ],
            correctAnswer: 'B',
            explanation: 'A confirmação com manuais escolares, enciclopédias e artigos científicos garante a veracidade do teu trabalho.'
          },
          {
            id: 5,
            question: 'O que é um prompt?',
            options: [
              { label: 'A', text: 'Uma instrução dada a uma ferramenta de IA' },
              { label: 'B', text: 'Um botão do teclado quebrado' },
              { label: 'C', text: 'Uma bateria de portátil' },
              { label: 'D', text: 'O som que o computador faz ao ligar' }
            ],
            correctAnswer: 'A',
            explanation: 'O prompt é a mensagem com as instruções enviada pelo utilizador para orientar a resposta da IA.'
          },
          {
            id: 6,
            question: 'Devemos colocar as nossas palavras-passe ou morada numa ferramenta pública de IA?',
            options: [
              { label: 'A', text: 'Sim, para ela nos conhecer melhor' },
              { label: 'B', text: 'Não, nunca devemos fornecer dados privados' }
            ],
            correctAnswer: 'B',
            explanation: 'Manter dados confidenciais e passwords longe das ferramentas de IA protege a tua segurança digital.'
          },
          {
            id: 7,
            question: 'Os sistemas de recomendação podem utilizar informação sobre o nosso comportamento anterior?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'A',
            explanation: 'Históricos de visualizações, pesquisas e gostos são usados para prever que conteúdos te podem interessar.'
          },
          {
            id: 8,
            question: 'Uma resposta convincente e bem escrita pela IA é necessariamente verdadeira?',
            options: [
              { label: 'A', text: 'Sim' },
              { label: 'B', text: 'Não' }
            ],
            correctAnswer: 'B',
            explanation: 'A fluência verbal de um modelo linguístico não é garantia de rigor factual; o espírito crítico é a chave.'
          }
        ]
      }
    }
  }
];
