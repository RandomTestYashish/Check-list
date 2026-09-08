import { useEffect, useRef, useState } from 'react'
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import type { ThemePreference } from '@/lib/storage'
import { JourneyProgress } from '@/components/book/progress-marks'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const themeOptions: { value: ThemePreference; label: string; icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
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
      <p className="u-kicker text-muted-foreground px-6 pt-6 pb-4 md:px-8">Contents</p>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 md:px-6">
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
                    'focus-visible:ring-ring/50 flex w-full items-baseline gap-1 rounded-md px-2 py-3 text-left transition-colors outline-none focus-visible:ring-[3px]',
                    current ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                  )}
                >
                  <span
                    className={cn(
                      'u-kicker u-numeral w-7 shrink-0',
                      current ? 'text-brand' : 'text-muted-foreground',
                    )}
                  >
                    {chapter.number}
                  </span>
                  <span
                    className={cn(
                      'truncate text-sm',
                      current ? 'text-foreground font-medium' : 'text-foreground/80',
                    )}
                  >
                    {chapter.title}
                  </span>
                  <span className="u-leader" aria-hidden />
                  <span
                    className={cn(
                      'u-kicker u-numeral shrink-0',
                      complete ? 'text-brand' : 'text-muted-foreground',
                    )}
                  >
                    {complete ? <CheckIcon className="size-3.5" /> : `${p?.percent ?? 0}%`}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-5 border-t px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8">
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
    <div
      className="bg-muted flex items-center gap-0.5 rounded-lg p-0.5"
      role="group"
      aria-label="Theme"
    >
      {themeOptions.map(({ value: option, label, icon: Icon }) => (
        <Button
          key={option}
          variant="ghost"
          size="sm"
          onClick={() => onChange(option)}
          aria-label={label}
          aria-pressed={value === option}
          className={cn(
            'size-7 px-0',
            value === option
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-transparent',
          )}
        >
          <Icon className="size-3.5" />
        </Button>
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
    <Button
      variant="ghost"
      size="sm"
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
        'u-kicker',
        armed ? 'text-destructive hover:text-destructive' : 'text-muted-foreground',
      )}
    >
      {armed ? `Clear ${count}? Tap again` : 'Start over'}
    </Button>
  )
}
