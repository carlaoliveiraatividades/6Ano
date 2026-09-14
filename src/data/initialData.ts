import { User, Badge, ClassRoom, StudentProgressSummary } from '../types';

export interface LevelThreshold {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: LevelThreshold[] = [
  { level: 1, title: 'Novato Digital', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Explorador Digital', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Guardião Digital', minXp: 250, maxXp: 500 },
  { level: 4, title: 'Detetive Digital', minXp: 500, maxXp: 800 },
  { level: 5, title: 'Criador Digital', minXp: 800, maxXp: 1200 },
  { level: 6, title: 'Engenheiro Digital', minXp: 1200, maxXp: 1700 },
  { level: 7, title: 'Explorador da IA', minXp: 1700, maxXp: 2300 },
  { level: 8, title: 'Mestre da Missão TIC', minXp: 2300, maxXp: 99999 }
];

export function getLevelForXp(xp: number): { level: number; title: string; currentLevelMin: number; nextLevelXp: number; progressPercent: number } {
  let current = LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp && xp < LEVELS[i].maxXp) {
      current = LEVELS[i];
      break;
    }
  }
  if (xp >= LEVELS[LEVELS.length - 1].minXp) {
    current = LEVELS[LEVELS.length - 1];
    return {
      level: current.level,
      title: current.title,
      currentLevelMin: current.minXp,
      nextLevelXp: current.minXp,
      progressPercent: 100
    };
  }

  const range = current.maxXp - current.minXp;
  const inLevel = xp - current.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((inLevel / range) * 100)));

  return {
    level: current.level,
    title: current.title,
    currentLevelMin: current.minXp,
    nextLevelXp: current.maxXp,
    progressPercent
  };
}

export const BADGES: Badge[] = [
  {
    id: 'badge-guardiao',
    name: 'Guardião Digital',
    icon: 'Shield',
    description: 'Completaste com sucesso a proteção de passwords, privacidade e defesa contra phishing no Mundo 1.',
    worldId: 'mundo-1',
    rarity: 'Comum'
  },
  {
    id: 'badge-detetive',
    name: 'Detetive Digital',
    icon: 'Search',
    description: 'Dominaste a seleção de fontes confiáveis, verificação de notícias e pensamento crítico no Mundo 2.',
    worldId: 'mundo-2',
    rarity: 'Raro'
  },
  {
    id: 'badge-criador',
    name: 'Criador Digital',
    icon: 'PenTool',
    description: 'Excelente netiqueta, redação de emails com BCC e respeito por direitos de autor e licenças no Mundo 3.',
    worldId: 'mundo-3',
    rarity: 'Raro'
  },
  {
    id: 'badge-engenheiro',
    name: 'Engenheiro Digital',
    icon: 'Cpu',
    description: 'Pensamento computacional de topo: algoritmos, condições, ciclos e debugging no Mundo 4.',
    worldId: 'mundo-4',
    rarity: 'Épico'
  },
  {
    id: 'badge-ia',
    name: 'Explorador da IA',
    icon: 'Sparkles',
    description: 'Domínio ético de IA generativa, prompts de qualidade e deteção de alucinações no Mundo 5.',
    worldId: 'mundo-5',
    rarity: 'Épico'
  },
  {
    id: 'badge-mestre',
    name: 'Mestre da Missão TIC',
    icon: 'Trophy',
    description: 'Completaste os 5 Mundos e solucionaste com distinção o grande desafio da Escola do Futuro!',
    rarity: 'Lendário'
  }
];

export const DEMO_CLASSES: ClassRoom[] = [
  {
    id: 'turma-6a',
    name: '6.º Ano — Turma A',
    code: 'TIC-6A-2026',
    teacherId: 'prof-1',
    teacherName: 'Prof.ª Helena Santos',
    studentsCount: 8,
    rankingEnabled: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'turma-6b',
    name: '6.º Ano — Turma B',
    code: 'TIC-6B-2026',
    teacherId: 'prof-1',
    teacherName: 'Prof.ª Helena Santos',
    studentsCount: 6,
    rankingEnabled: true,
    createdAt: '2026-09-01'
  }
];

export const DEMO_STUDENT: User = {
  id: 'aluno-alex',
  username: 'alex.silva',
  name: 'Alex',
  role: 'student',
  avatar: 'alex',
  classId: 'turma-6a',
  className: '6.º Ano — Turma A',
  xp: 320,
  level: 3,
  levelTitle: 'Explorador Digital',
  completedActivities: ['desc-mundo-1-passwords', 'desc-mundo-1-phishing', 'quiz-mundo-1-passwords'],
  completedSimulators: ['sim-phishing'],
  completedMissions: [],
  completedAssessments: {},
  badges: ['badge-guardiao'],
  claimedWeeklyChallenges: [],
  createdAt: '2026-09-05'
};

export const DEMO_TEACHER: User = {
  id: 'prof-1',
  username: 'helena.santos',
  name: 'Prof.ª Helena Santos',
  role: 'teacher',
  avatar: 'teacher-helena',
  classId: 'turma-6a',
  className: '6.º Ano — Turma A',
  xp: 2500,
  level: 8,
  levelTitle: 'Mestre da Missão TIC',
  completedActivities: [],
  completedSimulators: [],
  completedMissions: [],
  completedAssessments: {},
  badges: ['badge-guardiao', 'badge-detetive', 'badge-criador', 'badge-engenheiro', 'badge-ia', 'badge-mestre'],
  claimedWeeklyChallenges: [],
  createdAt: '2026-09-01'
};

export const DEMO_ADMIN: User = {
  id: 'admin-1',
  username: 'admin.tic',
  name: 'Administrador TIC',
  role: 'admin',
  avatar: 'admin',
  xp: 5000,
  level: 8,
  levelTitle: 'Mestre da Missão TIC',
  completedActivities: [],
  completedSimulators: [],
  completedMissions: [],
  completedAssessments: {},
  badges: ['badge-guardiao', 'badge-detetive', 'badge-criador', 'badge-engenheiro', 'badge-ia', 'badge-mestre'],
  claimedWeeklyChallenges: [],
  createdAt: '2026-09-01'
};

export const DEMO_CLASS_STUDENTS: StudentProgressSummary[] = [
  {
    userId: 'aluno-leonor',
    name: 'Leonor',
    avatar: 'leonor',
    xp: 920,
    level: 5,
    levelTitle: 'Criador Digital',
    world1Progress: 100,
    world2Progress: 100,
    world3Progress: 80,
    world4Progress: 40,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Hoje às 10:15'
  },
  {
    userId: 'aluno-tiago',
    name: 'Tiago',
    avatar: 'tiago',
    xp: 850,
    level: 5,
    levelTitle: 'Criador Digital',
    world1Progress: 100,
    world2Progress: 100,
    world3Progress: 70,
    world4Progress: 30,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Hoje às 09:40'
  },
  {
    userId: 'aluno-alex',
    name: 'Alex (Tu)',
    avatar: 'alex',
    xp: 320,
    level: 3,
    levelTitle: 'Explorador Digital',
    world1Progress: 60,
    world2Progress: 20,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Agora'
  },
  {
    userId: 'aluno-beatriz',
    name: 'Beatriz',
    avatar: 'beatriz',
    xp: 290,
    level: 3,
    levelTitle: 'Guardião Digital',
    world1Progress: 55,
    world2Progress: 10,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Ontem às 16:20'
  },
  {
    userId: 'aluno-duarte',
    name: 'Duarte',
    avatar: 'duarte',
    xp: 210,
    level: 2,
    levelTitle: 'Explorador Digital',
    world1Progress: 40,
    world2Progress: 0,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: true,
    helpReason: 'Dificuldade na identificação de links de phishing no Mundo 1.',
    lastActive: 'Ontem às 15:10'
  },
  {
    userId: 'aluno-ines',
    name: 'Inês',
    avatar: 'ines',
    xp: 180,
    level: 2,
    levelTitle: 'Explorador Digital',
    world1Progress: 35,
    world2Progress: 0,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Há 2 dias'
  },
  {
    userId: 'aluno-miguel',
    name: 'Miguel',
    avatar: 'miguel',
    xp: 120,
    level: 2,
    levelTitle: 'Explorador Digital',
    world1Progress: 25,
    world2Progress: 0,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: true,
    helpReason: 'Avaliação do Mundo 1 incompleta após 2 tentativas.',
    lastActive: 'Há 3 dias'
  },
  {
    userId: 'aluno-sofia',
    name: 'Sofia',
    avatar: 'sofia',
    xp: 90,
    level: 1,
    levelTitle: 'Novato Digital',
    world1Progress: 15,
    world2Progress: 0,
    world3Progress: 0,
    world4Progress: 0,
    world5Progress: 0,
    grandMissionCompleted: false,
    needsHelp: false,
    lastActive: 'Há 4 dias'
  }
];
