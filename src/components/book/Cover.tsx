import { ArrowRightIcon } from 'lucide-react'
import { TRIP, chapters } from '@/data/checklist'
import type { Book } from '@/hooks/useBook'
import { CrescentStarsEmblem, GlobeEmblem } from '@/components/book/CoverEmblems'
import { cn } from '@/lib/utils'

/**
 * The bound cover: navy board, gold foil, a hinge down the spine. It keeps its
 * own colours rather than the theme's, the way a real cover does.
 */
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
    <div
      className={cn(
        'book-desk ease-page fixed inset-0 z-30 flex items-stretch p-3 transition-all duration-[420ms] sm:p-6',
        opening ? 'pointer-events-none scale-[0.985] opacity-0' : 'opacity-100',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={
          started ? `Continue the book at ${resume.number} ${resume.title}` : 'Open the book'
        }
        className="cover-board group relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-[14px] px-8 pt-[14%] pb-7 text-center outline-none md:mx-auto md:max-w-md"
      >
        <span className="cover-hinge" aria-hidden />
        <span className="cover-sheen" aria-hidden />

        <GlobeEmblem className="cover-foil w-[38%] max-w-[9rem]" />

        <span className="cover-rule mt-5" aria-hidden />

        <h1 className="cover-title mt-6 text-[clamp(1.5rem,7.6vw,2.25rem)] leading-[1.18]">
          Checklist
          <br />
          for {TRIP.destination}
          <br />
          Travel
        </h1>

        <span className="cover-rule mt-6" aria-hidden />

        <p className="cover-foil mt-5 text-[0.625rem] font-medium tracking-[0.34em] uppercase">
          Plan Prepare Explore
        </p>

        <CrescentStarsEmblem className="cover-foil mt-[13%] w-[4.25rem] opacity-90" />

        {/* The opening action, and where the reader left off. */}
        <span className="mt-auto flex w-full items-center justify-center gap-3 pt-8">
          <span className="cover-foil text-[0.625rem] tracking-[0.22em] uppercase opacity-80">
            {started ? `Continue · ${resume.number} ${resume.title}` : TRIP.footer}
          </span>
          <span className="cover-open grid size-8 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 group-active:scale-95">
            <ArrowRightIcon className="size-3.5" />
          </span>
        </span>

        {started && (
          <span className="cover-progress mt-4" aria-hidden>
            <span style={{ width: `${book.totalPercent}%` }} />
          </span>
        )}
      </button>
    </div>
  )
}
