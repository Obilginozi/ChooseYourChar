import { characters } from '../data/characters'

const ANALYTICS_KEY = 'cyc-analytics'

export interface AnalyticsData {
  picks: Record<string, number>
  vsViews: number
}

function empty(): AnalyticsData {
  return { picks: {}, vsViews: 0 }
}

function load(): AnalyticsData {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as AnalyticsData
    return {
      picks: parsed.picks ?? {},
      vsViews: parsed.vsViews ?? 0,
    }
  } catch {
    return empty()
  }
}

function save(data: AnalyticsData) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function recordCharacterPick(characterId: string) {
  const data = load()
  data.picks[characterId] = (data.picks[characterId] ?? 0) + 1
  save(data)
}

export function recordVsView() {
  const data = load()
  data.vsViews += 1
  save(data)
}

export function getAnalytics(): AnalyticsData {
  return load()
}

export interface PickStatRow {
  characterId: string
  name: string
  count: number
}

export function getPickLeaderboard(): PickStatRow[] {
  const data = load()
  return characters
    .map((c) => ({
      characterId: c.id,
      name: c.name,
      count: data.picks[c.id] ?? 0,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getTotalPicks(): number {
  const data = load()
  return Object.values(data.picks).reduce((sum, n) => sum + n, 0)
}

export function resetAnalytics() {
  save(empty())
}

/** Dev helper — also callable from browser console: `window.__cycAnalytics()` */
export function exposeAnalyticsGlobally() {
  if (typeof window === 'undefined') return
  ;(window as Window & { __cycAnalytics?: () => AnalyticsData }).__cycAnalytics =
    () => getAnalytics()
}
