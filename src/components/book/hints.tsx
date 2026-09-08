import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Shown once, the first time the book is ever opened. Three lines, one button,
 * and then it is gone for good.
 */
export function FirstRunCue({ show, onDismiss }: { show: boolean; onDismiss: () => void }) {
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
      <div className="bg-popover text-popover-foreground pointer-events-auto w-full max-w-[26rem] rounded-xl border p-4 shadow-lg">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2.5">
            <span aria-hidden>📖</span>
            <span>Your Singapore travel book</span>
          </li>
          <li className="text-muted-foreground flex gap-2.5">
            <span aria-hidden>👆</span>
            <span>Swipe left and right to flip pages</span>
          </li>
          <li className="text-muted-foreground flex gap-2.5">
            <span aria-hidden>☑️</span>
            <span>Tap items as you get ready</span>
          </li>
        </ul>
        <Button size="sm" className="mt-3 w-full" onClick={onDismiss}>
          Got it
        </Button>
      </div>
    </div>
  )
}

/**
 * The nudge that retires itself: it stops appearing the moment a page has
 * actually been turned.
 */
export function SwipeHint({ show, atStart }: { show: boolean; atStart: boolean }) {
  const [visible, setVisible] = useState(false)

  // Let the page settle before nudging, so it reads as a hint and not as chrome.
  useEffect(() => {
    if (!show) return setVisible(false)
    const id = window.setTimeout(() => setVisible(true), 700)
    return () => window.clearTimeout(id)
  }, [show])

  if (!show) return null

  return (
    <div
      className={cn(
        'book-hint pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden
    >
      <span className="bg-popover/95 text-muted-foreground flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-2.5 text-xs shadow-sm backdrop-blur">
        <span className="hint-drift" aria-hidden>
          👆
        </span>
        {atStart ? 'Swipe left to turn the page' : 'Swipe to turn the page'}
      </span>
    </div>
  )
}
