import { useCallback, useEffect } from 'react'

interface UseKeyboardNavOptions {
  itemCount: number
  columns: number
  selectedIndex: number
  onSelect: (index: number) => void
  onConfirm: (index: number) => void
  onEscape?: () => void
  enabled?: boolean
}

export function useKeyboardNav({
  itemCount,
  columns,
  selectedIndex,
  onSelect,
  onConfirm,
  onEscape,
  enabled = true,
}: UseKeyboardNavOptions) {
  const clamp = useCallback(
    (index: number) => Math.max(0, Math.min(itemCount - 1, index)),
    [itemCount],
  )

  const move = useCallback(
    (deltaRow: number, deltaCol: number) => {
      const row = Math.floor(selectedIndex / columns)
      const col = selectedIndex % columns
      const newRow = row + deltaRow
      const newCol = col + deltaCol

      if (newRow < 0 || newCol < 0 || newCol >= columns) return

      const newIndex = newRow * columns + newCol
      if (newIndex < itemCount) {
        onSelect(newIndex)
      }
    },
    [selectedIndex, columns, itemCount, onSelect],
  )

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          onSelect(clamp(selectedIndex - 1))
          break
        case 'ArrowRight':
          e.preventDefault()
          onSelect(clamp(selectedIndex + 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          move(-1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          move(1, 0)
          break
        case 'Enter':
          e.preventDefault()
          onConfirm(selectedIndex)
          break
        case 'Escape':
          e.preventDefault()
          onEscape?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    enabled,
    selectedIndex,
    onSelect,
    onConfirm,
    onEscape,
    clamp,
    move,
  ])
}
