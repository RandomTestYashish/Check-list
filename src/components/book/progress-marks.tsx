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
    <div className={cn('flex h-6 items-end gap-[3px]', className)} aria-hidden>
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
              'relative h-full flex-1 overflow-hidden rounded-[1px] bg-rule/55',
              onSelect && 'cursor-pointer',
            )}
          >
            <span
              className="absolute inset-x-0 bottom-0 bg-accent/70 transition-[height] duration-500 ease-page"
              style={{ height: `${p}%` }}
            />
            {isCurrent && <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-ink" />}
          </Tag>
        )
      })}
    </div>
  )
}

/** "62 / 86 — 72% ready", or the completion notice once the book is finished. */
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
      <div className="u-kicker text-ink-faint">{complete ? 'The book is complete' : 'Your journey'}</div>
      {complete ? (
        <p className="u-display text-[1.5rem] leading-tight text-ink">You’re ready for Singapore.</p>
      ) : (
        <div className="flex items-baseline gap-3">
          <span className="u-display u-numeral text-[2rem] leading-none text-ink">{done}</span>
          <span className="u-display u-numeral text-[1.25rem] leading-none text-ink-faint">/ {total}</span>
          <span className="u-kicker ml-auto text-ink-muted">{percent}% ready</span>
        </div>
      )}
      <PageEdges progressByChapter={progressByChapter} />
    </div>
  )
}
