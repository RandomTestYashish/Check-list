import { ArrowRight } from 'lucide-react'
import { TRIP, chapters } from '@/data/checklist'
import type { Book } from '@/hooks/useBook'
import { PageEdges } from '@/components/book/progress-marks'
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
        'fixed inset-0 z-30 flex items-stretch bg-desk p-3 transition-all duration-[420ms] ease-page sm:p-6',
        opening ? 'pointer-events-none scale-[0.985] opacity-0' : 'opacity-100',
      )}
    >
      <div className="u-grain relative flex w-full flex-col overflow-hidden rounded-[4px] border border-rule bg-paper px-7 py-9 shadow-page sm:px-12 sm:py-12 md:mx-auto md:max-w-2xl">
        <div className="flex items-start justify-between">
          <span className="u-kicker text-ink-faint">{TRIP.kicker}</span>
          <span className="text-lg leading-none" aria-hidden>
            {TRIP.flag}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 className="u-display text-[clamp(2.75rem,13vw,5rem)] leading-[0.95] tracking-[0.005em] uppercase text-ink">
            {TRIP.destination}
          </h1>
          <div className="mt-6 mb-4 h-px w-16 bg-accent" />
          <p className="u-kicker text-ink-muted">{TRIP.when}</p>
          <p className="u-kicker u-numeral mt-3 text-ink-faint">
            {chapters.length} chapters · {book.totalItems} things
          </p>
        </div>

        <div className="space-y-6">
          {started && (
            <div className="space-y-2">
              <div className="u-kicker u-numeral flex items-baseline justify-between text-ink-faint">
                <span>
                  {book.totalDone} / {book.totalItems}
                </span>
                <span>{book.totalPercent}% ready</span>
              </div>
              <PageEdges progressByChapter={book.progressByChapter} className="h-4" />
            </div>
          )}

          <button
            type="button"
            onClick={onOpen}
            className="group flex w-full items-center justify-between gap-4 border-t border-rule pt-5 text-left"
          >
            <span className="min-w-0">
              <span className="u-kicker block text-ink-faint">
                {started ? 'Continue' : 'Open the book'}
              </span>
              <span className="u-display mt-1 block truncate text-[1.375rem] leading-tight text-ink">
                {started ? `${resume.number} — ${resume.title}` : 'Start at the beginning'}
              </span>
            </span>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-rule-strong text-ink transition-colors group-hover:border-accent group-hover:text-accent">
              <ArrowRight className="size-4" />
            </span>
          </button>

          <p className="u-kicker text-ink-faint">{TRIP.footer}</p>
        </div>
      </div>
    </div>
  )
}
