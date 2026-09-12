import { TRIP } from '@/data/checklist'
import { cn } from '@/lib/utils'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/** "12 SEP '26", the way a border stamp dates itself. */
export function stampDate(iso: string | undefined) {
  const d = iso ? new Date(iso) : new Date()
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`
}

/**
 * The mark a finished chapter earns. It carries the chapter, the number and
 * the day it was finished, so it records something true rather than decorating.
 */
export function ChapterStamp({
  title,
  number,
  date,
  className,
}: {
  title: string
  number: string
  date: string
  className?: string
}) {
  const arc = `stamp-arc-${number}`
  return (
    <svg
      viewBox="0 0 210 128"
      role="img"
      aria-label={`${title} packed, ${date}`}
      className={cn('book-stamp text-brand w-[9.25rem] shrink-0', className)}
    >
      <defs>
        <path id={arc} d="M 34 74 A 72 46 0 0 1 176 74" fill="none" />
      </defs>

      <ellipse cx="105" cy="64" rx="88" ry="50" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <ellipse cx="105" cy="64" rx="81" ry="43" fill="none" stroke="currentColor" strokeWidth="0.9" />

      <text
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="1.6"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          {title.toUpperCase()}
        </textPath>
      </text>

      <text
        x="105"
        y="72"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {number}
      </text>

      <text
        x="105"
        y="94"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="500"
        letterSpacing="1.4"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        PACKED {date}
      </text>

      <line x1="46" y1="102" x2="164" y2="102" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 3" />
    </svg>
  )
}

/** The last mark in the book, once every item is ticked. */
export function JourneyStamp({ total, date }: { total: number; date: string }) {
  return (
    <div
      role="img"
      aria-label={`Ready to fly, ${total} of ${total} packed, ${date}`}
      className="book-stamp text-foreground w-full max-w-[17rem] -rotate-[2.5deg] border-2 border-dashed p-2.5"
    >
      <p className="u-kicker text-center text-[0.5625rem]">
        ✦ {TRIP.destination.toUpperCase()} · READY TO FLY ✦
      </p>
      <p className="u-numeral my-2 text-center text-[1.375rem] leading-none font-semibold">
        {total} / {total}
      </p>
      <div className="grid grid-cols-3 border-t-2 border-dashed pt-1.5 text-[0.5rem] leading-tight">
        <span className="u-kicker text-[0.5rem]">Trip</span>
        <span className="u-kicker border-x-2 border-dashed px-1 text-center text-[0.5rem]">Items</span>
        <span className="u-kicker pl-1 text-right text-[0.5rem]">Dated</span>
        <span className="u-numeral pt-0.5">SIN</span>
        <span className="u-numeral border-x-2 border-dashed px-1 pt-0.5 text-center">{total}</span>
        <span className="u-numeral pt-0.5 pl-1 text-right">{date}</span>
      </div>
    </div>
  )
}
