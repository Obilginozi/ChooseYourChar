import { CRTOverlay } from './components/CRTOverlay'
import { GameControls } from './components/GameControls'
import { ScreenTransition } from './components/ScreenTransition'
import { useCrtToggle } from './hooks/useCrtToggle'
import { SoundProvider, useSound } from './hooks/useSound'
import { useGameScreen } from './hooks/useGameScreen'
import { DetailScreen } from './screens/DetailScreen'
import { SelectScreen } from './screens/SelectScreen'
import { TitleScreen } from './screens/TitleScreen'

function AppContent() {
  const {
    screen,
    selectedCharacterId,
    transitioning,
    completeTransition,
    goToTitle,
    goToSelect,
    goToDetail,
  } = useGameScreen()
  const { markInteracted, playSfx } = useSound()
  const { crtEnabled, crtToggleVisible, toggleCrt } = useCrtToggle()

  const handleStart = () => {
    markInteracted()
    playSfx('start')
    goToSelect()
  }

  const handleConfirmCharacter = (characterId: string) => {
    markInteracted()
    playSfx('confirm')
    goToDetail(characterId)
  }

  return (
    <div className="relative min-h-dvh bg-[#0D0D1A]">
      <GameControls
        crtEnabled={crtEnabled}
        crtToggleVisible={crtToggleVisible}
        onToggleCrt={toggleCrt}
      />

      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'select' && (
        <SelectScreen
          onBack={goToTitle}
          onConfirm={handleConfirmCharacter}
        />
      )}
      {screen === 'detail' && selectedCharacterId && (
        <DetailScreen
          characterId={selectedCharacterId}
          onBack={goToSelect}
        />
      )}

      <CRTOverlay enabled={crtEnabled} />

      <ScreenTransition
        active={transitioning}
        onComplete={completeTransition}
      />
    </div>
  )
}

function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  )
}

export default App
