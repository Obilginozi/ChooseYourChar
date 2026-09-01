import { useTypewriter } from '../hooks/useTypewriter'

interface DialogueBoxProps {
  text: string
  characterName: string
  accentColor: string
  jokeIndex: number
  jokeTotal: number
}

export function DialogueBox({
  text,
  characterName,
  accentColor,
  jokeIndex,
  jokeTotal,
}: DialogueBoxProps) {
  const { displayed, done } = useTypewriter({ text, speedMs: 22 })

  return (
    <div className="dialogue-box w-full" style={{ borderColor: accentColor }}>
      <div
        className="dialogue-box-header flex items-center justify-between gap-2 px-3 py-2"
        style={{ borderBottomColor: accentColor }}
      >
        <span
          className="font-body text-base sm:text-lg"
          style={{ color: accentColor }}
        >
          {characterName}
        </span>
        <span className="font-body text-lg text-[#a89b7a]">
          Joke {jokeIndex + 1} of {jokeTotal}
        </span>
      </div>
      <div className="dialogue-box-body max-h-[40dvh] overflow-y-auto px-4 py-4 sm:max-h-none">
        <p className="font-body text-xl leading-relaxed text-[#F5E6C8] sm:text-2xl">
          {displayed}
          {!done && (
            <span className="dialogue-cursor" aria-hidden="true">
              ▌
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
