import { useCallback, useEffect, useRef } from 'react'
import type { Book } from '@/hooks/useBook'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import {
  ChapterHeading,
  ChapterItems,
  MarginNote,
  PageFolio,
  RunningHead,
} from '@/components/book/page-parts'
import { JourneyProgress } from '@/components/book/progress-marks'
import { Separator } from '@/components/ui/separator'
import { clamp } from '@/lib/utils'

/** Fraction of the page width a swipe must cover to turn it. */
const TURN_RATIO = 0.22
/** ...or this speed, in px/ms, for a quick flick. */
const FLICK_VELOCITY = 0.45
/** A flick still has to cover this much, so a jittery tap can't turn a page. */
const FLICK_MIN_RATIO = 0.08
/** Movement before we decide the gesture is a page turn rather than a scroll. */
const LOCK_SLOP = 10

export function PageDeck({ book }: { book: Book }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const gesture = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    axis: null as null | 'x' | 'y',
    swiped: false,
  })

  const setPos = useCallback((pos: number) => {
    trackRef.current?.style.setProperty('--pos', String(pos))
  }, [])

  // The track follows `chapter` whenever a gesture isn't driving it.
  useEffect(() => {
    setPos(book.chapter)
  }, [book.chapter, setPos])

  const onPointerDown = (event: React.PointerEvent) => {
    if (!event.isPrimary || event.pointerType === 'mouse') return
    gesture.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      axis: null,
      swiped: false,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const g = gesture.current
    if (event.pointerId !== g.id) return

    const dx = event.clientX - g.startX
    const dy = event.clientY - g.startY

    if (g.axis === null) {
      if (Math.abs(dx) > LOCK_SLOP && Math.abs(dx) > Math.abs(dy) * 1.3) {
        g.axis = 'x'
        g.swiped = true
        trackRef.current?.setAttribute('data-dragging', 'true')
        // Capture so the rest of the gesture can't land on a checkbox.
        ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
      } else if (Math.abs(dy) > LOCK_SLOP) {
        g.axis = 'y'
      }
      return
    }
    if (g.axis !== 'x') return

    const dt = event.timeStamp - g.lastT
    if (dt > 0) g.velocity = (event.clientX - g.lastX) / dt
    g.lastX = event.clientX
    g.lastT = event.timeStamp

    const width = trackRef.current?.clientWidth || 1
    const atEdge =
      (dx > 0 && book.chapter === 0) || (dx < 0 && book.chapter === book.chapters.length - 1)
    setPos(book.chapter - (atEdge ? dx * 0.28 : dx) / width)
  }

  const endGesture = (event: React.PointerEvent) => {
    const g = gesture.current
    if (event.pointerId !== g.id) return
    const wasDragging = g.axis === 'x'
    g.id = -1
    g.axis = null
    if (!wasDragging) return

    trackRef.current?.removeAttribute('data-dragging')

    const dx = event.clientX - g.startX
    const width = trackRef.current?.clientWidth || 1
    const turned =
      Math.abs(dx) > width * TURN_RATIO ||
      (Math.abs(g.velocity) > FLICK_VELOCITY && Math.abs(dx) > width * FLICK_MIN_RATIO)

    const target = clamp(
      turned ? book.chapter - Math.sign(dx) : book.chapter,
      0,
      book.chapters.length - 1,
    )

    if (target === book.chapter) setPos(book.chapter)
    else book.goTo(target)

    // Swallow the click that a finished swipe would otherwise deliver.
    window.setTimeout(() => {
      gesture.current.swiped = false
    }, 0)
  }

  return (
    <div
      className="relative min-h-0 flex-1 overflow-hidden"
      style={{ perspective: '1600px' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onClickCapture={(event) => {
        if (gesture.current.swiped) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
    >
      <div
        ref={trackRef}
        data-reduced={reducedMotion ? 'true' : undefined}
        className="book-track flex h-full touch-pan-y"
      >
        {book.chapters.map((chapter, index) => {
          const progress = book.progressByChapter.get(chapter.id)!
          const isCurrent = index === book.chapter
          return (
            <section
              key={chapter.id}
              style={{ '--i': index } as React.CSSProperties}
              inert={!isCurrent}
              aria-hidden={!isCurrent}
              aria-label={`Chapter ${chapter.number}, ${chapter.title}`}
              className="book-page bg-card text-card-foreground relative h-full w-full shrink-0 overflow-y-auto overscroll-contain"
            >
              <div className="book-page-inner mx-auto flex min-h-full max-w-[34rem] flex-col px-6 pt-5 pb-8">
                <RunningHead right={`${chapter.number} / 10`} className="pb-6" />
                <ChapterHeading chapter={chapter} progress={progress} />
                <Separator className="mt-7 mb-3" />
                <ChapterItems chapter={chapter} isChecked={book.isChecked} toggle={book.toggle} />

                <MarginNote className="mt-8">{chapter.tip}</MarginNote>

                {index === book.chapters.length - 1 && (
                  <JourneyProgress
                    done={book.totalDone}
                    total={book.totalItems}
                    percent={book.totalPercent}
                    progressByChapter={book.progressByChapter}
                    className="mt-10 border-t pt-6"
                  />
                )}

                <PageFolio
                  index={index}
                  hint={index < book.chapters.length - 1 ? 'Swipe →' : 'End of the book'}
                  className="mt-auto pt-8"
                />
              </div>
            </section>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Chapter {book.chapters[book.chapter].number} of {book.chapters.length},{' '}
        {book.chapters[book.chapter].title}
      </p>
    </div>
  )
}
