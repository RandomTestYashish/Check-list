import type { Chapter } from '@/data/checklist'
import { chapterUnit, chapters } from '@/data/checklist'
import type { ChapterProgress } from '@/hooks/useBook'
import { ChecklistRow } from '@/components/book/ChecklistRow'
import { ChapterStamp, stampDate } from '@/components/book/PassportStamp'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function RunningHead({ right, className }: { right: string; className?: string }) {
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
      <span className="u-numeral shrink-0">{right}</span>
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
  return (
    <header className={cn('chapter-heading space-y-3', className)}>
      <div className="flex items-center gap-4">
        <span className="u-display u-numeral text-brand text-4xl leading-none">
          {chapter.number}
        </span>
        <Separator className="flex-1" />
      </div>

      <h2 className="u-display text-card-foreground flex items-baseline gap-2.5 text-[clamp(1.75rem,7.5vw,2.625rem)] leading-[1.08] tracking-[-0.01em]">
        <span className="shrink-0 text-[0.62em]" aria-hidden>
          {chapter.emoji}
        </span>
        {chapter.title}
      </h2>

      <p className="text-muted-foreground max-w-[38ch] text-sm leading-relaxed">
        {chapter.subtitle}
      </p>

      <div className="flex items-center gap-3 pt-1">
        <span className="u-kicker u-numeral bg-muted text-foreground shrink-0 rounded-full px-3 py-1.5">
          {progress.done} / {progress.total} {chapterUnit[chapter.id] ?? 'done'}
        </span>
        <Progress
          value={progress.percent}
          indicatorClassName="bg-brand"
          aria-label={`${chapter.title} progress`}
        />
      </div>

      {progress.percent === 100 && (
        <div className="flex justify-end pt-2">
          <ChapterStamp
            title={chapter.title}
            number={chapter.number}
            date={stampDate(stampedOn)}
            className="-mr-2 -rotate-[5deg]"
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

export function PageFolio({ index, className }: { index: number; className?: string }) {
  return (
    <div className={cn('u-kicker text-muted-foreground flex items-center gap-3', className)}>
      <span className="u-numeral">
        Page {chapters[index].number} of {String(chapters.length).padStart(2, '0')}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span aria-hidden>{chapters[index].emoji}</span>
    </div>
  )
}
