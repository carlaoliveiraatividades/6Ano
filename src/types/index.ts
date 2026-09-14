export type UserRole = 'student' | 'teacher' | 'visitor';

export interface AvatarConfig {
  skin: 'light' | 'medium' | 'tan' | 'dark' | 'cyber';
  hair: 'short' | 'spiky' | 'curly' | 'long' | 'ponytail' | 'afro' | 'braids' | 'shaved';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'cyan' | 'purple' | 'green' | 'white';
  expression: 'smile' | 'laugh' | 'cool' | 'wink' | 'stars' | 'focused';
  glasses: 'none' | 'round' | 'modern' | 'sunglasses' | 'vr';
  headwear: 'none' | 'cap' | 'beanie' | 'headphones' | 'crown' | 'wizard';
  outfit: 'tshirt' | 'hoodie' | 'polo' | 'hero';
  outfitColor: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'dark';
  bgColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate' | 'violet';
}

export interface User {
  id: string;
  nickname?: string; // Public identifier (e.g. Panda_Feliz_701)
  username?: string;
  email?: string; // Private email
  name: string; // Real private name
  role: UserRole;
  avatar: string | AvatarConfig;
  classId?: string;
  className?: string;
  xp: number;
  level: number;
  levelTitle: string;
  completedActivities: string[];
  completedSimulators: string[];
  completedMissions: string[];
  completedAssessments: Record<string, number>; // worldId -> score percentage
  badges: string[];
  claimedWeeklyChallenges: string[];
  unlockedWorlds?: string[];
  createdAt: string;
}

export interface World {
  id: string;
  number: number;
  title: string;
  theme: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  summary: string;
  requiredWorldId?: string;
  activitiesCount: number;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  isPublished?: boolean;
  unlockedForAll?: boolean;
  teacherNotes?: string;
  featuredActivity?: string;
  sections: {
    descobre: {
      title: string;
      content: string[];
      examples?: { bad: string[]; good: string[] };
      importantNote?: string;
      quickQuiz?: {
        question: string;
        options: { label: string; text: string }[];
        correctAnswer: string;
        feedback: string;
      }[];
    }[];
    experimenta: {
      id: string;
      title: string;
      type: string;
      description: string;
      xpReward: number;
    }[];
    desafio: {
      id: string;
      title: string;
      description: string;
      instructions: string;
      xpReward: number;
    };
    missaoReal: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      defaultRulesCount: number;
      placeholderExamples: string[];
      xpReward: number;
    };
    avaliacao: {
      id: string;
      title: string;
      description: string;
      passingScore: number;
      xpReward: number;
      questions: AssessmentQuestion[];
    };
  };
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface AssessmentSubmissionResult {
  score: number; // 0-100
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  xpEarned: number;
  badgeUnlocked?: {
    id: string;
    name: string;
    icon: string;
  };
  answersFeedback: {
    questionId: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  worldId?: string;
  unlockedAt?: string;
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  xpReward: number;
  question: string;
  scenario: string;
  options: { id: string; label: string; text: string; isCorrect: boolean; feedback: string }[];
  explanation: string;
}

export interface DailyTip {
  id: string;
  title: string;
  snippet: string;
  fullText: string;
  practicalAction: string;
  category: string;
}

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  reflection: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  studentsCount: number;
  rankingEnabled: boolean;
  createdAt: string;
}

export interface StudentProgressSummary {
  userId: string;
  name: string;
  nickname?: string;
  avatar: string | AvatarConfig;
  className?: string;
  xp: number;
  level: number;
  levelTitle: string;
  world1Progress: number;
  world2Progress: number;
  world3Progress: number;
  world4Progress: number;
  world5Progress: number;
  grandMissionCompleted: boolean;
  needsHelp: boolean;
  helpReason?: string;
  lastActive: string;
}
