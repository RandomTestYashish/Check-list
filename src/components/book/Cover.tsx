import { TRIP, chapters } from '@/data/checklist'
import type { Book } from '@/hooks/useBook'
import { TravelBookCover } from '@/components/book/cover/TravelBookCover'
import { cn } from '@/lib/utils'

/** The cover screen: the bound board, plus where the reader left off. */
export function Cover({
  book,
  opening,
  onOpen,
}: {
  book: Book
  opening: boolean
  onOpen: () => void
}) {
  const started = book.totalDone > 0
  const resume = chapters[book.chapter]

  return (
    <TravelBookCover
      title={['Checklist', `For ${TRIP.destination}`, 'Travel']}
      tagline="Plan Prepare Explore"
      footnote={
        started
          ? `Continue · ${resume.number} ${resume.title} · ${book.totalPercent}% ready`
          : 'Tap to open'
      }
      opening={opening}
      onOpen={onOpen}
      label={started ? `Continue at ${resume.number} ${resume.title}` : 'Open the book'}
      className={cn(opening && 'pointer-events-none')}
    />
  )
}
