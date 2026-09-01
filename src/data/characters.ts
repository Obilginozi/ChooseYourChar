import type { Character, CharacterStats } from '../types/character'

const base = import.meta.env.BASE_URL

/** All characters use custom 256×256 pixel art sprites. */
const SPRITE = { spriteWidth: 256, spriteHeight: 256 } as const

function char(
  data: Omit<Character, 'spriteWidth' | 'spriteHeight'> & {
    stats: CharacterStats
  },
): Character {
  return { ...data, ...SPRITE }
}

export const characters: Character[] = [
  char({
    id: 'filozof',
    name: 'Filozof Ouzan',
    tagline: 'Var mıydı yok muydu? Tartışılır. Bitmez.',
    accentColor: '#C9A66B',
    spriteSrc: `${base}assets/characters/filozof.png`,
    stats: { hp: 72, atk: 45, spd: 38 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'muhendis',
    name: 'Mühendis Ouzan',
    tagline: 'Prod çalışıyor. Kimse dokunmasın.',
    accentColor: '#4A7C9B',
    spriteSrc: `${base}assets/characters/muhendis.png`,
    stats: { hp: 65, atk: 88, spd: 91 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'imam',
    name: 'İmam Ouzan',
    tagline: 'Sakin ol. Her şeyin bir vakti var.',
    accentColor: '#2D6A4F',
    spriteSrc: `${base}assets/characters/imam.png`,
    stats: { hp: 90, atk: 55, spd: 48 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'akademisyen',
    name: 'Akademisyen Ouzan',
    tagline: 'Bu rapor okunsun. Kesin çıkar.',
    accentColor: '#7B2D26',
    spriteSrc: `${base}assets/characters/akademisyen.png`,
    stats: { hp: 78, atk: 62, spd: 52 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'muzisyen',
    name: 'Müzisyen Ouzan',
    tagline: 'Ben akor bilmem. Komşu bilir.',
    accentColor: '#9B59B6',
    spriteSrc: `${base}assets/characters/muzisyen.png`,
    stats: { hp: 70, atk: 75, spd: 80 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'fenerbahceli',
    name: 'Fenerbahçeli Ouzan',
    tagline: 'O sene bu sene.',
    accentColor: '#FFED00',
    spriteSrc: `${base}assets/characters/fenerbahceli.png`,
    stats: { hp: 85, atk: 92, spd: 70 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'sporcu',
    name: 'Sporcu Ouzan',
    tagline: 'Yarın başlarım. Bugün son set.',
    accentColor: '#C0392B',
    spriteSrc: `${base}assets/characters/sporcu.png`,
    stats: { hp: 95, atk: 98, spd: 85 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'gezgin',
    name: 'Gezgin',
    tagline: 'Çanta hazır. Plan yok. Hallederiz.',
    accentColor: '#1ABC9C',
    spriteSrc: `${base}assets/characters/gezgin.png`,
    stats: { hp: 80, atk: 58, spd: 96 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'sair',
    name: 'Şair',
    tagline: 'Sevdikçe güzelleşiyor. Ve güzelleştikçe sevesim geliyor',
    accentColor: '#C0392B',
    spriteSrc: `${base}assets/characters/sair.png`,
    stats: { hp: 68, atk: 70, spd: 60 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'sakamatik',
    name: 'Şakamatik Ouzan',
    tagline: 'Gülmeyin. Şaka bu. Güldünüz.',
    accentColor: '#E74C3C',
    spriteSrc: `${base}assets/characters/sakamatik.png`,
    stats: { hp: 75, atk: 82, spd: 77 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
  char({
    id: 'uzman_doktor',
    name: 'Uzman Doktor Ouzan',
    tagline: 'Teşhis net. Tedavi: MEMELERİN.',
    accentColor: '#ECF0F1',
    spriteSrc: `${base}assets/characters/uzman_doktor.png`,
    stats: { hp: 88, atk: 60, spd: 65 },
    jokes: ['TODO: real joke #1 goes here', 'TODO: real joke #2 goes here'],
  }),
]

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}

export function getCharacterIndexById(id: string): number {
  return characters.findIndex((c) => c.id === id)
}
