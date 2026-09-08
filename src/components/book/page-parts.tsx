import type { Chapter } from '@/data/checklist'
import { chapterUnit, chapters } from '@/data/checklist'
import type { ChapterProgress } from '@/hooks/useBook'
import { ChecklistRow } from '@/components/book/ChecklistRow'
import { cn } from '@/lib/utils'

export function RunningHead({ right, className }: { right: string; className?: string }) {
  return (
    <div
      className={cn(
        'u-kicker flex items-center justify-between gap-3 text-ink-faint',
        className,
      )}
    >
      <span className="truncate">
        Singapore<span className="hidden min-[360px]:inline"> · September 2026</span>
      </span>
      <span>{right}</span>
    </div>
  )
}

export function ChapterHeading({
  chapter,
  progress,
  className,
}: {
  chapter: Chapter
  progress: ChapterProgress
  className?: string
}) {
  return (
    <header className={cn('chapter-heading space-y-3', className)}>
      <div className="flex items-center gap-4">
        <span className="u-display u-numeral text-[2.25rem] leading-none text-accent">
          {chapter.number}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      <h2 className="u-display text-[clamp(1.75rem,7.5vw,2.5rem)] leading-[1.05] tracking-[0.01em] uppercase text-ink">
        {chapter.title}
      </h2>

      <p className="max-w-[36ch] text-[0.875rem] leading-relaxed text-ink-muted">
        {chapter.subtitle}
      </p>

      <div className="flex items-center gap-3 pt-1">
        <span className="u-kicker u-numeral text-ink">
          {progress.done} / {progress.total} {chapterUnit[chapter.id] ?? 'done'}
        </span>
        <span className="h-px flex-1 bg-rule">
          <span
            className="block h-px bg-accent transition-[width] duration-500 ease-page"
            style={{ width: `${progress.percent}%` }}
          />
        </span>
      </div>
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
        'divide-y divide-rule/70',
        columns && 'divide-y-0 lg:[column-count:2] lg:[column-gap:2.5rem]',
      )}
    >
      {chapter.items.map((item) => (
        <li
          key={item.id}
          className={cn(columns && 'break-inside-avoid border-b border-rule/70')}
        >
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
        'border-l border-accent/40 pl-4 text-[0.8125rem] leading-relaxed text-ink-muted',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function PageFolio({
  index,
  className,
  hint,
}: {
  index: number
  className?: string
  hint?: string
}) {
  return (
    <div className={cn('u-kicker flex items-center justify-between text-ink-faint', className)}>
      <span>{hint}</span>
      <span className="u-numeral">
        {chapters[index].number} / {String(chapters.length).padStart(2, '0')}
      </span>
    </div>
  )
}
