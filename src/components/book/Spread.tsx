import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import { Button } from '@/components/ui/button'
import { Contents } from '@/components/book/Contents'
import {
  ChapterHeading,
  ChapterItems,
  MarginNote,
  RunningHead,
} from '@/components/book/page-parts'
import { Separator } from '@/components/ui/separator'
import { PageEdges } from '@/components/book/progress-marks'
import { TRIP, chapters } from '@/data/checklist'

/** Desktop reading view: a bound spread with the contents as front matter. */
export function Spread({ book, onOpenContents }: { book: Book; onOpenContents: () => void }) {
  const chapter = book.chapters[book.chapter]
  const progress = book.progressByChapter.get(chapter.id)!
  const previous = useRef(book.chapter)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  useEffect(() => {
    setDirection(book.chapter >= previous.current ? 'forward' : 'back')
    previous.current = book.chapter
  }, [book.chapter])

  const last = book.chapters.length - 1

  return (
    <div className="flex h-full min-h-0">
      <aside className="bg-background hidden w-[19rem] shrink-0 border-r xl:flex xl:flex-col">
        <Contents book={book} onSelect={book.goTo} />
      </aside>

      <main className="book-desk flex min-h-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-6 px-8 py-5">
          <span className="u-kicker text-muted-foreground">
            {TRIP.destination} · {TRIP.when}
          </span>
          <div className="flex items-center gap-4">
            <PageEdges
              progressByChapter={book.progressByChapter}
              current={book.chapter}
              onSelect={book.goTo}
              className="h-3 w-40"
            />
            <span className="u-kicker u-numeral text-muted-foreground">
              {book.totalDone} / {book.totalItems}
            </span>
            <Button size="sm" variant="outline" onClick={onOpenContents} className="xl:hidden">
              <List className="size-3.5" />
              Contents
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 items-stretch gap-2 px-3 pb-8 2xl:gap-5 2xl:px-6">
          <SpreadArrow
            label="Previous chapter"
            onClick={book.prev}
            disabled={book.chapter === 0}
            icon={<ChevronLeft className="size-5" />}
          />

          <article className="bg-card text-card-foreground relative mx-auto flex min-h-0 w-full max-w-[72rem] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)]">
            {/* the binding */}
            <div
              className="pointer-events-none absolute inset-y-0 left-[38%] z-10 w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--border)_48%,transparent)]"
              aria-hidden
            />

            <div
              key={`${chapter.id}-left`}
              data-direction={direction}
              className="book-fade flex w-[38%] shrink-0 flex-col justify-between px-10 py-10 2xl:px-14"
            >
              <div className="space-y-10">
                <ChapterHeading
                  chapter={chapter}
                  progress={progress}
                  stampedOn={book.stamps[chapter.id]}
                />
                <MarginNote>{chapter.tip}</MarginNote>
              </div>
              <div className="space-y-4">
                <Separator className="w-12" />
                <p className="u-kicker text-muted-foreground">
                  {book.chapter < last
                    ? `Next: ${chapters[book.chapter + 1].number} ${chapters[book.chapter + 1].title}`
                    : 'End of the book'}
                </p>
                <p className="u-kicker u-numeral text-muted-foreground/70">
                  {chapter.number} / {String(book.chapters.length).padStart(2, '0')}
                </p>
              </div>
            </div>

            <div
              key={`${chapter.id}-right`}
              data-direction={direction}
              className="book-fade min-h-0 flex-1 overflow-y-auto px-10 py-10 2xl:px-14"
            >
              <RunningHead right={chapter.title} className="pb-6" />
              <ChapterItems
                chapter={chapter}
                isChecked={book.isChecked}
                toggle={book.toggle}
                columns
              />
            </div>
          </article>

          <SpreadArrow
            label="Next chapter"
            onClick={book.next}
            disabled={book.chapter === last}
            icon={<ChevronRight className="size-5" />}
          />
        </div>
      </main>
    </div>
  )
}

function SpreadArrow({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  icon: ReactNode
}) {
  return (
    <div className="flex shrink-0 items-center">
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className="text-muted-foreground"
      >
        {icon}
      </Button>
    </div>
  )
}
