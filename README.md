# OG Ladka — Link-in-Bio Site

**Owner:** Hemansu Singh (OG Ladka) — Motorcycle Content Creator
**Live at:** https://onehemansu-dotcom.github.io
**Hosted on:** GitHub Pages (repo: `onehemansu-dotcom.github.io`)

---

## What this is

A mobile-first link-in-bio website with an **auto-switching dark/light theme**, frosted-glass bento tiles, and Plus Jakarta Sans typography. The site is split into clean separate files for easier maintenance and faster loads.

Images are compressed WebP format — **90% smaller** than the original PNGs/JPGs with no visible quality difference on mobile screens.

---

## Folder structure

```
index.html        Main HTML file (panels + structure)
style.css         All styles (colours, layout, animations, themes)
app.js            All JavaScript (scroll engine, form, tracking)
images/           All 23 product/profile/video images (WebP)
```

⚠️ **All four items must be in the repo root together.** The site breaks if any one is missing.

---

## How the site works

`index.html` contains **3 panels** that swap via JavaScript:

| Panel | What it shows |
| --- | --- |
| `#home-panel` | Main page |
| `#shop-panel` | All products (opens when "All" under Shop is tapped) |
| `#access-panel` | Guide signup form + success message |

Panel switching = JS functions `showShop()`, `showAccess()`, `showHome()` defined in `app.js` and exposed on `window` so inline `onclick` works. The `<body>` gets a class (`show-shop` / `show-access`) that CSS uses to show/hide panels.

---

## Time-based theme (auto switcher)

The site automatically switches between light and dark themes based on the **visitor's local time**:

| Time | Theme |
| --- | --- |
| 6:00 AM – 5:59 PM | **Light** (warm cream background) |
| 6:00 PM – 5:59 AM | **Dark** (charcoal background, default) |

### How it works

- `app.js` function `initTimeTheme()` checks `new Date().getHours()`
- Sets `data-theme="light"` or `data-theme="dark"` on `<body>`
- Re-checks every 60 seconds in case the page is open at switchover
- `style.css` has full `body[data-theme="light"]` overrides

### What flips in light mode

- Background → warm cream (`#f7f3ea`)
- All cards → dark frosted glass on cream bg (same vibe, inverted)
- Shop spotlight → warm golden sunlight (instead of cool white)
- Guide card landing glow → yellow halo (instead of white)
- "FREE GUIDE" eyebrow → dark (instead of yellow)

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

## Current features

- **Header:** avatar photo, "OG Ladka", "Motorcycle Content Creator"
- **Top social icons:** Instagram, YouTube, WhatsApp
- **Guide bar** "Free beginner's guide for every rider" → opens signup form
  - Travels with scroll, smoothly transitions white → yellow as it descends (dark mode only; stays dark frosted in light mode)
  - Soft pulsing glow when it lands at the bottom
- **Shop preview:** 3 tiles (Matte Care, Tank Cover, Motul Chain)
  - "All" opens full shop page with 12 products
- **What I Ride:** RE Classic 350, Bajaj Pulsar 150, TVS Jupiter
- **Best Videos:** 3 Instagram Reels with play badges
- **Signup form:** Name, Email (Gmail-only), Bike model
  - Button disabled until all fields valid
  - Shows success message on submit
- **GA4 analytics + Microsoft Clarity** (heatmaps + session recordings)
- **Link click tracker** — fires GA4 event per product/social/nav click
- **Link icons (chain symbol)** hidden from all cards globally

---

## Shop panel effects

The Shop panel has **3 layered visual effects**. Don't break these when editing:

### 1. Spotlight from above

- Soft radial gradient from top of viewport
- Dark mode: warm white (cool spotlight feel)
- Light mode: golden sunlight (warm sun feel)
- Defined under `#shop-panel::before` + `#shop-panel::after` (lamp source)
- Expands as user scrolls — controlled by `--cone-w` CSS variable
- JS function `initShopSpotlight()` in `app.js` updates the variable

### 2. Frosted glass tiles

- Each `.tile` inside `#shop-panel` has `backdrop-filter: blur`
- Picks up the spotlight light passing behind it
- Subtle yellow border that brightens on hover
- Dark mode: dark on dark
- Light mode: dark frosted glass sitting on cream page

### 3. Per-tile corner gradient

- Each tile keeps a hint of its product colour (yellow/coral/etc.)
- Bottom-right corner glow at ~18% opacity (dark mode only)
- Hidden in light mode for uniform dark cards

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
- Colour variables live in `style.css` under `:root` (`--yellow`, `--coral`, `--green`, `--blue`, `--white`, `--accent`)
- Light mode overrides live under `body[data-theme="light"]`

---

## Click tracking labels (GA4)

Every link click fires a `link_click` event with two custom dimensions: `event_category` and `event_label`.

**12 products** — each one individually labelled:

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
   - Paste the Script URL into `app.js` where `SUBMIT_URL` is defined (search for "SUBMIT_URL")

2. **Shop links** — several products use `https://link.amazon/...` URLs. Verify they open correctly and replace with proper `amzn.to` affiliate links if needed.

---

## Starting a new AI chat?

Upload `index.html` + `style.css` + `app.js` and say:

> This is my OG Ladka link-in-bio site. It has 3 panels (home, shop, guide form) that swap via JS. CSS is in `style.css`, JS in `app.js`, images in the `images/` folder. The site auto-switches between dark (6pm–6am) and light (6am–6pm) themes. The Shop panel has a spotlight effect from the top that expands on scroll. Help me edit it.
