import type { Chapter } from '@/data/checklist'
import type { ChapterProgress } from '@/hooks/useBook'
import { ChecklistRow } from '@/components/book/ChecklistRow'
import { ChapterStamp, stampDate } from '@/components/book/PassportStamp'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function RunningHead({ right, className }: { right?: string; className?: string }) {
  return (
    <div
      className={cn(
        'u-kicker text-muted-foreground flex items-center justify-between gap-3',
        className,
      )}
    >
      <span className="truncate">
        Singapore<span className="hidden min-[360px]:inline"> · September 2026</span>
      </span>
      {right && <span className="u-numeral shrink-0">{right}</span>}
    </div>
  )
}

export function ChapterHeading({
  chapter,
  progress,
  stampedOn,
  className,
}: {
  chapter: Chapter
  progress: ChapterProgress
  stampedOn?: string
  className?: string
}) {
  const complete = progress.percent === 100

  return (
    <header className={cn('chapter-heading', className)}>
      {/* One compact card: number, chapter, count and progress in a single
          band, so the list starts near the top of the page. */}
      <div className="bg-card/70 rounded-2xl px-3 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur-[2px]">
        <div className="flex items-center gap-2.5">
          <span className="u-numeral text-brand shrink-0 text-[0.8125rem] font-semibold">
            {chapter.number}
          </span>
          <span className="shrink-0 text-sm leading-none" aria-hidden>
            {chapter.emoji}
          </span>
          <h2 className="u-display min-w-0 flex-1 truncate text-[1.0625rem] leading-tight">
            {chapter.title}
          </h2>
          <span
            className={cn(
              'u-numeral shrink-0 text-[0.6875rem] tabular-nums',
              complete ? 'text-brand' : 'text-muted-foreground',
            )}
          >
            {progress.done}/{progress.total}
          </span>
        </div>

        <Progress
          value={progress.percent}
          indicatorClassName="bg-brand"
          aria-label={`${chapter.title} progress`}
          className="mt-2 h-[3px]"
        />
      </div>

      <p className="text-muted-foreground mt-2.5 px-1 text-[0.75rem] leading-snug">
        {chapter.subtitle}
      </p>

      {complete && (
        <div className="flex justify-end">
          <ChapterStamp
            title={chapter.title}
            number={chapter.number}
            date={stampDate(stampedOn)}
            className="-mr-1 -mt-1 w-[7.5rem] -rotate-[5deg]"
          />
        </div>
      )}
    </header>
  )
}

export function ChapterItems({
  chapter,
  isChecked,
  toggle,
  columns = false,
}: {
  chapter: Chapter
  isChecked: (id: string) => boolean
  toggle: (id: string) => void
  columns?: boolean
}) {
  return (
    <ul
      className={cn(
        'flex flex-col gap-0.5',
        columns && 'block lg:[column-count:2] lg:[column-gap:2rem]',
      )}
    >
      {chapter.items.map((item) => (
        <li key={item.id} className={cn(columns && 'break-inside-avoid')}>
          <ChecklistRow
            item={item}
            checked={isChecked(item.id)}
            onToggle={() => toggle(item.id)}
          />
        </li>
      ))}
    </ul>
  )
}

/** A short aside set in the margin — the closest thing here to marginalia. */
export function MarginNote({ children, className }: { children: string; className?: string }) {
  return (
    <p
      className={cn(
        'bg-muted/70 text-muted-foreground rounded-2xl px-4 py-3 text-[0.8125rem] leading-relaxed',
        className,
      )}
    >
      {children}
    </p>
  )
}

