# Singapore — Travel Checklist

A packing checklist for Singapore, September 2026, built as a digital travel book
rather than a to-do app. Ten chapters, 108 things, swipe to turn the page.

On a phone the whole screen is the page: a cover you open, chapters you swipe
between, page numbers, running heads and a table of contents. On a desktop it
becomes a two-page spread with the contents as front matter. Ticks are saved in
the browser, and the app installs to the home screen and works offline.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/Check-list/
npm run build      # static site in dist/
npm run preview    # serve the built site
npm run typecheck
npm run icons      # regenerate the app icons from scripts/make-icons.mjs
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on
every push to `main`. Enable it once under **Settings → Pages → Source → GitHub
Actions**; the site then lives at `https://<user>.github.io/Check-list/`.

The base path is `/Check-list/` to match the repository name. Hosting at a domain
root instead:

```bash
VITE_BASE=/ npm run build
```

Once it is online, open it on the phone and use **Add to Home Screen** — it
launches full screen and keeps working with no signal.

## Editing the checklist

Everything the book says lives in [`src/data/checklist.ts`](src/data/checklist.ts):
chapters, items, the note under an item, the aside in the margin and the verb each
chapter counts in (`packed`, `planned`, `done`).

Item `id`s are the storage keys. Adding, reordering and rewording items is safe;
**changing an existing `id` clears that item's tick** for anyone who already has
the book open.

## The design skill

`.claude/skills/taste-skill/SKILL.md` is [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill)
(MIT, vendored verbatim at commit `ccbc156`) — the anti-slop frontend skill this
project's visual direction is meant to follow. It is committed here so it travels
with the repository rather than living in one machine's Claude Code config; it
loads in a new session on this repo and is invoked as `design-taste-frontend`.

Updating it means re-copying `skills/taste-skill/SKILL.md` from upstream. The
repository ships twelve further skills — brutalist, minimalist, soft, redesign,
stitch, image-to-code and others — which are not vendored here; the whole set can
be added instead with `/plugin marketplace add leonxlnx/taste-skill`.

## How it is put together

| | |
|---|---|
| `src/data/checklist.ts` | All content — chapters, items, notes, asides |
| `src/hooks/useBook.ts` | Ticks, current chapter, theme, progress; persisted to `localStorage` |
| `src/components/book/PageDeck.tsx` | The mobile book: swipe, page turn, page bodies, nav |
| `src/components/book/hints.tsx` | The one-time first-run cue and the swipe hint |
| `src/components/book/Spread.tsx` | The desktop spread and contents sidebar |
| `src/components/book/Contents.tsx` | Table of contents, journey progress, theme, reset |
| `src/components/book/Cover.tsx` | The cover and its opening transition |
| `src/index.css` | shadcn tokens, typography and the book motion |
| `.claude/skills/taste-skill/` | The design skill this project's visual direction follows |
| `src/components/ui/` | shadcn components (button, checkbox, sheet, separator, progress) |

React 19 + TypeScript + Vite + Tailwind CSS v4.

### Design system

The visual language is [shadcn/ui](https://ui.shadcn.com), new-york style, and
the project is set up as a real shadcn project -
`components.json` is present, so `npx shadcn@latest add <component>` drops
components straight into `src/components/ui`. Everything is drawn with the
standard tokens (`background`, `card`, `muted-foreground`, `border`, `ring`,
`--radius`) in both light and dark; `src/index.css` holds them.

Those tokens are tuned for a soft, light surface: a cool neutral grey ground, an
off-white sheet floating on it, and elevation doing the work borders used to.
There is no pure white and no pure black anywhere, and shadows are tinted to the
ground hue rather than black. One shape rule runs through everything: sheets and
pages 28px, inner panels 16px, chips and controls full pill, checkbox 8px.

One token is added on top: `--brand`, the red that carries chapter numbers,
chapter progress and the fore-edge marks. It is the only colour in the book that
isn't a neutral.

The editorial half is typographic rather than chromatic. Geist sets the interface
at shadcn's sizes and weights; Fraunces sets display type only: the cover, the
chapter numbers, the chapter titles and the journey count. Both are vendored as
latin subsets in `src/assets/fonts` (SIL Open Font License), so the book has no
runtime dependency on a font CDN.

`.claude/skills/taste-skill` names Fraunces as a banned default display serif.
It is kept here deliberately, on the skill's own publication exception and on a
standing instruction not to replace the project's typography, and its footprint is
display-only. Swapping it is a one-line change to `--font-display`.

### The page turn

Pages are hinged at the spine and rotate in 3D — a fold, not a slide. One custom
property drives it: `--turn` on the stage, `0` at rest, `+1` fully turned forward,
`-1` fully turned back. It is written straight to the DOM during a drag, so
following a finger never re-renders React and never delays a tick.

The leaf swings to just past edge-on rather than a full 180°. Past 90° a page
hinged at the spine is off-screen, and half a turn spent looking at nothing reads
as a stall rather than as paper, so it fades out over the last of the sweep
instead.

The gesture locks to an axis after 10px and vertical wins ties, so scrolling the
list never costs a page; a turn completes on 26% of the page width or a flick that
covers at least 8%. Tapping Back or Next runs the same turn, and a turn already
in flight is committed on the spot when a new one starts, so rapid swipes chain
instead of fighting. Jumping from the contents skips the turn and fades in.

Checking an item is always immediate: no animation gates it, taps land while a
page is still settling, and `prefers-reduced-motion` swaps every transition for an
instant page change.
