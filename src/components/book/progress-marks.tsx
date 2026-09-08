import { chapters } from '@/data/checklist'
import type { ChapterProgress } from '@/hooks/useBook'
import { cn } from '@/lib/utils'

/**
 * The fore-edge of the book: one stroke per chapter, inked in proportion to how
 * much of that chapter is done. Doubles as a position indicator.
 */
export function PageEdges({
  progressByChapter,
  current,
  onSelect,
  className,
}: {
  progressByChapter: Map<string, ChapterProgress>
  current?: number
  onSelect?: (index: number) => void
  className?: string
}) {
  return (
    <div className={cn('flex h-6 items-end gap-[3px] pb-[2px]', className)} aria-hidden>
      {chapters.map((chapter, index) => {
        const p = progressByChapter.get(chapter.id)?.percent ?? 0
        const isCurrent = index === current
        const Tag = onSelect ? 'button' : 'div'
        return (
          <Tag
            key={chapter.id}
            {...(onSelect
              ? { type: 'button' as const, onClick: () => onSelect(index), tabIndex: -1 }
              : {})}
            className={cn(
              'bg-foreground/10 relative h-full flex-1 overflow-hidden rounded-xs',
              onSelect && 'cursor-pointer',
            )}
          >
            <span
              className="bg-brand/80 absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-page"
              style={{ height: `${p}%` }}
            />
            {isCurrent && <span className="bg-foreground absolute inset-x-0 -bottom-0.5 h-0.5" />}
          </Tag>
        )
      })}
    </div>
  )
}

/** "62 / 108 — 57% ready", or the completion notice once the book is finished. */
export function JourneyProgress({
  done,
  total,
  percent,
  progressByChapter,
  className,
}: {
  done: number
  total: number
  percent: number
  progressByChapter: Map<string, ChapterProgress>
  className?: string
}) {
  const complete = done === total

  return (
    <div className={cn('space-y-3', className)}>
      <p className="u-kicker text-muted-foreground">
        {complete ? 'The book is complete' : 'Your journey'}
      </p>
      {complete ? (
        <p className="u-display text-card-foreground text-2xl leading-tight">
          You’re ready for Singapore.
        </p>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="u-display u-numeral text-card-foreground text-3xl leading-none">
            {done}
          </span>
          <span className="u-display u-numeral text-muted-foreground text-xl leading-none">
            / {total}
          </span>
          <span className="u-kicker text-muted-foreground ml-auto">{percent}% ready</span>
        </div>
      )}
      <PageEdges progressByChapter={progressByChapter} className="h-5" />
    </div>
  )
}
