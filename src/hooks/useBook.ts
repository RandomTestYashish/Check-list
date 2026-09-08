import { useCallback, useEffect, useMemo, useState } from 'react'
import { chapters, totalItems } from '@/data/checklist'
import { load, save, type ThemePreference } from '@/lib/storage'
import { clamp, percent } from '@/lib/utils'

const initial = typeof window === 'undefined' ? null : load()

export type ChapterProgress = { done: number; total: number; percent: number }

export function useBook() {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initial?.checked ?? []))
  const [chapter, setChapter] = useState(() => clamp(initial?.chapter ?? 0, 0, chapters.length - 1))
  const [theme, setTheme] = useState<ThemePreference>(() => initial?.theme ?? 'system')

  // Persist on every change. The payload is tiny, so there is nothing to debounce.
  useEffect(() => {
    save({ checked: [...checked], chapter, theme })
  }, [checked, chapter, theme])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'system' ? media.matches : theme === 'dark'
      root.classList.toggle('dark', dark)
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#0c0a09' : '#ffffff')
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const reset = useCallback(() => setChecked(new Set()), [])

  const progressByChapter = useMemo(() => {
    const map = new Map<string, ChapterProgress>()
    for (const c of chapters) {
      const done = c.items.reduce((n, item) => n + (checked.has(item.id) ? 1 : 0), 0)
      map.set(c.id, { done, total: c.items.length, percent: percent(done, c.items.length) })
    }
    return map
  }, [checked])

  const totalDone = useMemo(
    () => chapters.reduce((n, c) => n + (progressByChapter.get(c.id)?.done ?? 0), 0),
    [progressByChapter],
  )

  const goTo = useCallback((index: number) => {
    setChapter(clamp(index, 0, chapters.length - 1))
  }, [])

  return {
    chapters,
    chapter,
    goTo,
    next: useCallback(() => goTo(chapter + 1), [chapter, goTo]),
    prev: useCallback(() => goTo(chapter - 1), [chapter, goTo]),
    isChecked: useCallback((id: string) => checked.has(id), [checked]),
    toggle,
    reset,
    progressByChapter,
    totalDone,
    totalItems,
    totalPercent: percent(totalDone, totalItems),
    theme,
    setTheme,
  }
}

export type Book = ReturnType<typeof useBook>
