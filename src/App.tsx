import { CRTOverlay } from './components/CRTOverlay'
import { GameControls } from './components/GameControls'
import { ScreenTransition } from './components/ScreenTransition'
import { useCrtToggle } from './hooks/useCrtToggle'
import { SoundProvider, useSound } from './hooks/useSound'
import { useGameScreen } from './hooks/useGameScreen'
import { recordCharacterPick, recordVsView } from './lib/analytics'
import { AboutScreen } from './screens/AboutScreen'
import { DetailScreen } from './screens/DetailScreen'
import { SelectScreen } from './screens/SelectScreen'
import { TitleScreen } from './screens/TitleScreen'
import { VsScreen } from './screens/VsScreen'
import { getCharacterIndexById } from './data/characters'
import { getLastCharacterId } from './lib/lastCharacter'

function AppContent() {
  const {
    screen,
    selectedCharacterId,
    transitioning,
    completeTransition,
    goToTitle,
    goToSelect,
    goToDetail,
    goToVs,
    goToAbout,
  } = useGameScreen()
  const { playSfx } = useSound()
  const { crtEnabled, crtToggleVisible, toggleCrt } = useCrtToggle()

  const handleStart = () => {
    playSfx('start')
    goToSelect()
  }

  const handleConfirmCharacter = (characterId: string) => {
    recordCharacterPick(characterId)
    goToDetail(characterId)
  }

  const handleVs = () => {
    playSfx('cursor')
    recordVsView()
    goToVs()
  }

  const vsInitialIndex = (() => {
    const id = getLastCharacterId()
    if (!id) return 0
    const idx = getCharacterIndexById(id)
    return idx >= 0 ? idx : 0
  })()

  return (
    <div className={`relative min-h-dvh bg-[#0D0D1A] ${crtEnabled ? 'crt-active' : ''}`}>
      <GameControls
        crtEnabled={crtEnabled}
        crtToggleVisible={crtToggleVisible}
        onToggleCrt={toggleCrt}
      />

      {screen === 'title' && (
        <TitleScreen onStart={handleStart} onAbout={goToAbout} />
      )}
      {screen === 'select' && (
        <SelectScreen
          onBack={goToTitle}
          onConfirm={handleConfirmCharacter}
          onVs={handleVs}
        />
      )}
      {screen === 'vs' && (
        <VsScreen
          initialLeftIndex={vsInitialIndex}
          onBack={goToSelect}
        />
      )}
      {screen === 'about' && <AboutScreen onBack={goToTitle} />}
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
