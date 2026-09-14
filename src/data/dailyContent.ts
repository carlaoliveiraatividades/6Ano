import { DailyTip, DailyQuote } from '../types';

export const DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-1',
    title: 'Verifica para onde vai o link',
    snippet: 'Antes de clicares num link recebido por mensagem, verifica para onde te leva.',
    fullText: 'Quando recebes uma mensagem ou email com um link, pousa o cursor por cima (ou mantém premido no telemóvel) para ver o endereço URL completo. Se o nome do domínio for estranho, tiver traços a mais ou erros de escrita (como "gooogle.xyz"), não cliques!',
    practicalAction: 'Olha sempre para a barra de endereço do navegador antes de colocares qualquer dado pessoal.',
    category: 'Segurança'
  },
  {
    id: 'tip-2',
    title: 'Frases-passe em vez de palavras simples',
    snippet: 'Não uses a mesma password em todas as contas.',
    fullText: 'Se utilizares a mesma palavra-passe no teu jogo preferido e no teu correio eletrónico escolar, caso uma das empresas sofra uma fuga de dados, todas as tuas outras contas ficam vulneráveis.',
    practicalAction: 'Cria senhas diferentes utilizando frases longas que só tu consigas imaginar.',
    category: 'Privacidade'
  },
  {
    id: 'tip-3',
    title: 'Nem tudo o que brilha na web é verdade',
    snippet: 'Nem tudo o que aparece online é verdade. Investiga antes de partilhar.',
    fullText: 'Imagens geradas por computador, vídeos manipulados e manchetes sensacionalistas espalham-se a grande velocidade. Sempre que vires uma notícia surpreendente, procura saber quem a publicou e se jornais credíveis confirmam a história.',
    practicalAction: 'Faz uma pesquisa rápida com as palavras-chave da notícia e o termo "fact check".',
    category: 'Pesquisa'
  },
  {
    id: 'tip-4',
    title: 'Pergunta antes de publicar fotos de amigos',
    snippet: 'Antes de publicares uma fotografia de outra pessoa, pergunta primeiro.',
    fullText: 'O direito à própria imagem é um direito fundamental de todas as pessoas. O que para ti pode parecer uma foto divertida pode fazer um colega sentir-se desconfortável ou exposto.',
    practicalAction: 'Pede sempre autorização prévia aos teus colegas antes de carregar imagens nas redes ou trabalhos.',
    category: 'Netiqueta'
  },
  {
    id: 'tip-5',
    title: 'A IA é um assistente, não um oráculo infalível',
    snippet: 'Quando usares IA, verifica sempre as informações importantes em fontes oficiais.',
    fullText: 'Os modelos de IA geram texto prevendo sequências lógicas de palavras, mas não compreendem o mundo como os seres humanos. Por isso, podem cometer erros factuais graves com enorme confiança.',
    practicalAction: 'Usa a IA para estruturar ideias ou tirar dúvidas, mas valida sempre as datas e factos.',
    category: 'Inteligência Artificial'
  }
];

export const DAILY_QUOTES: DailyQuote[] = [
  {
    id: 'quote-1',
    quote: 'A tecnologia é uma ferramenta. Tu decides como a usar.',
    author: 'Missão TIC',
    reflection: 'Os computadores, telemóveis e redes não são bons nem maus por si mesmos. O impacto depende do respeito, do sentido de responsabilidade e da criatividade de quem os utiliza.'
  },
  {
    id: 'quote-2',
    quote: 'Nem tudo o que aparece online é verdade.',
    author: 'Princípio do Detetive Digital',
    reflection: 'Ter espírito crítico é o superpoder mais valioso da era da informação. Questionar com inteligência protege-te a ti e à sociedade da desinformação.'
  },
  {
    id: 'quote-3',
    quote: 'Antes de partilhar, pensa.',
    author: 'Regra de Ouro do Guardião',
    reflection: 'Um clique demora meio segundo, mas uma publicação na internet pode durar anos. Pensa nas consequências e nos sentimentos dos outros antes de carregar em "Publicar".'
  },
  {
    id: 'quote-4',
    quote: 'Uma boa pergunta pode ser o início de uma grande descoberta.',
    author: 'Pensamento Científico',
    reflection: 'Não tenhas receio de perguntar "Porquê?" ou "Como funciona?". Foi assim que surgiram os maiores algoritmos e avanços tecnológicos da humanidade.'
  },
  {
    id: 'quote-5',
    quote: 'A IA pode ajudar-te, mas também pode enganar-se.',
    author: 'Explorador da IA',
    reflection: 'A inteligência humana tem bom senso, empatia e capacidade crítica. Utiliza a IA como parceiro de estudo, nunca como substituto do teu próprio raciocínio.'
  },
  {
    id: 'quote-6',
    quote: 'Criar também é saber respeitar o trabalho dos outros.',
    author: 'Ética Digital',
    reflection: 'Dar crédito aos criadores originais e respeitar direitos de autor é um ato de generosidade e justiça que engrandece qualquer projeto escolar.'
  }
];
