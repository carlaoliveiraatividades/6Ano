import { AvatarConfig } from '../types';

// Lists for unique, friendly nicknames
export const NICKNAME_NOUNS = [
  'Panda', 'Gamer', 'Falcão', 'Lince', 'Ninja', 'Robot', 'Raposa', 'Coruja',
  'Leão', 'Tigre', 'Águia', 'Lobo', 'Astronauta', 'Mago', 'Explorador',
  'Cibernauta', 'Guardião', 'Detetive', 'Inventor', 'Cometa', 'Dragão',
  'Golfinho', 'Urso', 'Gavião', 'Titã', 'Hacker', 'Mestre', 'Fénix'
];

export const NICKNAME_ADJECTIVES = [
  'Feliz', 'Azul', 'Cyber', 'Cosmico', 'Estelar', 'Veloz', 'Sabio',
  'Valente', 'Curioso', 'Brilhante', 'Dourado', 'Solar', 'Lunar', 'Digital',
  'Criativo', 'Incrivel', 'Focado', 'Super', 'Heroico', 'Genial', 'Astuto',
  'Fantastico', 'Lendario', 'Pixel', 'Quantum', 'Eletrico', 'Silencioso'
];

/**
 * Generate a playful, unique student nickname
 * e.g., Panda_Feliz_701, Gamer_Azul_452
 */
export function generateRandomNickname(): string {
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const num = Math.floor(100 + Math.random() * 900); // 100 to 999
  return `${noun}_${adj}_${num}`;
}

// Option definitions for avatar creator
export const SKIN_OPTIONS: { id: AvatarConfig['skin']; label: string; color: string }[] = [
  { id: 'light', label: 'Clara', color: '#FDDFD0' },
  { id: 'medium', label: 'Média', color: '#F3B59B' },
  { id: 'tan', label: 'Morena', color: '#D68858' },
  { id: 'dark', label: 'Escura', color: '#774125' },
  { id: 'cyber', label: 'Cyber / Robô', color: '#7EE7FC' }
];

export const HAIR_OPTIONS: { id: AvatarConfig['hair']; label: string }[] = [
  { id: 'short', label: 'Curto' },
  { id: 'spiky', label: 'Espetado / Gamer' },
  { id: 'curly', label: 'Caracóis' },
  { id: 'long', label: 'Comprido' },
  { id: 'ponytail', label: 'Rabo de Cavalo' },
  { id: 'afro', label: 'Afro' },
  { id: 'braids', label: 'Tranças' },
  { id: 'shaved', label: 'Rapado' }
];

export const HAIR_COLOR_OPTIONS: { id: AvatarConfig['hairColor']; label: string; color: string }[] = [
  { id: 'black', label: 'Preto', color: '#1E293B' },
  { id: 'brown', label: 'Castanho', color: '#663D14' },
  { id: 'blonde', label: 'Louro', color: '#EAB308' },
  { id: 'red', label: 'Ruivo', color: '#DC2626' },
  { id: 'cyan', label: 'Ciano', color: '#06B6D4' },
  { id: 'purple', label: 'Roxo', color: '#9333EA' },
  { id: 'green', label: 'Verde', color: '#16A34A' },
  { id: 'white', label: 'Branco / Platinado', color: '#E2E8F0' }
];

export const EXPRESSION_OPTIONS: { id: AvatarConfig['expression']; label: string; emoji: string }[] = [
  { id: 'smile', label: 'Sorriso', emoji: '😊' },
  { id: 'laugh', label: 'Riso', emoji: '😄' },
  { id: 'cool', label: 'Cool / Confiante', emoji: '😎' },
  { id: 'wink', label: 'Piscar o Olho', emoji: '😉' },
  { id: 'stars', label: 'Olhos de Estrela', emoji: '🤩' },
  { id: 'focused', label: 'Focado / Gamer', emoji: '🎯' }
];

export const GLASSES_OPTIONS: { id: AvatarConfig['glasses']; label: string }[] = [
  { id: 'none', label: 'Nenhum' },
  { id: 'round', label: 'Redondos' },
  { id: 'modern', label: 'Modernos' },
  { id: 'sunglasses', label: 'Óculos de Sol' },
  { id: 'vr', label: 'Headset / Óculos VR' }
];

export const HEADWEAR_OPTIONS: { id: AvatarConfig['headwear']; label: string }[] = [
  { id: 'none', label: 'Nenhum' },
  { id: 'cap', label: 'Boné' },
  { id: 'beanie', label: 'Gorro' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'crown', label: 'Coroa' },
  { id: 'wizard', label: 'Chapéu de Feiticeiro' }
];

export const OUTFIT_OPTIONS: { id: AvatarConfig['outfit']; label: string }[] = [
  { id: 'tshirt', label: 'T-Shirt' },
  { id: 'hoodie', label: 'Hoodie Gamer' },
  { id: 'polo', label: 'Camisola / Polo' },
  { id: 'hero', label: 'Fato Super-Herói' }
];

export const OUTFIT_COLOR_OPTIONS: { id: AvatarConfig['outfitColor']; label: string; color: string }[] = [
  { id: 'blue', label: 'Azul', color: '#2563EB' },
  { id: 'purple', label: 'Roxo', color: '#7C3AED' },
  { id: 'emerald', label: 'Verde Esmeralda', color: '#059669' },
  { id: 'rose', label: 'Rosa / Vermelho', color: '#E11D48' },
  { id: 'amber', label: 'Laranja / Âmbar', color: '#D97706' },
  { id: 'dark', label: 'Preto / Cinzento', color: '#334155' }
];

export const BG_COLOR_OPTIONS: { id: AvatarConfig['bgColor']; label: string; gradient: string }[] = [
  { id: 'indigo', label: 'Índigo', gradient: 'from-indigo-500 to-blue-700' },
  { id: 'emerald', label: 'Esmeralda', gradient: 'from-emerald-400 to-teal-700' },
  { id: 'amber', label: 'Âmbar', gradient: 'from-amber-400 to-orange-600' },
  { id: 'rose', label: 'Rosa', gradient: 'from-pink-400 to-rose-600' },
  { id: 'sky', label: 'Céu', gradient: 'from-cyan-400 to-blue-600' },
  { id: 'violet', label: 'Violeta', gradient: 'from-purple-500 to-fuchsia-700' },
  { id: 'slate', label: 'Escuro Cyber', gradient: 'from-slate-700 to-slate-900' }
];

// Helper to hash a string to integer
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministically generates an AvatarConfig from a nickname string
 */
export function generateDeterministicAvatar(seed: string): AvatarConfig {
  const hash = simpleHash(seed || 'Gamer_100');

  const skins: AvatarConfig['skin'][] = ['light', 'medium', 'tan', 'dark', 'cyber'];
  const hairs: AvatarConfig['hair'][] = ['short', 'spiky', 'curly', 'long', 'ponytail', 'afro', 'braids', 'shaved'];
  const hairColors: AvatarConfig['hairColor'][] = ['black', 'brown', 'blonde', 'red', 'cyan', 'purple', 'green', 'white'];
  const expressions: AvatarConfig['expression'][] = ['smile', 'laugh', 'cool', 'wink', 'stars', 'focused'];
  const glassesList: AvatarConfig['glasses'][] = ['none', 'none', 'round', 'modern', 'sunglasses', 'vr'];
  const headwears: AvatarConfig['headwear'][] = ['none', 'none', 'cap', 'beanie', 'headphones', 'crown', 'wizard'];
  const outfits: AvatarConfig['outfit'][] = ['tshirt', 'hoodie', 'polo', 'hero'];
  const outfitColors: AvatarConfig['outfitColor'][] = ['blue', 'purple', 'emerald', 'rose', 'amber', 'dark'];
  const bgColors: AvatarConfig['bgColor'][] = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet', 'slate'];

  return {
    skin: skins[hash % skins.length],
    hair: hairs[(hash >> 2) % hairs.length],
    hairColor: hairColors[(hash >> 4) % hairColors.length],
    expression: expressions[(hash >> 6) % expressions.length],
    glasses: glassesList[(hash >> 8) % glassesList.length],
    headwear: headwears[(hash >> 10) % headwears.length],
    outfit: outfits[(hash >> 12) % outfits.length],
    outfitColor: outfitColors[(hash >> 14) % outfitColors.length],
    bgColor: bgColors[(hash >> 16) % bgColors.length]
  };
}

/**
 * Generates a completely random AvatarConfig
 */
export function generateRandomAvatar(): AvatarConfig {
  const skins: AvatarConfig['skin'][] = ['light', 'medium', 'tan', 'dark', 'cyber'];
  const hairs: AvatarConfig['hair'][] = ['short', 'spiky', 'curly', 'long', 'ponytail', 'afro', 'braids', 'shaved'];
  const hairColors: AvatarConfig['hairColor'][] = ['black', 'brown', 'blonde', 'red', 'cyan', 'purple', 'green', 'white'];
  const expressions: AvatarConfig['expression'][] = ['smile', 'laugh', 'cool', 'wink', 'stars', 'focused'];
  const glassesList: AvatarConfig['glasses'][] = ['none', 'none', 'round', 'modern', 'sunglasses', 'vr'];
  const headwears: AvatarConfig['headwear'][] = ['none', 'none', 'cap', 'beanie', 'headphones', 'crown', 'wizard'];
  const outfits: AvatarConfig['outfit'][] = ['tshirt', 'hoodie', 'polo', 'hero'];
  const outfitColors: AvatarConfig['outfitColor'][] = ['blue', 'purple', 'emerald', 'rose', 'amber', 'dark'];
  const bgColors: AvatarConfig['bgColor'][] = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet', 'slate'];

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    skin: pick(skins),
    hair: pick(hairs),
    hairColor: pick(hairColors),
    expression: pick(expressions),
    glasses: pick(glassesList),
    headwear: pick(headwears),
    outfit: pick(outfits),
    outfitColor: pick(outfitColors),
    bgColor: pick(bgColors)
  };
}

export const CLASS_OPTIONS = [
  { id: 'turma-6a', name: '6.º A' },
  { id: 'turma-6b', name: '6.º B' },
  { id: 'turma-6c', name: '6.º C' },
  { id: 'turma-6d', name: '6.º D' },
  { id: 'turma-6e', name: '6.º E' },
  { id: 'turma-6f', name: '6.º F' },
  { id: 'turma-5a', name: '5.º A' },
  { id: 'turma-5b', name: '5.º B' },
  { id: 'turma-5c', name: '5.º C' },
  { id: 'turma-5d', name: '5.º D' }
];
