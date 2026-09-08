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
              'bg-foreground/10 relative h-full flex-1 overflow-hidden rounded-full',
              onSelect && 'cursor-pointer',
            )}
          >
            <span
              className="bg-brand/85 absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-500 ease-page"
              style={{ height: `${p}%` }}
            />
            {isCurrent && <span className="bg-foreground absolute inset-x-0 -bottom-1 h-0.5 rounded-full" />}
          </Tag>
        )
      })}
    </div>
  )
}

/** The line that reacts to how far along the packing is. */
function stageNote(done: number, total: number) {
  if (done === 0) return { emoji: '👋', text: 'Let’s get ready for Singapore.' }
  if (done / total < 0.5) return { emoji: '🎒', text: 'Nice, you’re making progress.' }
  return { emoji: '✈️', text: 'Almost ready to fly.' }
}

/** The running total, or the finish once every item is ticked. */
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
  if (done === total) {
    return (
      <div className={cn('book-finale space-y-3', className)}>
        <p className="u-kicker text-brand flex items-center gap-2">
          <span aria-hidden>🎉</span> Ready to fly
        </p>
        <p className="u-display u-numeral text-card-foreground text-3xl leading-none">
          {done} / {total} <span className="text-muted-foreground text-xl">complete</span>
        </p>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <span aria-hidden>🇸🇬</span> Singapore is waiting.
        </p>
        <PageEdges progressByChapter={progressByChapter} className="h-5" />
      </div>
    )
  }

  const note = stageNote(done, total)

  return (
    <div className={cn('space-y-3', className)}>
      <p className="u-kicker text-muted-foreground">Your journey</p>
      <div className="flex items-baseline gap-2">
        <span className="u-display u-numeral text-card-foreground text-3xl leading-none">
          {done}
        </span>
        <span className="u-display u-numeral text-muted-foreground text-xl leading-none">
          / {total}
        </span>
        <span className="u-kicker text-muted-foreground ml-auto">{percent}% ready</span>
      </div>
      <PageEdges progressByChapter={progressByChapter} className="h-5" />
      <p className="text-muted-foreground flex items-center gap-2 text-[0.8125rem]">
        <span aria-hidden>{note.emoji}</span> {note.text}
      </p>
    </div>
  )
}
