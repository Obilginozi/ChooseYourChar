import { useCallback, useState } from 'react'

export type GameScreen = 'title' | 'select' | 'detail'

export function useGameScreen() {
  const [screen, setScreen] = useState<GameScreen>('title')
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  )
  const [transitioning, setTransitioning] = useState(false)
  const [pendingScreen, setPendingScreen] = useState<GameScreen | null>(null)

  const navigateTo = useCallback((next: GameScreen) => {
    setPendingScreen(next)
    setTransitioning(true)
  }, [])

  const completeTransition = useCallback(() => {
    if (pendingScreen) {
      setScreen(pendingScreen)
      setPendingScreen(null)
    }
    setTransitioning(false)
  }, [pendingScreen])

  const goToTitle = useCallback(() => navigateTo('title'), [navigateTo])
  const goToSelect = useCallback(() => navigateTo('select'), [navigateTo])
  const goToDetail = useCallback(
    (characterId: string) => {
      setSelectedCharacterId(characterId)
      navigateTo('detail')
    },
    [navigateTo],
  )

  return {
    screen,
    selectedCharacterId,
    transitioning,
    navigateTo,
    completeTransition,
    goToTitle,
    goToSelect,
    goToDetail,
    setSelectedCharacterId,
  }
}
