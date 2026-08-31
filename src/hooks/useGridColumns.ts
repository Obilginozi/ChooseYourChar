import { useEffect, useState } from 'react'

function getColumns(width: number): number {
  if (width >= 1024) return 5
  if (width >= 640) return 2
  return 1
}

export function useGridColumns(): number {
  const [columns, setColumns] = useState(() =>
    typeof window !== 'undefined' ? getColumns(window.innerWidth) : 5,
  )

  useEffect(() => {
    const handleResize = () => setColumns(getColumns(window.innerWidth))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return columns
}
