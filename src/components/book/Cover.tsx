import { ArrowRightIcon } from 'lucide-react'
import { TRIP, chapters } from '@/data/checklist'
import type { Book } from '@/hooks/useBook'
import { PageEdges } from '@/components/book/progress-marks'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

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
      <div className="bg-card text-card-foreground flex w-full flex-col rounded-xl border px-7 py-9 shadow-sm sm:px-12 sm:py-12 md:mx-auto md:max-w-2xl">
        <div className="flex items-start justify-between">
          <span className="u-kicker text-muted-foreground">{TRIP.kicker}</span>
          <span className="text-lg leading-none" aria-hidden>
            {TRIP.flag}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 className="u-display text-[clamp(2.75rem,13vw,5rem)] leading-[0.95] tracking-[0.005em] uppercase">
            {TRIP.destination}
          </h1>
          <div className="bg-brand mt-6 mb-4 h-0.5 w-16" />
          <p className="u-kicker text-muted-foreground">{TRIP.when}</p>
          <p className="u-kicker u-numeral text-muted-foreground/70 mt-3">
            {chapters.length} chapters · {book.totalItems} things
          </p>
        </div>

        <div className="space-y-6">
          {started && (
            <div className="space-y-2">
              <div className="u-kicker u-numeral text-muted-foreground flex items-baseline justify-between">
                <span>
                  {book.totalDone} / {book.totalItems}
                </span>
                <span>{book.totalPercent}% ready</span>
              </div>
              <PageEdges progressByChapter={book.progressByChapter} className="h-4" />
            </div>
          )}

          <div className="space-y-5">
            <Separator />
            <button
              type="button"
              onClick={onOpen}
              className="group focus-visible:ring-ring/50 flex w-full items-center justify-between gap-4 rounded-lg text-left outline-none focus-visible:ring-[3px]"
            >
              <span className="min-w-0">
                <span className="u-kicker text-muted-foreground block">
                  {started ? 'Continue' : 'Open the book'}
                </span>
                <span className="u-display mt-1 block truncate text-xl leading-tight">
                  {started ? `${resume.number} — ${resume.title}` : 'Start at the beginning'}
                </span>
              </span>
              <span className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5">
                <ArrowRightIcon className="size-4" />
              </span>
            </button>
          </div>

          <p className="u-kicker text-muted-foreground/70">{TRIP.footer}</p>
        </div>
      </div>
    </div>
  )
}
