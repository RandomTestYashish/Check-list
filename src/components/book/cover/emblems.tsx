/**
 * The foil marks on the cover. Drawn rather than imported so they take the
 * gold from the theme and stay crisp at any size.
 */

/** The four-point star that sits above the emblem. */
export function CompassStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M24 0 C 25.6 13.2 28.4 17.4 41.6 19.4 C 28.4 21.4 25.6 25.6 24 38.8 C 22.4 25.6 19.6 21.4 6.4 19.4 C 19.6 17.4 22.4 13.2 24 0 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Globe, aircraft and laurel: an official-looking travel insignia. */
export function TravelEmblem({ className }: { className?: string }) {
  // Each branch is a quadratic sweeping from the foot of the wreath up and
  // outward, with the leaves set along it and turned to follow the tangent.
  const branch = (side: 1 | -1) => {
    const p0 = { x: 100 + side * 9, y: 130 }
    const p1 = { x: 100 + side * 58, y: 118 }
    const p2 = { x: 100 + side * 57, y: 40 }
    const at = (t: number) => ({
      x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
      y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
    })
    const tangent = (t: number) => {
      const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
      const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
      return (Math.atan2(dy, dx) * 180) / Math.PI
    }

    return (
      <g key={side}>
        <path
          d={`M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        {[0.12, 0.27, 0.42, 0.56, 0.69, 0.81, 0.92].map((t, i) => {
          const c = at(t)
          const a = tangent(t)
          // leaves sit on the outside of the branch, angled off the tangent
          const off = 7.5
          const nx = c.x + Math.cos(((a - 90 * side) * Math.PI) / 180) * off
          const ny = c.y + Math.sin(((a - 90 * side) * Math.PI) / 180) * off
          return (
            <ellipse
              key={i}
              cx={nx}
              cy={ny}
              rx="9.5"
              ry="3.9"
              transform={`rotate(${a - 28 * side} ${nx} ${ny})`}
              fill="currentColor"
            />
          )
        })}
      </g>
    )
  }

  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      {/* globe */}
      <g fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="100" cy="76" r="40" />
        <ellipse cx="100" cy="76" rx="15" ry="40" strokeWidth="1.3" />
        <ellipse cx="100" cy="76" rx="29.5" ry="40" strokeWidth="1.1" />
        <path d="M60 76 H140" strokeWidth="1.5" />
        <path d="M65.5 56 H134.5 M65.5 96 H134.5" strokeWidth="1.1" />
        <path d="M77 40.5 H123 M77 111.5 H123" strokeWidth="1" />
      </g>

      {/* aircraft, nose up, crossing the globe */}
      <path
        d="M100 42 C 103.6 42 106 48 106.4 56.2 L 131 72.5 L 131 80 L 106.6 73.6 L 106.2 92 L 114.2 97.8 L 114.2 102.6 L 100 99.2 L 85.8 102.6 L 85.8 97.8 L 93.8 92 L 93.4 73.6 L 69 80 L 69 72.5 L 93.6 56.2 C 94 48 96.4 42 100 42 Z"
        fill="currentColor"
      />

      {branch(-1)}
      {branch(1)}
    </svg>
  )
}

/**
 * Crescent and five stars, standing in for the Merlion of the reference. A
 * lion's head at this size came out as a blob, a daisy, a smiling sun and a
 * pufferfish across six attempts: geometry written by hand does not get there
 * without a real illustration. Swap a Merlion asset in here when one exists.
 */
export function CrescentStars({ className }: { className?: string }) {
  const star = (cx: number, cy: number, r: number) => {
    const points: string[] = []
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? r : r * 0.4
      const a = (-90 + i * 36) * (Math.PI / 180)
      points.push(`${(cx + Math.cos(a) * radius).toFixed(2)} ${(cy + Math.sin(a) * radius).toFixed(2)}`)
    }
    return `M${points.join(' L')} Z`
  }
  const ring = [0, 1, 2, 3, 4].map((i) => {
    const a = (-90 + i * 72) * (Math.PI / 180)
    return { x: 78 + Math.cos(a) * 14.5, y: 31 + Math.sin(a) * 14.5 }
  })

  return (
    <svg viewBox="0 0 110 62" className={className} aria-hidden>
      <path
        d="M30 6 A 25 25 0 1 0 30 56 A 25 25 0 1 0 30 6 Z M38 11 A 21 21 0 1 1 38 51 A 21 21 0 1 1 38 11 Z"
        fillRule="evenodd"
        fill="currentColor"
      />
      {ring.map((p, i) => (
        <path key={i} d={star(p.x, p.y, 7)} fill="currentColor" />
      ))}
    </svg>
  )
}
