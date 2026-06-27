═══════════════════════════════════════════════════════════════════
OG LADKA — LINK-IN-BIO SITE · SOURCE & DOCUMENTATION
═══════════════════════════════════════════════════════════════════
Owner: Hemansu Singh (OG Ladka) — Motorcycle Content Creator
Live at: https://onehemansu-dotcom.github.io
Hosted on: GitHub Pages (repo: onehemansu-dotcom.github.io)

───────────────────────────────────────────────────────────────────
WHAT THIS IS
───────────────────────────────────────────────────────────────────
A mobile-first link-in-bio website. Auto-switching dark/light theme,
colourful bento tiles, Plus Jakarta Sans font. The site is split
into clean separate files for easier maintenance and faster loads.

Images are compressed WebP format — 90% smaller than the original
PNGs/JPGs with no visible quality difference on mobile screens.

───────────────────────────────────────────────────────────────────
FOLDER STRUCTURE (everything in this list goes to GitHub root)
───────────────────────────────────────────────────────────────────
index.html        → Main HTML file (panels + structure)
style.css         → All styles (colours, layout, animations, themes)
app.js            → All JavaScript (scroll engine, form, tracking)
images/           → All 23 product/profile/video images (WebP)

⚠️  ALL FOUR ITEMS must be in the repo root together.
    The site breaks if any one is missing.

───────────────────────────────────────────────────────────────────
HOW THE SITE WORKS (multi-panel, no page reloads)
───────────────────────────────────────────────────────────────────
index.html contains 3 panels that swap via JavaScript:

  #home-panel    → main page
  #shop-panel    → all products (opens when "All" under Shop is tapped)
  #access-panel  → guide signup form + success message

Panel switching = JS functions showShop(), showAccess(), showHome()
defined in app.js and exposed on window so inline onclick works.
Body gets a class (show-shop / show-access) that CSS uses to
show/hide panels.

───────────────────────────────────────────────────────────────────
TIME-BASED THEME (NEW)
───────────────────────────────────────────────────────────────────
The site automatically switches between light and dark themes
based on the visitor's local time:

  6:00 AM – 5:59 PM  →  LIGHT theme  (warm cream background)
  6:00 PM – 5:59 AM  →  DARK theme   (charcoal background, default)

How it works:
  • app.js function initTimeTheme() checks new Date().getHours()
  • Sets data-theme="light" or data-theme="dark" on <body>
  • Re-checks every 60 seconds in case the page is open at switchover
  • style.css has full body[data-theme="light"] overrides

What flips in light mode:
  • Background → warm cream (#f7f3ea)
  • ALL cards → dark frosted glass on cream bg (same vibe, inverted)
  • Shop spotlight → warm golden sunlight (instead of cool white)
  • Guide card landing glow → yellow halo (instead of white)
  • "FREE GUIDE" eyebrow → dark (instead of yellow)

To test light mode without waiting for 6am:
  In app.js initTimeTheme(), change `var isDay = hour >= 6 && hour < 18`
  to `var isDay = true` temporarily.

───────────────────────────────────────────────────────────────────
CURRENT FEATURES
───────────────────────────────────────────────────────────────────
• Header: avatar photo, "OG Ladka", "Motorcycle Content Creator"
• Top social icons: Instagram, YouTube, WhatsApp
• Guide bar "Free beginner's guide for every rider" → opens signup form
  → Travels with scroll, smoothly transitions white → yellow as it
    descends (dark mode only; stays dark frosted in light mode)
  → Soft pulsing glow when it lands at the bottom
• Shop preview: 3 tiles (Matte Care, Tank Cover, Motul Chain)
  → "All" opens full shop page with 12 products
• What I Ride: RE Classic 350, Bajaj Pulsar 150, TVS Jupiter
• Best Videos: 3 Instagram Reels with play badges
• Signup form: Name, Email (Gmail-only), Bike model
  → button disabled until all fields valid
  → shows success message on submit
• GA4 analytics + Microsoft Clarity (heatmaps + session recordings)
• Link click tracker — fires GA4 event per product/social/nav click
  → 12 products individually labelled (Product: Motul Chain Kit, etc.)
  → 3 socials labelled (Social: Instagram, Social: YouTube, Social: WhatsApp)
  → 3 nav clicks labelled (Nav: Home, Nav: Shop, Nav: Free Guide)
• Link icons (chain symbol) hidden from all cards globally

───────────────────────────────────────────────────────────────────
SHOP PANEL EFFECTS (important — don't break when editing)
───────────────────────────────────────────────────────────────────
The Shop panel has 3 layered visual effects:

1. SPOTLIGHT FROM ABOVE
   • Soft radial gradient from top of viewport
   • Dark mode: warm white (cool spotlight feel)
   • Light mode: golden sunlight (warm sun feel)
   • Defined under "#shop-panel::before" + "::after" (lamp source)
   • Expands as user scrolls — controlled by --cone-w CSS variable
   • JS function initShopSpotlight() in app.js updates the variable

2. FROSTED GLASS TILES
   • Each .tile inside #shop-panel has backdrop-filter blur
   • Picks up the spotlight light passing behind it
   • Subtle yellow border that brightens on hover
   • Dark mode: tiles are dark on dark
   • Light mode: tiles are still dark frosted (sit as dark windows
     on the cream page)

3. PER-TILE CORNER GRADIENT
   • Each tile keeps a hint of its product colour (yellow/coral/etc.)
   • Bottom-right corner glow at ~18% opacity (dark mode only)
   • Hidden in light mode for uniform dark cards

───────────────────────────────────────────────────────────────────
HOW TO UPDATE THE LIVE SITE
───────────────────────────────────────────────────────────────────
1. Edit the relevant file:
   - Content/structure changes  → index.html
   - Visual/colour changes      → style.css
   - Behaviour/logic changes    → app.js
   - Swap an image              → replace the file in images/

2. Go to your GitHub repo → Add file → Upload files → drag in
   the changed file(s). Commit. Live in ~1–2 minutes.

3. Test in incognito (regular refresh keeps old CSS in cache).

To roll back: GitHub keeps every version in commit history.

KEY DESIGN RULES:
• Plus Jakarta Sans font throughout
• Yellow (#f3cf3e) is the primary accent in both themes
• Colour variables live in style.css under :root
  (--yellow, --coral, --green, --blue, --white, --accent)
• Light mode overrides live under body[data-theme="light"] in CSS

───────────────────────────────────────────────────────────────────
STILL TO DO
───────────────────────────────────────────────────────────────────
1. EMAIL AUTOMATION — form validates and shows "guide on its way"
   but no email sends yet. To activate:
     a. Host the guide content somewhere to get a public URL
     b. Set up Google Apps Script (logs to Sheet + emails the guide)
     c. Paste the Script URL into app.js where SUBMIT_URL is defined
        (search for "SUBMIT_URL" in app.js)

2. SHOP LINKS — several products use https://link.amazon/... URLs.
   Verify they open correctly and replace with proper amzn.to
   affiliate links if needed.

───────────────────────────────────────────────────────────────────
ANALYTICS SETUP (already live)
───────────────────────────────────────────────────────────────────
GA4 custom dimensions configured:
  • Click Category (event_category)
  • Click Label    (event_label)
  • Link URL       (link_url)

Every link click fires a link_click event with all three.
View per-product breakdown in GA4 → Explorations → Free Form with
"Click Label" as a row and "Event Count" as a value.

Microsoft Clarity is connected for session recordings and heatmaps
(no extra setup needed — Clarity script already in index.html).

───────────────────────────────────────────────────────────────────
IF STARTING A NEW AI CHAT
───────────────────────────────────────────────────────────────────
Upload index.html + style.css + app.js and say:
"This is my OG Ladka link-in-bio site. It has 3 panels (home, shop,
guide form) that swap via JS. CSS is in style.css, JS in app.js,
images in the images/ folder. The site auto-switches between dark
(6pm–6am) and light (6am–6pm) themes. The Shop panel has a
spotlight effect from the top that expands on scroll. Help me edit
it."
═══════════════════════════════════════════════════════════════════
