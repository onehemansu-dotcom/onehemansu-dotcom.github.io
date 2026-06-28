# OG Ladka — Link-in-Bio Site

**Owner:** Hemansu Singh (OG Ladka) — Motorcycle Content Creator
**Live at:** https://onehemansu-dotcom.github.io
**Hosted on:** GitHub Pages (repo: `onehemansu-dotcom.github.io`)

---

## What this is

A mobile-first link-in-bio website with an **auto-switching dark/light theme** and a clean uniform product grid. Cards use dark frosted glass + Plus Jakarta Sans typography. Split into separate files for easier maintenance and faster loads.

Images are compressed WebP — **90% smaller** than the original PNGs/JPGs with no visible quality difference on mobile.

---

## Folder structure

```
index.html        Main HTML (3 panels + 12-product shop grid)
style.css         All styles (themes, animations, layouts)
app.js            All JavaScript (theme switcher, form, tracking, reveal)
images/           23 product/profile/video images (WebP)
```

⚠️ **All four items must be in the repo root.** The site breaks if any one is missing.

---

## How the site works

`index.html` contains **3 panels** that swap via JavaScript:

| Panel | What it shows |
| --- | --- |
| `#home-panel` | Main page |
| `#shop-panel` | All 12 products in a uniform 4-column grid |
| `#access-panel` | Guide signup form + success message |

Panel switching = `showShop()`, `showAccess()`, `showHome()` functions in `app.js`. The `<body>` gets a class (`show-shop` / `show-access`) that CSS uses to show/hide.

---

## Time-based theme (auto switcher)

The site automatically switches themes based on the **visitor's local time**:

| Time | Theme |
| --- | --- |
| 6:00 AM – 5:59 PM | **Light** (warm cream `#f7f3ea` background) |
| 6:00 PM – 5:59 AM | **Dark** (charcoal `#0a0a0b`, default) |

### How it works

- `app.js` `initTimeTheme()` checks `new Date().getHours()`
- Sets `data-theme="light"` or `data-theme="dark"` on `<body>`
- Re-checks every 60 seconds in case the page is open at switchover
- `style.css` has full `body[data-theme="light"]` overrides

### What flips in light mode

- Background → warm cream
- All cards → dark frosted glass on cream (inverted vibe, same dark cards)
- Nav buttons (back, "All" pill, "Back to home") → stay dark, arrows go white
- "FREE GUIDE" eyebrow → dark instead of yellow

### To test light mode without waiting for 6 AM

In `app.js` `initTimeTheme()`, change:

```js
var isDay = hour >= 6 && hour < 18;
```

to:

```js
var isDay = true;
```

Revert before pushing.

---

## Shop panel (4-column product grid)

### Layout

- **12 products in a single `.bento` container** → CSS forces `grid-template-columns: repeat(4, 1fr)` so it renders as 4 per row × 3 rows
- ⚠️ If you add/remove products, keep them in the **same single container**. Splitting into multiple `.bento` containers will break the 4-per-row layout.
- Each product card: square cream image area + compact title + small subtitle
- Outer card radius: 10px / image inner radius: 7px (proportional nesting)

### Entrance animation (dark mode only)

When user taps "All" to open the shop:

1. **0.0s** — Shop opens with soft dark mood + faint warm hint at top
2. **0.12s** — Warm cream bloom begins growing from top (1s smooth ease-out)
3. **0.17s+** — Tiles cascade in one by one: fade up + un-blur + scale (60ms stagger between each)
4. **1.4s** — All settled: subtle warm wash at top, tiles fully visible

Light mode skips the animation (natural sunlight feel).

### Tagline

Injected by `app.js` `injectShopTagline()` below the "Shop" heading:
> *I only recommend products I genuinely believe are worth buying.*

Italic, muted. Done in JS so `index.html` doesn't need editing for copy tweaks.

---

## Current features

- **Header:** avatar, "OG Ladka", "Motorcycle Content Creator"
- **Top social icons:** Instagram, YouTube, WhatsApp
- **Guide bar** "Free beginner's guide for every rider"
  - Travels with scroll, transitions white → yellow as it descends (dark mode)
  - Pulses warm halo when it lands at bottom
- **Shop preview (home page):** 3 tiles (Matte Care, Tank Cover, Motul Chain)
  - "All" opens the full 12-product shop panel
- **What I Ride:** RE Classic 350, Bajaj Pulsar 150, TVS Jupiter
- **Best Videos:** 3 Instagram Reels with play badges
- **Signup form:** Name, Email (Gmail-only), Bike model
  - Button disabled until all fields valid
  - Shows success message on submit
- **GA4 analytics + Microsoft Clarity** (heatmaps + session recordings)
- **Link click tracker** — fires GA4 event per product/social/nav click
- **Link icons (chain symbol)** hidden from all cards globally

---

## How to update the live site

1. Edit the relevant file:
   - Content/structure changes → `index.html`
   - Visual/colour changes → `style.css`
   - Behaviour/logic changes → `app.js`
   - Swap an image → replace the file in `images/`

2. GitHub repo → **Add file → Upload files** → drag the changed file(s) in. Commit. Live in 1–2 minutes.

3. **Test in incognito** — regular refresh keeps old CSS in cache.

To roll back: GitHub keeps every version in commit history.

### Key design rules

- Plus Jakarta Sans font throughout
- Yellow `#f3cf3e` is the primary accent in both themes
- Colour variables in `style.css` `:root` — `--yellow`, `--coral`, `--green`, `--blue`, `--white`, `--accent`
- Light mode overrides under `body[data-theme="light"]`
- Shop panel must stay as ONE `.bento` container

---

## Click tracking labels (GA4)

Every link click fires a `link_click` event with custom dimensions `event_category` and `event_label`.

**12 products** — each individually labelled:

```
Product: Motul Chain Kit
Product: Tank Cover
Product: Aerol Silicone Spray
Product: RE Riding Jacket
Product: Matte Care Kit
Product: SMK Helmet
Product: Tyre Inflator
Product: Puncture Kit
Product: Tool Kit
Product: Riding Shoes
Product: Fuel Additive
Product: WD-40
```

**3 socials:**

```
Social: Instagram
Social: YouTube
Social: WhatsApp
```

**3 nav clicks:**

```
Nav: Home
Nav: Shop
Nav: Free Guide
```

View per-product breakdown in **GA4 → Explorations → Free Form** with `Click Label` as a row and `Event Count` as a value.

---

## Still to do

1. **Email automation** — form validates and shows "guide on its way" but no email sends yet. To activate:
   - Host the guide content somewhere to get a public URL
   - Set up a Google Apps Script (logs to Sheet + emails the guide)
   - Paste the Script URL into `app.js` where `SUBMIT_URL` is defined

2. **Shop links** — several products use `https://link.amazon/...` URLs. Verify they open correctly and replace with `amzn.to` affiliate links if needed.

---

## Starting a new AI chat?

Upload `index.html` + `style.css` + `app.js` and say:

> This is my OG Ladka link-in-bio site. It has 3 panels (home, shop, guide form) that swap via JS. The site auto-switches between dark (6pm–6am) and light (6am–6pm) themes. The shop panel has 12 products in a uniform 4-column grid (all in ONE `.bento` container — don't split it) with a cinematic cascade reveal in dark mode. CSS is in `style.css`, JS in `app.js`, images in `images/`. Help me edit it.
