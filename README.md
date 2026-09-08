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

## How it is put together

| | |
|---|---|
| `src/data/checklist.ts` | All content — chapters, items, notes, asides |
| `src/hooks/useBook.ts` | Ticks, current chapter, theme, progress; persisted to `localStorage` |
| `src/components/book/PageDeck.tsx` | The mobile book: swipe, page turn, page bodies |
| `src/components/book/Spread.tsx` | The desktop spread and contents sidebar |
| `src/components/book/Contents.tsx` | Table of contents, journey progress, theme, reset |
| `src/components/book/Cover.tsx` | The cover and its opening transition |
| `src/index.css` | shadcn tokens, typography and the book motion |
| `src/components/ui/` | shadcn components (button, checkbox, sheet, separator, progress) |

React 19 + TypeScript + Vite + Tailwind CSS v4.

### Design system

The visual language is [shadcn/ui](https://ui.shadcn.com), new-york style on the
**stone** base colour, and the project is set up as a real shadcn project —
`components.json` is present, so `npx shadcn@latest add <component>` drops
components straight into `src/components/ui`. Everything is drawn with the
standard tokens (`background`, `card`, `muted-foreground`, `border`, `ring`,
`--radius`) in both light and dark; `src/index.css` holds them.

One token is added on top: `--brand`, the red that carries chapter numbers,
chapter progress and the fore-edge marks. It is the only colour in the book that
isn't stone.

The editorial half is typographic rather than chromatic. Geist sets the interface
at shadcn's sizes and weights; Fraunces sets display type only — the cover, the
chapter numbers, the chapter titles and the journey count. Both are vendored as
latin subsets in `src/assets/fonts` (SIL Open Font License), so the book has no
runtime dependency on a font CDN.

### The page turn

A swipe writes one custom property — `--pos` on the track — straight to the DOM,
so dragging a page never re-renders React and never blocks a tick. The gesture
locks to an axis after 10px, so a vertical scroll and a horizontal page turn never
fight each other, and the page follows the finger, with the text trailing slightly
behind the page edge the way paper lifts off a spine.

Checking an item is always immediate: no animation gates it, taps land while a
page is still settling, and `prefers-reduced-motion` swaps every transition for an
instant page change.
