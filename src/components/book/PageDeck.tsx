import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import type { Book } from '@/hooks/useBook'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import {
  ChapterHeading,
  ChapterItems,
  MarginNote,
  RunningHead,
} from '@/components/book/page-parts'
import { JourneyProgress } from '@/components/book/progress-marks'
import { BookNav } from '@/components/book/BookNav'
import { FirstRunCue, SwipeHint } from '@/components/book/hints'
import { clamp } from '@/lib/utils'

/** Length of a turn. Long enough to read as paper, short enough to stay out of the way. */
const TURN_MS = 480
/** Fraction of the page width a drag must cover to complete the turn. */
const TURN_RATIO = 0.26
/** ...or this speed, in px/ms, for a quick flick. */
const FLICK_VELOCITY = 0.4
/** A flick still has to cover this much, so a jittery tap can't turn a page. */
const FLICK_MIN_RATIO = 0.08
/** Movement before we decide the gesture is a page turn rather than a scroll. */
const LOCK_SLOP = 10
/** How far the leaf gives when there is no page that way. */
const EDGE_GIVE = 0.06

type LeafState = 'previous' | 'current' | 'next' | 'hidden'

export function PageDeck({ book, onOpenContents }: { book: Book; onOpenContents: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  /** The chapter the DOM is currently showing — readable inside handlers that
   *  run before React has re-rendered. */
  const chapterRef = useRef(book.chapter)
  const pending = useRef<{ timer: number; target: number } | null>(null)
  /** Distinguishes a page that was turned from one jumped to via the contents. */
  const arrivedByTurn = useRef(false)
  const mounted = useRef(false)
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

  const setTurn = useCallback((value: number) => {
    stageRef.current?.style.setProperty('--turn', String(value))
  }, [])

  // Whenever the chapter changes the leaf has to go back to flat — with the
  // transition off, so the reset itself is never animated. The forced reflow
  // makes that deterministic rather than dependent on frame timing.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    chapterRef.current = book.chapter
    stage.dataset.instant = 'true'
    stage.style.setProperty('--turn', '0')
    void stage.offsetHeight
    delete stage.dataset.instant

    // Jumping from the contents skips the turn, so the new page fades in
    // instead of appearing between frames.
    const jumped = mounted.current && !arrivedByTurn.current
    arrivedByTurn.current = false
    mounted.current = true
    if (!jumped) return
    stage.dataset.jump = 'true'
    const id = window.setTimeout(() => delete stage.dataset.jump, 240)
    return () => window.clearTimeout(id)
  }, [book.chapter])

  const commit = useCallback(
    (target: number) => {
      if (pending.current) {
        window.clearTimeout(pending.current.timer)
        pending.current = null
      }
      chapterRef.current = target
      arrivedByTurn.current = true
      // Sync so the leaves are re-labelled and reset before anything else runs;
      // a second swipe can then start straight away.
      flushSync(() => {
        book.goTo(target)
        book.markFlipped()
      })
    },
    [book],
  )

  /** Give at the edge of the book: there is no page, so the leaf just flexes. */
  const nudgeEdge = useCallback(
    (direction: 1 | -1) => {
      if (reducedMotion) return
      setTurn(direction * EDGE_GIVE)
      window.setTimeout(() => setTurn(0), 180)
    },
    [reducedMotion, setTurn],
  )

  /** Turn one page, from wherever the leaf currently is. */
  const turn = useCallback(
    (direction: 1 | -1) => {
      const stage = stageRef.current
      if (!stage) return
      if (pending.current) commit(pending.current.target)

      const target = chapterRef.current + direction
      if (target < 0 || target >= book.chapters.length) {
        nudgeEdge(direction)
        return
      }

      stage.removeAttribute('data-dragging')
      if (reducedMotion) {
        commit(target)
        return
      }
      setTurn(direction)
      pending.current = { timer: window.setTimeout(() => commit(target), TURN_MS), target }
    },
    [book.chapters.length, commit, nudgeEdge, reducedMotion, setTurn],
  )

  useEffect(() => {
    return () => {
      if (pending.current) window.clearTimeout(pending.current.timer)
    }
  }, [])

  // Arrow keys turn pages here too, for anyone on a narrow window with a keyboard.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'ArrowRight') turn(1)
      else if (event.key === 'ArrowLeft') turn(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [turn])

  const onPointerDown = (event: React.PointerEvent) => {
    if (!event.isPrimary || event.pointerType === 'mouse') return
    // A turn already running is finished on the spot, so rapid swipes chain
    // instead of fighting each other.
    if (pending.current) commit(pending.current.target)
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
      // Vertical wins ties: scrolling the list must never cost a page.
      if (Math.abs(dx) > LOCK_SLOP && Math.abs(dx) > Math.abs(dy) * 1.3) {
        g.axis = 'x'
        g.swiped = true
        stageRef.current?.setAttribute('data-dragging', 'true')
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

    const width = stageRef.current?.clientWidth || 1
    // Dragging left turns forward, which is a positive angle.
    const raw = -dx / width
    const noPageThatWay =
      (raw > 0 && chapterRef.current === book.chapters.length - 1) ||
      (raw < 0 && chapterRef.current === 0)
    setTurn(noPageThatWay ? clamp(raw * 0.25, -EDGE_GIVE, EDGE_GIVE) : clamp(raw, -1, 1))
  }

  const endGesture = (event: React.PointerEvent) => {
    const g = gesture.current
    if (event.pointerId !== g.id) return
    const wasDragging = g.axis === 'x'
    g.id = -1
    g.axis = null
    if (!wasDragging) return

    const stage = stageRef.current
    stage?.removeAttribute('data-dragging')

    const dx = event.clientX - g.startX
    const width = stage?.clientWidth || 1
    const completes =
      Math.abs(dx) > width * TURN_RATIO ||
      (Math.abs(g.velocity) > FLICK_VELOCITY && Math.abs(dx) > width * FLICK_MIN_RATIO)

    if (completes) turn(dx < 0 ? 1 : -1)
    else setTurn(0)

    // Swallow the click a finished swipe would otherwise deliver.
    window.setTimeout(() => {
      gesture.current.swiped = false
    }, 0)
  }

  const last = book.chapters.length - 1

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2 pt-2">
      <div
        ref={stageRef}
        className="book-stage min-h-0 flex-1"
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
        {book.chapter < last && (
          <>
            <div className="page-stack page-stack-2" aria-hidden />
            <div className="page-stack page-stack-1" aria-hidden />
          </>
        )}

        {book.chapters.map((chapter, index) => {
          const state: LeafState =
            index === book.chapter
              ? 'current'
              : index === book.chapter - 1
                ? 'previous'
                : index === book.chapter + 1
                  ? 'next'
                  : 'hidden'
          const isCurrent = state === 'current'
          const progress = book.progressByChapter.get(chapter.id)!

          return (
            <article
              key={chapter.id}
              data-state={state}
              className="leaf"
              inert={!isCurrent}
              aria-hidden={!isCurrent}
              aria-label={`Page ${chapter.number} of 10, ${chapter.title}`}
            >
              <div className="leaf-face">
                <div className="book-page-inner mx-auto flex min-h-full max-w-[34rem] flex-col px-4 pt-4 pb-7 sm:px-6">
                  <RunningHead className="pb-3" />
                  <ChapterHeading
                    chapter={chapter}
                    progress={progress}
                    stampedOn={book.stamps[chapter.id]}
                  />
                  <div className="mt-3" />
                  <ChapterItems
                    chapter={chapter}
                    isChecked={book.isChecked}
                    toggle={book.toggle}
                  />

                  <MarginNote className="mt-6">{chapter.tip}</MarginNote>

                  {index === last && (
                    <JourneyProgress
                      done={book.totalDone}
                      total={book.totalItems}
                      percent={book.totalPercent}
                      progressByChapter={book.progressByChapter}
                      className="mt-8 border-t pt-5"
                      stamp
                    />
                  )}

                </div>
                <div className="leaf-shade" aria-hidden />
              </div>
              <div className="leaf-gloss" aria-hidden />
            </article>
          )
        })}

        <SwipeHint show={!book.hasFlipped && book.seenIntro} atStart={book.chapter === 0} />
        <FirstRunCue show={!book.seenIntro} onDismiss={book.dismissIntro} />
      </div>

      <BookNav
        book={book}
        onPrevious={() => turn(-1)}
        onNext={() => turn(1)}
        onOpenContents={onOpenContents}
      />

      <p className="sr-only" aria-live="polite">
        Page {book.chapters[book.chapter].number} of {book.chapters.length},{' '}
        {book.chapters[book.chapter].title}
      </p>
    </div>
  )
}
