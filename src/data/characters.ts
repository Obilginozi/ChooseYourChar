import type { Character } from '../types/character'

const base = import.meta.env.BASE_URL

export const characters: Character[] = [
  {
    id: 'filozof',
    name: 'Filozof',
    tagline: 'TODO: write a funny tagline for Filozof',
    accentColor: '#C9A66B',
    spriteSrc: `${base}assets/characters/filozof.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'muhendis',
    name: 'Mühendis',
    tagline: 'TODO: write a funny tagline for Mühendis',
    accentColor: '#4A7C9B',
    spriteSrc: `${base}assets/characters/muhendis.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'imam',
    name: 'İmam',
    tagline: 'TODO: write a funny tagline for İmam',
    accentColor: '#2D6A4F',
    spriteSrc: `${base}assets/characters/imam.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'akademisyen',
    name: 'Akademisyen',
    tagline: 'TODO: write a funny tagline for Akademisyen',
    accentColor: '#7B2D26',
    spriteSrc: `${base}assets/characters/akademisyen.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'muzisyen',
    name: 'Müzisyen',
    tagline: 'TODO: write a funny tagline for Müzisyen',
    accentColor: '#9B59B6',
    spriteSrc: `${base}assets/characters/muzisyen.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'fenerbahceli',
    name: 'Fenerbahçeli',
    tagline: 'TODO: write a funny tagline for Fenerbahçeli',
    accentColor: '#FFED00',
    spriteSrc: `${base}assets/characters/fenerbahceli.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'sporcu',
    name: 'Sporcu',
    tagline: 'TODO: write a funny tagline for Sporcu',
    accentColor: '#C0392B',
    spriteSrc: `${base}assets/characters/sporcu.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'gezgin',
    name: 'Gezgin',
    tagline: 'TODO: write a funny tagline for Gezgin',
    accentColor: '#1ABC9C',
    spriteSrc: `${base}assets/characters/gezgin.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'sakamatik',
    name: 'Şakamatik',
    tagline: 'TODO: write a funny tagline for Şakamatik',
    accentColor: '#E74C3C',
    spriteSrc: `${base}assets/characters/sakamatik.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
  {
    id: 'uzman_doktor',
    name: 'Uzman Doktor',
    tagline: 'TODO: write a funny tagline for Uzman Doktor',
    accentColor: '#ECF0F1',
    spriteSrc: `${base}assets/characters/uzman_doktor.png`,
    jokes: [
      'TODO: real joke #1 goes here',
      'TODO: real joke #2 goes here',
    ],
  },
]

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}
