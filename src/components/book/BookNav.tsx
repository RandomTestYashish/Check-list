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
    <nav className="bg-background/85 supports-[backdrop-filter]:bg-background/70 shrink-0 border-t backdrop-blur">
      <PageEdges
        progressByChapter={book.progressByChapter}
        current={book.chapter}
        className="h-1.5 gap-px px-4 pt-2"
      />
      <div className="flex items-center gap-1 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={book.chapter === 0}
          aria-label="Previous page"
          className="h-12 flex-1 justify-start gap-1 px-2 has-[>svg]:px-2"
        >
          <ChevronLeftIcon className="size-4" />
          <span className="text-[0.8125rem]">Back</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onOpenContents}
          aria-label={`Contents — page ${book.chapter + 1} of ${book.chapters.length}`}
          className="h-12 shrink-0 gap-2 px-3"
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
          className="h-12 flex-1 justify-end gap-1 px-2 has-[>svg]:px-2"
        >
          <span className="text-[0.8125rem]">Next</span>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </nav>
  )
}
