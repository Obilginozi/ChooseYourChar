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
    tagline: 'Kötü kötü olmak ne demek? Tartışılır.',
    accentColor: '#C9A66B',
    spriteSrc: `${base}assets/characters/filozof.png`,
    stats: { hp: 72, atk: 45, spd: 38 },
    jokes: [
      'Baba tarafı vibe ını nasıl oluştuğunu hep merak ederdim.',
      'Güneşin batmasıyla ışığın yok olduğunu sanırlar. Oysa ben bilirim ki bazı insanlar ışığı gökyüzünden değil, birbirlerinden alır. Bazı insanlar başkalarına ısı ve ışık kaynağı olur. ',
      'Freud rüyaları yorumlardı. Travmaları yorumlardı. Büyük adamdı vesselam.',
    ],
  }),
  char({
    id: 'muhendis',
    name: 'Mühendis Ouzan',
    tagline: 'Sen o kadar oku sonra gel bunu yap...',
    accentColor: '#4A7C9B',
    spriteSrc: `${base}assets/characters/muhendis.png`,
    stats: { hp: 65, atk: 88, spd: 91 },
    jokes: [
      'Bir evin en gerekli iki şeyidir bunlar: Modem ve bebek yağı',
      'Son AI bükücü... Maestro, orkestra şefi...',
      'Seni tanıyıp da kendinin olsun istemeyen varsa şaşarım aklına... (Mac Studio)',
      'Bug bir feature’dır. Dokunma. Dokunursan feature da gider.',
    ],
  }),
  char({
    id: 'imam',
    name: 'İmam Ouzan',
    tagline: 'Dil belalarına dikkat edelim gençler',
    accentColor: '#2D6A4F',
    spriteSrc: `${base}assets/characters/imam.png`,
    stats: { hp: 90, atk: 55, spd: 48 },
    jokes: [
      '1- Rukye nedir? 2- Hayızlı kadına Kuran okuyarak rukye yapılması',
      'Şükür namazlarında yarışanlar var. Kaza namazlarını da unutmayalım.',
      'Bana soruyorlar oruçluyken emzirmek günah mı diye ben nereden bileyim 30 yaşında kocasını emzireceğini',
      'Sabır güzeldir dedim. Cemaat sordu: ne kadar? Ben: biraz daha.',
    ],
  }),
  char({
    id: 'akademisyen',
    name: 'Akademisyen Ouzan',
    tagline: 'Bu rapor okunsun. Kesin sorarım.',
    accentColor: '#7B2D26',
    spriteSrc: `${base}assets/characters/akademisyen.png`,
    stats: { hp: 78, atk: 62, spd: 52 },
    jokes: [
      'BEN SİZE PERFORMANS ÖDEVİ YAPIN DEMEDİM, TEZ YAZIN DEDİM.',
      'Bazen white board önünde ders anlatmak çok kolay gözüküyor ama tamamen bir sanat işi, onu nasıl ele alacağınız, nasıl anlatacağınız, dikkati kendinizde tutuşunuz...',
      'Makaleyi revize ettim. Bir revize daha. Bir revize daha. Çıktı.',
      'lim(t→∞) [ ∫₀ᵗ (ZS·e^(OBx) + OB·e^(ZSx)) dx ] / √(ZS² + OB²)',
    ],
  }),
  char({
    id: 'muzisyen',
    name: 'Müzisyen Ouzan',
    tagline: 'Parmaklarımın nasıl bu kadar hızlı olduğunu soruyordun...',
    accentColor: '#9B59B6',
    spriteSrc: `${base}assets/characters/muzisyen.png`,
    stats: { hp: 70, atk: 75, spd: 80 },
    jokes: [
      'Hayır manifest çalamıyorum maalesef...',
      'Köööööörr bıçağııımmmmmm, kimseleri kesememmm...',
      'Zil düştü ama ben çalmaya devam ettim, sahne kuralıdır.',
      'C mi Am mi? Önemli değil. Önemli olan sesin dışarıda nasıl olduğu.',
    ],
  }),
  char({
    id: 'fenerbahceli',
    name: 'Fenerbahçeli Ouzan',
    tagline: 'O sene bu sene.',
    accentColor: '#FFED00',
    spriteSrc: `${base}assets/characters/fenerbahceli.png`,
    stats: { hp: 85, atk: 92, spd: 70 },
    jokes: [
      'O sene bu sene. Bu sene de o sene. İnanmayan otobüse binmesin.',
      'Fenerin maç saatinde muffin yapmak istiyorum seninle.',
      'Aziz çok yaşlandı. Bir sonraki başkanlık seçiminde karım yazıp sana basacağım.',
      'Bahis reklamı, seçilin fonları. Karaborsa bu ibnelerin tek geçim kaynağı. Terör yuvası...',
    ],
  }),
  char({
    id: 'sporcu',
    name: 'Sporcu Ouzan',
    tagline: 'Kardiyo çalışmak isteyen herkes burada. ',
    accentColor: '#C0392B',
    spriteSrc: `${base}assets/characters/sporcu.png`,
    stats: { hp: 95, atk: 98, spd: 85 },
    jokes: [
      'Kolları 41 yapıcam. Sidequest geldi. Çoktan kabul ettim.',
      'Kardiyo mu ağırlık mı? İkisi de yarın. Bugün stretching: kanepede.',
      'Ölçülerim mi? Aklımdaki tek ölçüler onun ölçüleri.',
      'Bazen sporcu bazen PT yim. Ama bazende yoga antrenörü.',
    ],
  }),
  char({
    id: 'gezgin',
    name: 'Gezgin Ouzan',
    tagline: 'Kayboldum ama manzara güzel.',
    accentColor: '#1ABC9C',
    spriteSrc: `${base}assets/characters/gezgin.png`,
    stats: { hp: 80, atk: 58, spd: 96 },
    jokes: [
      'Onca yer gezdim, en güzel yer hala gitmediğim Bozcaada.',
      '🧭 Destination: 02°24′27″ — 12°44′4″ 📍 Unknown Location “Buraya ulaşmak için önce doğru kişiyi bulman gerekiyor.”',
      'Gezin, deneyimleyin... Mutfağa da gidin deneyimleyin. Salona da gidin deneyimleyin.',
      'Kayboldum ama manzara güzel. Panik de güzel. Hepsi deneyim.',
    ],
  }),
  char({
    id: 'fotografci',
    name: 'Fotoğrafçı Ouzan',
    tagline: 'Bir kare daha. Sonra bir kere daha.',
    accentColor: '#5B7C99',
    spriteSrc: `${base}assets/characters/fotografci.png`,
    stats: { hp: 76, atk: 68, spd: 88 },
    jokes: [
      'Yusuf Güney ile fotoğrafını ben çekmek isterdim.',
      'Kocam çok güzel fotoğraflar çeker inş diyordun pratik yapıyorum laik olmak için.',
      'Kadrajda sen yoksan eğer manzara fotoğrafları güzel çıkmıyor.',
      'Çektiğim fotoğraflar sıcak bastırabilir dikkat et bebeğim.',
    ],
  }),
  char({
    id: 'sair',
    name: 'Şair Ouzan',
    tagline: 'Uçmasak da yükseğiz bir oluruz...',
    accentColor: '#C0392B',
    spriteSrc: `${base}assets/characters/sair.png`,
    stats: { hp: 68, atk: 70, spd: 60 },
    jokes: [
      'Gezgin kaybolunca manzaraya bakar ama ben sana bakıp kaybolmak istiyorum',
      'Sevdikçe güzelleşiyorsun ve güzelleştikçe sevesim geliyor',
      'Şöyle bir gece otursak sabaha kadar konuşsak...',
    ],
  }),
  char({
    id: 'sakamatik',
    name: 'Şakamatik Ouzan',
    tagline: 'Gülmeyin. Şaka bu. Güldünüz.',
    accentColor: '#E74C3C',
    spriteSrc: `${base}assets/characters/sakamatik.png`,
    stats: { hp: 75, atk: 82, spd: 77 },
    jokes: [
      'Şaka yaptım. Güldünüz. Fatura kesilir, haberiniz olsun.',
      'Ben mi en çok kime gülüyorum? Çok güzel ve çok komik olan birine.',
      'Punchline’ı duydunuz mu? Duymadınız mı. Çokta önemli değil zaten makara yapıyorum.',
    ],
  }),
  char({
    id: 'uzman_doktor',
    name: 'Uzman Doktor Ouzan',
    tagline: 'Teşhis net. Tedavi: MEMELERİN.',
    accentColor: '#ECF0F1',
    spriteSrc: `${base}assets/characters/uzman_doktor.png`,
    stats: { hp: 88, atk: 60, spd: 65 },
    jokes: [
      'Steteskop taktım. Kalp değil, Yalın dinliyorum.',
      'Teşhis net. Tedavi: MEMELERİN. Yan etki: mutluluk.',
    ],
  }),
  char({
    id: 'sexolog',
    name: 'Seksolog Ouzan',
    tagline: 'Bilim var. Deneyimler var. Konuşalım.',
    accentColor: '#D63384',
    spriteSrc: `${base}assets/characters/sexolog.png`,
    stats: { hp: 74, atk: 78, spd: 72 },
    jokes: [
      'Cinsel hayat nasıl?. Yastıklara güveneneler var aramızda biliyorum',
      'Abi adam gelmiş diyor ki "Kedi tasması kullanmak istiyorum ben" diyor',
      'Ayak yalanır mı arkadaşlar, saçmalamayın lütfen. Kadın ayağı koklanır. Gurme işidir...',
      'Tabu yok, utanç geçici. Bilim kalıcı. Randevularım da dolu.',
    ],
  }),
]

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}

export function getCharacterIndexById(id: string): number {
  return characters.findIndex((c) => c.id === id)
}
