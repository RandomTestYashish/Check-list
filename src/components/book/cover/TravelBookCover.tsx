import { useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { CompassStar, CrescentStars, TravelEmblem } from '@/components/book/cover/emblems'
import { cn } from '@/lib/utils'

/** The hairline foil rule that separates the blocks of the cover. */
function Divider() {
  return <span className="tb-divider" aria-hidden />
}

/**
 * The bound cover: a navy board on an off-white page. Everything inside is
 * sized in container units, so the whole composition scales as one object and
 * holds its proportions from a phone to a wide desktop.
 */
export function TravelBookCover({
  title,
  tagline,
  footnote,
  onOpen,
  label,
  className,
}: {
  /** Three lines, set one per line as on the reference. */
  title: [string, string, string]
  tagline: string
  footnote?: string
  onOpen: () => void
  label: string
  className?: string
}) {
  const shellRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  // A tilt of a couple of degrees, written straight to the element so pointer
  // movement never re-renders anything.
  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch') return
      const el = shellRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (event.clientX - r.left) / r.width - 0.5
      const y = (event.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--tilt-x', `${(-y * 2.4).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * 2.4).toFixed(2)}deg`)
    },
    [reducedMotion],
  )

  const resetTilt = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }, [])

  return (
    <div className={cn('tb-page', className)}>
      <button
        type="button"
        onClick={onOpen}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
        aria-label={label}
        className="tb-button"
      >
        <span ref={shellRef} className="tb-shell">
          <span className="tb-texture" aria-hidden />
          <span className="tb-grain" aria-hidden />
          <span className="tb-spine" aria-hidden />

          <span className="tb-content">
            <CompassStar className="tb-star" />
            <TravelEmblem className="tb-emblem" />

            <Divider />

            <span className="tb-title">
              {title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>

            <Divider />

            <span className="tb-tagline">{tagline}</span>

            <CrescentStars className="tb-mark" />
          </span>
        </span>
      </button>

      {footnote && <p className="tb-footnote">{footnote}</p>}
    </div>
  )
}
