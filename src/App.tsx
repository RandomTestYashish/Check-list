import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useBook } from '@/hooks/useBook'
import { useIsSpread, useReducedMotion } from '@/hooks/useMediaQuery'
import { Cover } from '@/components/book/Cover'
import { PageDeck } from '@/components/book/PageDeck'
import { BookNav } from '@/components/book/BookNav'
import { Contents } from '@/components/book/Contents'
import { Spread } from '@/components/book/Spread'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

/** How long the cover takes to lift away. */
const OPEN_MS = 420

export default function App() {
  const book = useBook()
  const isSpread = useIsSpread()
  const reducedMotion = useReducedMotion()

  const [coverVisible, setCoverVisible] = useState(true)
  const [opening, setOpening] = useState(false)
  const [contentsOpen, setContentsOpen] = useState(false)

  const openBook = useCallback(() => {
    if (reducedMotion) {
      setCoverVisible(false)
      return
    }
    setOpening(true)
    window.setTimeout(() => setCoverVisible(false), OPEN_MS)
  }, [reducedMotion])

  // Arrow keys turn pages, as long as the reader isn't typing or in a dialog.
  useEffect(() => {
    if (coverVisible || contentsOpen) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'ArrowRight') book.next()
      else if (event.key === 'ArrowLeft') book.prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [book, coverVisible, contentsOpen])

  const openContents = useCallback(() => setContentsOpen(true), [])
  const selectChapter = useCallback(
    (index: number) => {
      book.goTo(index)
      setContentsOpen(false)
    },
    [book],
  )

  return (
    <div className="flex h-full flex-col bg-desk">
      <div
        className={cn(
          'flex h-full min-h-0 flex-col',
          !coverVisible && !reducedMotion && 'book-open',
        )}
        aria-hidden={coverVisible}
        inert={coverVisible}
      >
        {isSpread ? (
          <Spread book={book} onOpenContents={openContents} />
        ) : (
          <>
            <PageDeck book={book} />
            <BookNav book={book} onOpenContents={openContents} />
          </>
        )}
      </div>

      {coverVisible && <Cover book={book} opening={opening} onOpen={openBook} />}

      <Dialog open={contentsOpen} onOpenChange={setContentsOpen}>
        <DialogContent className="book-sheet">
          <DialogTitle className="sr-only">Contents</DialogTitle>
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-rule-strong sm:hidden" />
          <Contents book={book} onSelect={selectChapter} className="max-h-[80svh]" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
