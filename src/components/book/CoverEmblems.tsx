/**
 * The two foil marks on the cover, drawn rather than imported so they take the
 * gold from the theme and stay crisp at any size.
 */

/** Winged globe inside a laurel, with a star above it. */
export function GlobeEmblem({ className }: { className?: string }) {
  const leaf = (side: 1 | -1) => {
    const x = 100 + side * 46
    return (
      <g transform={`translate(${x} 86) scale(${side} 1)`}>
        <path
          d="M0 34 C -12 20 -14 2 -6 -16 C -2 -25 4 -32 10 -36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = i / 6
          const px = -12 * t * t - 2 * t
          const py = 30 - t * 62
          return (
            <ellipse
              key={i}
              cx={px}
              cy={py}
              rx="9"
              ry="4.1"
              transform={`rotate(${-38 - i * 6} ${px} ${py})`}
              fill="currentColor"
            />
          )
        })}
      </g>
    )
  }

  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label="Travel emblem">
      {/* star */}
      <path
        d="M100 6 L103.4 18.6 L116 22 L103.4 25.4 L100 38 L96.6 25.4 L84 22 L96.6 18.6 Z"
        fill="currentColor"
      />

      {/* globe */}
      <circle cx="100" cy="86" r="37" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="100" cy="86" rx="15" ry="37" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="100" cy="86" rx="29" ry="37" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <line x1="63" y1="86" x2="137" y2="86" stroke="currentColor" strokeWidth="1.5" />
      <path d="M68 68 H132 M68 104 H132" stroke="currentColor" strokeWidth="1.2" fill="none" />

      {/* aircraft, nose up, over the globe */}
      <path
        d="M100 58 C 103 58 105 63 105.4 70 L 126 84 L 126 90 L 105.6 84.6 L 105.2 100 L 112 105 L 112 109 L 100 106 L 88 109 L 88 105 L 94.8 100 L 94.4 84.6 L 74 90 L 74 84 L 94.6 70 C 95 63 97 58 100 58 Z"
        fill="currentColor"
      />

      {leaf(-1)}
      {leaf(1)}
    </svg>
  )
}

/**
 * Crescent and five stars. This stands in for the Merlion of the reference:
 * a lion's head reads as a flower or a sun at this size unless it is properly
 * illustrated, and geometry generated in code will not get there. Swap in a
 * real Merlion asset here if one turns up.
 */
export function CrescentStarsEmblem({ className }: { className?: string }) {
  const star = (cx: number, cy: number, r: number, rotation: number) => {
    const points: string[] = []
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? r : r * 0.4
      const a = (-90 + rotation + i * 36) * (Math.PI / 180)
      points.push(`${(cx + Math.cos(a) * radius).toFixed(2)} ${(cy + Math.sin(a) * radius).toFixed(2)}`)
    }
    return `M${points.join(' L')} Z`
  }

  const ring = [0, 1, 2, 3, 4].map((i) => {
    const a = (-90 + i * 72) * (Math.PI / 180)
    return { x: 80 + Math.cos(a) * 15, y: 31 + Math.sin(a) * 15 }
  })

  return (
    <svg viewBox="0 0 112 62" className={className} role="img" aria-label="Crescent and five stars">
      {/* crescent: one disc with another punched out of it */}
      <path
        d="M30 6 A 25 25 0 1 0 30 56 A 25 25 0 1 0 30 6 Z M38 11 A 21 21 0 1 1 38 51 A 21 21 0 1 1 38 11 Z"
        fillRule="evenodd"
        fill="currentColor"
      />
      {ring.map((p, i) => (
        <path key={i} d={star(p.x, p.y, 7.4, 0)} fill="currentColor" />
      ))}
    </svg>
  )
}
