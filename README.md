# ☕ Coffe Stor — Artisan Coffee Co.

A fully self-contained (offline) coffee-shop website, built as a single-page app with a warm coffee-themed design.

## Features
- **Dynamic SPA** — hash-based routing across pages: Home, Menu, Our Story, Locations, Order (no page reloads).
- **Bilingual** — English / Arabic with full **RTL** support and a language toggle (preference saved).
- **Light & Dark mode** — coffee (espresso) dark theme and a cream/latte light theme, toggleable (preference saved).
- **Live menu & cart** — 27 items across Hot Coffee, Cold Drinks, and Pastries & Bakery, each with its own photo; add-to-order with a running total.
- **Animated details** — aurora background, glassmorphism cards, an SVG espresso machine with rising steam.
- **100% standalone / offline** — Tailwind, fonts (woff2), and all images are bundled locally under `assets/`. No external CDN or internet required.

## Project structure
```
organic-hearth.html   # the entire app (HTML + Tailwind config + CSS + JS)
server.js             # tiny static file server (optional, for local preview)
build.js              # script that downloaded all assets locally
assets/
  tailwind.js         # local Tailwind runtime
  fonts.css + fonts/  # local web fonts (Manrope, Work Sans, EB Garamond, Space Grotesk, Cairo, Material Symbols)
  img/                # all images (hero, menu banner, story, 27 product photos)
```

## Run it
Just open `organic-hearth.html` directly in a browser — it works offline.

Or serve it locally:
```bash
node server.js
# then open http://localhost:8000/organic-hearth.html
```

## Credits
- UI originally generated in **Google Stitch**, then restyled, made dynamic, bilingual, themed, and bundled offline.
- Photos from Unsplash (downloaded locally under `assets/img/`).
