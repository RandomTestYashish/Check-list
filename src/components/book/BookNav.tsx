import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import type { Book } from '@/hooks/useBook'
import { Button } from '@/components/ui/button'
import { PageEdges } from '@/components/book/progress-marks'
import { cn } from '@/lib/utils'

export function BookNav({ book, onOpenContents }: { book: Book; onOpenContents: () => void }) {
  const last = book.chapters.length - 1
  return (
    <nav className="shrink-0 border-t border-rule bg-paper-edge/80 backdrop-blur-sm">
      <PageEdges
        progressByChapter={book.progressByChapter}
        current={book.chapter}
        className="h-1.5 gap-px px-4 pt-2"
      />
      <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button
          size="icon"
          onClick={book.prev}
          disabled={book.chapter === 0}
          aria-label="Previous chapter"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <button
          type="button"
          onClick={onOpenContents}
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-full px-4 text-ink-muted transition-colors hover:text-ink',
          )}
          aria-label="Open contents"
        >
          <List className="size-3.5" />
          <span className="u-kicker u-numeral text-ink">
            {book.chapters[book.chapter].number} / {String(book.chapters.length).padStart(2, '0')}
          </span>
        </button>

        <Button
          size="icon"
          onClick={book.next}
          disabled={book.chapter === last}
          aria-label="Next chapter"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </nav>
  )
}
