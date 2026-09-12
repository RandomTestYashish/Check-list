const KEY = 'sg-travel-book:v1'

export type Persisted = {
  /** Ids of ticked items. Unknown ids are kept so edits to the data don't lose ticks. */
  checked: string[]
  chapter: number
  theme: ThemePreference
  /** The first-run cue is shown once, then never again. */
  seenIntro: boolean
  /** The swipe hint retires as soon as a page has actually been turned. */
  hasFlipped: boolean
  /** Chapter id to the day it was finished, which its stamp records. */
  stamps: Record<string, string>
}

export type ThemePreference = 'light' | 'dark' | 'system'

const empty: Persisted = {
  checked: [],
  chapter: 0,
  theme: 'system',
  seenIntro: false,
  hasFlipped: false,
  stamps: {},
}

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
      seenIntro: parsed.seenIntro === true,
      hasFlipped: parsed.hasFlipped === true,
      stamps:
        parsed.stamps && typeof parsed.stamps === 'object' ? (parsed.stamps as Record<string, string>) : {},
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
