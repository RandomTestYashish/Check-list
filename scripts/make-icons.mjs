// Renders the app icons from one piece of artwork: a bound book, seen face-on.
// Run with `npm run icons` after changing the artwork.
import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const INK = '#0c0a09'
const PAPER = '#ffffff'
const ACCENT = '#9d2a2c'
const RULE = '#d6d3d1'

/** @param {{size:number, pageW:number, pageH:number, bleed?:boolean}} opts */
function artwork({ size, pageW, pageH }) {
  const x = (size - pageW) / 2
  const y = (size - pageH) / 2
  const spine = Math.round(pageW * 0.11)
  const unit = pageH / 12
  const lines = [3, 4.6, 6.2, 7.8].map((n, index) => {
    const ly = y + unit * n
    const lx = x + spine + pageW * 0.16
    const lw = pageW * (index === 3 ? 0.42 : 0.6)
    return `<rect x="${lx}" y="${ly}" width="${lw}" height="${Math.max(
      2,
      size * 0.014,
    )}" rx="${size * 0.007}" fill="${index === 0 ? ACCENT : RULE}"/>
    <rect x="${x + spine + pageW * 0.07}" y="${ly - size * 0.008}" width="${size * 0.032}" height="${
      size * 0.032
    }" rx="${size * 0.006}" fill="${index === 0 ? ACCENT : 'none'}" stroke="${RULE}" stroke-width="${
      size * 0.008
    }"/>`
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  <rect x="${x}" y="${y}" width="${pageW}" height="${pageH}" rx="${size * 0.02}" fill="${PAPER}"/>
  <rect x="${x}" y="${y}" width="${spine}" height="${pageH}" fill="${ACCENT}"/>
  ${lines.join('\n  ')}
</svg>`
}

const standard = (size) => artwork({ size, pageW: size * 0.62, pageH: size * 0.78 })
const maskable = (size) => artwork({ size, pageW: size * 0.46, pageH: size * 0.6 })

mkdirSync('public', { recursive: true })
writeFileSync('public/favicon.svg', standard(512))

const jobs = [
  ['public/icon-192.png', standard(192), 192],
  ['public/icon-512.png', standard(512), 512],
  ['public/icon-maskable-512.png', maskable(512), 512],
  ['public/apple-touch-icon.png', standard(180), 180],
]

for (const [file, svg, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(file)
  console.log('wrote', file)
}
