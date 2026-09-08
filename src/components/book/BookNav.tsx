import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import { Button } from '@/components/ui/button'
import { PageEdges } from '@/components/book/progress-marks'

export function BookNav({ book, onOpenContents }: { book: Book; onOpenContents: () => void }) {
  const last = book.chapters.length - 1
  return (
    <nav className="bg-background/85 supports-[backdrop-filter]:bg-background/70 shrink-0 border-t backdrop-blur">
      <PageEdges
        progressByChapter={book.progressByChapter}
        current={book.chapter}
        className="h-1.5 gap-px px-4 pt-2"
      />
      <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={book.prev}
          disabled={book.chapter === 0}
          aria-label="Previous chapter"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onOpenContents}
          aria-label="Open contents"
          className="text-muted-foreground gap-2"
        >
          <ListIcon className="size-3.5" />
          <span className="u-kicker u-numeral text-foreground">
            {book.chapters[book.chapter].number} / {String(book.chapters.length).padStart(2, '0')}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon-lg"
          onClick={book.next}
          disabled={book.chapter === last}
          aria-label="Next chapter"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>
    </nav>
  )
}
