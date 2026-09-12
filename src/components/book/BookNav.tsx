import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import { Button } from '@/components/ui/button'
import { PageEdges } from '@/components/book/progress-marks'

export function BookNav({
  book,
  onPrevious,
  onNext,
  onOpenContents,
}: {
  book: Book
  onPrevious: () => void
  onNext: () => void
  onOpenContents: () => void
}) {
  const chapter = book.chapters[book.chapter]
  const total = String(book.chapters.length).padStart(2, '0')

  return (
    <nav className="shrink-0 px-3 pt-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
      <PageEdges
        progressByChapter={book.progressByChapter}
        current={book.chapter}
        className="mx-auto mb-2.5 h-1.5 max-w-[22rem] gap-1"
      />
      <div className="bg-card mx-auto flex max-w-[30rem] items-center gap-1 rounded-full p-1.5 shadow-[var(--shadow-soft)]">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={book.chapter === 0}
          aria-label="Previous page"
          className="h-11 flex-1 justify-start gap-1 px-3 has-[>svg]:px-3"
        >
          <ChevronLeftIcon className="size-4" />
          <span className="text-[0.8125rem]">Back</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onOpenContents}
          aria-label={`Contents, page ${book.chapter + 1} of ${book.chapters.length}`}
          className="bg-muted h-11 shrink-0 gap-2 px-4 hover:bg-muted/80"
        >
          <span aria-hidden>📚</span>
          <span className="u-kicker u-numeral text-foreground">
            {chapter.number} / {total}
          </span>
          <span className="u-kicker text-muted-foreground hidden min-[360px]:inline">Contents</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onNext}
          disabled={book.chapter === book.chapters.length - 1}
          aria-label="Next page"
          className="h-11 flex-1 justify-end gap-1 px-3 has-[>svg]:px-3"
        >
          <span className="text-[0.8125rem]">Next</span>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </nav>
  )
}
