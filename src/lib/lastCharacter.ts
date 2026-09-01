const LAST_KEY = 'cyc-last-character'

export function getLastCharacterId(): string | null {
  try {
    return localStorage.getItem(LAST_KEY)
  } catch {
    return null
  }
}

export function setLastCharacterId(id: string) {
  try {
    localStorage.setItem(LAST_KEY, id)
  } catch {
    // ignore
  }
}
