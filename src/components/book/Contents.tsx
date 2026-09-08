import { useEffect, useRef, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import type { ThemePreference } from '@/lib/storage'
import { JourneyProgress } from '@/components/book/progress-marks'
import { cn } from '@/lib/utils'

const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function Contents({
  book,
  onSelect,
  className,
}: {
  book: Book
  onSelect: (index: number) => void
  className?: string
}) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="u-kicker px-6 pt-6 pb-4 text-ink-faint md:px-8">Contents</div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 md:px-8">
        <ul>
          {book.chapters.map((chapter, index) => {
            const p = book.progressByChapter.get(chapter.id)
            const current = index === book.chapter
            const complete = p?.percent === 100
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'flex w-full items-baseline gap-1 border-b border-rule/60 py-3.5 text-left transition-colors',
                    current ? 'text-ink' : 'text-ink-muted hover:text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'u-kicker u-numeral w-7 shrink-0',
                      current ? 'text-accent' : 'text-ink-faint',
                    )}
                  >
                    {chapter.number}
                  </span>
                  <span
                    className={cn(
                      'truncate text-[0.9375rem]',
                      current && 'u-display text-[1.0625rem]',
                    )}
                  >
                    {chapter.title}
                  </span>
                  <span className="u-leader" aria-hidden />
                  <span
                    className={cn(
                      'u-kicker u-numeral shrink-0 tabular-nums',
                      complete ? 'text-accent' : 'text-ink-faint',
                    )}
                  >
                    {complete ? <Check className="size-3.5" strokeWidth={2.5} /> : `${p?.percent ?? 0}%`}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-5 border-t border-rule px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8">
        <JourneyProgress
          done={book.totalDone}
          total={book.totalItems}
          percent={book.totalPercent}
          progressByChapter={book.progressByChapter}
        />
        <div className="flex items-center justify-between gap-3">
          <ThemeToggle value={book.theme} onChange={book.setTheme} />
          <ResetButton onReset={book.reset} count={book.totalDone} />
        </div>
      </div>
    </div>
  )
}

function ThemeToggle({
  value,
  onChange,
}: {
  value: ThemePreference
  onChange: (value: ThemePreference) => void
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-rule p-0.5" role="group" aria-label="Theme">
      {themeOptions.map(({ value: option, label, icon: Icon }) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-label={label}
          aria-pressed={value === option}
          className={cn(
            'grid size-7 place-items-center rounded-full transition-colors',
            value === option ? 'bg-ink text-paper' : 'text-ink-faint hover:text-ink',
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}

/** Two taps to clear the book — a confirm dialog would be heavier than the action. */
function ResetButton({ onReset, count }: { onReset: () => void; count: number }) {
  const [armed, setArmed] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (count === 0) return null

  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          onReset()
          setArmed(false)
          window.clearTimeout(timer.current)
        } else {
          setArmed(true)
          timer.current = window.setTimeout(() => setArmed(false), 4000)
        }
      }}
      className={cn(
        'u-kicker rounded-full px-3 py-2 transition-colors',
        armed ? 'bg-accent-wash text-accent' : 'text-ink-faint hover:text-ink',
      )}
    >
      {armed ? `Clear ${count}? Tap again` : 'Start over'}
    </button>
  )
}
