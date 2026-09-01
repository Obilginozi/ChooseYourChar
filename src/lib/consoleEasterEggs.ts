const STYLES = {
  title: 'color:#FFD700;font-size:14px;font-weight:bold;font-family:monospace',
  pink: 'color:#FF69B4;font-size:12px;font-family:monospace',
  cream: 'color:#F5E6C8;font-size:11px;font-family:monospace',
  muted: 'color:#a89b7a;font-size:10px;font-family:monospace',
  heart: 'color:#FF1493;font-size:16px;font-family:monospace',
} as const

const PIXEL_HEART = `
  ███   ███
 █████ █████
 ███████████
  █████████
   ███████
    █████
     ███
      █`

const LOVE_LINES = [
  'Bu siteyi senin için yaptım.',
  'Karakter seçmek kolay. Senden etkilenmek daha kolaydı.',
  'Her confirm tuşu aslında sana selam.',
  'VS’te kim kazanırsa kazansın, kalbim senin tarafında.',
]

const SEN_LINES = [
  'Gülüşün — cheat code gibi, her şeyi açıyor.',
  'Sabırın — boss fight’ı bitiren tek item.',
  'Sesin — benim favori soundtrack.',
  'Varlığın — bu oyunun asıl final sahnesi.',
  'Sen — Aslında main character sensin.',
]

type SecretWindow = Window & {
  love?: () => void
  sen?: () => void
  kalp?: () => void
  gizli?: () => void
}

function logLine(text: string, style: keyof typeof STYLES = 'cream') {
  console.log(`%c${text}`, STYLES[style])
}

export function exposeConsoleEasterEggs() {
  if (typeof window === 'undefined') return

  const w = window as SecretWindow

  console.log(
    '%c♥ CHOOSE YOUR OUZAN ♥%c\n\nBu oyunu biri senin için kodladı.\nMerak ettiysen konsola %cgizli()%c yaz.',
    STYLES.title,
    STYLES.cream,
    STYLES.pink,
    STYLES.cream,
  )

  w.love = () => {
    console.group('%c♥ love()', STYLES.heart)
    LOVE_LINES.forEach((line) => logLine(line, 'pink'))
    logLine('Seni seviyorum.', 'title')
    console.groupEnd()
  }

  w.sen = () => {
    console.group('%c✦ sen()', STYLES.title)
    SEN_LINES.forEach((line, i) => logLine(`${i + 1}. ${line}`, 'cream'))
    logLine('Bugün de, yarın da, sonsuz devam da: sen.', 'pink')
    console.groupEnd()
  }

  w.kalp = () => {
    console.log(`%c${PIXEL_HEART}`, STYLES.heart)
    logLine('HP: ∞  |  ATK: ♥  |  SPD: kalbine göre', 'muted')
  }

  w.gizli = () => {
    console.group('%c? gizli komutlar', STYLES.title)
    logLine('love()  — sana yazılmış mesajlar', 'cream')
    logLine('sen()   — nasıl sensin', 'cream')
    logLine('kalp()  — pixel kalp', 'cream')
    logLine('gizli() — bu liste', 'cream')
    logLine('Şair karakterini onayla → bonus mesaj', 'muted')
    console.groupEnd()
  }
}

export function easterEggOnCharacterPick(characterId: string) {
  if (characterId === 'sair') {
    console.log(
      '%c♥ Şair seçildi%c\n"Sahi nedir sevmek; Bir muma ateş olmak mı, yoksa yanan ateşe dokunmak mı?"\n— bu satır sana aitti.',
      STYLES.heart,
      STYLES.pink,
    )
    return
  }

  if (characterId === 'fenerbahceli') {
    logLine('Marş çalıyor. Tribün seninle dolsun. 💛💙', 'cream')
    return
  }

  if (characterId === 'sexolog') {
    logLine('LED’ler yanıyor. Ama asıl ışık sensin. ✨', 'pink')
  }
}
