const KEY = 'sg-travel-book:v1'

export type Persisted = {
  /** Ids of ticked items. Unknown ids are kept so edits to the data don't lose ticks. */
  checked: string[]
  chapter: number
  theme: ThemePreference
}

export type ThemePreference = 'light' | 'dark' | 'system'

const empty: Persisted = { checked: [], chapter: 0, theme: 'system' }

export function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      checked: Array.isArray(parsed.checked) ? parsed.checked.filter((v) => typeof v === 'string') : [],
      chapter: typeof parsed.chapter === 'number' ? parsed.chapter : 0,
      theme:
        parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system'
          ? parsed.theme
          : 'system',
    }
  } catch {
    // Private mode, disabled storage, corrupt JSON — the book still works, it
    // just won't remember anything.
    return empty
  }
}

export function save(state: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* nothing we can do, and nothing worth interrupting the user for */
  }
}
