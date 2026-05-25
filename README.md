# Abide & Live Foundation — Website v4

Editorial luxury humanitarian website. Static HTML/CSS/JS — drop into GitHub Pages, Namecheap, or any static host.

## Structure
```
abide-and-live-v4/
├── index.html         single-page site
├── css/styles.css     design system (tokens, fluid spacing, motion)
├── js/main.js         loader, cursor, reveals, counters, parallax, menu
└── README.md
```

## What changed vs v3
- **Architecture** — split into 3 files; clean tokens; semantic landmarks (`<main>`, `<article>`, `<aside>`); JSON-LD; OG tags.
- **Performance** — rAF-throttled scroll+parallax; passive listeners; `IntersectionObserver` for reveals/counters/bars; `content-visibility:auto` on offscreen sections; deferred JS; fewer font weights.
- **Accessibility** — skip link; `:focus-visible`; ARIA on nav/menu/dialog/radiogroup; `prefers-reduced-motion` honored everywhere; 44px+ touch targets; labelled form inputs.
- **Mobile** — fluid `clamp()` spacing & type; cursor disabled on touch; new immersive slide-in mobile menu with staggered links; multi-tier breakpoints (1100 / 820 / 600 / 420).
- **Motion polish** — softer easings (`cubic-bezier(0.16,1,0.3,1)`); GPU `transform3d`; ease-out cubic counters; smoother hamburger morph.
- **Visual rhythm** — unified `--gutter` / `--section-y`; refined contrast on dark surfaces; tighter editorial spacing.

## Deploy

### GitHub Pages
1. Push the folder contents to your repo's root (or `/docs`).
2. Settings → Pages → branch `main` / root.
3. Site live at `https://<user>.github.io/<repo>/`.

### Namecheap custom domain
1. Add a `CNAME` file at repo root containing `www.abideandlive.org`.
2. In Namecheap Advanced DNS:
   - `CNAME` `www` → `<user>.github.io.`
   - `A` `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
3. Enable "Enforce HTTPS" in GitHub Pages once cert provisions.

No build step. No framework. Drop and go.
