═══════════════════════════════════════════════════════════════════
OG LADKA — LINK-IN-BIO SITE · COMPLETE SOURCE & DOCUMENTATION
═══════════════════════════════════════════════════════════════════
Owner: Hemansu Singh (OG Ladka) — Motorcycle Content Creator
Live at: https://onehemansu-dotcom.github.io
Hosted on: GitHub Pages (repo: onehemansu-dotcom.github.io)

───────────────────────────────────────────────────────────────────
WHAT THIS IS
───────────────────────────────────────────────────────────────────
A mobile-first link-in-bio website. Dark theme, colourful bento
tiles, Plus Jakarta Sans font. The site is split into clean
separate files for easier maintenance and faster load times.

Images are compressed WebP format — 90% smaller than the original
PNGs/JPGs with no visible quality difference on mobile screens.

───────────────────────────────────────────────────────────────────
FOLDER STRUCTURE (upload ALL of this to GitHub)
───────────────────────────────────────────────────────────────────
index.html        → The main HTML file (panels + structure)
style.css         → All styles (colours, layout, animations)
app.js            → All JavaScript (scroll engine, form, tracking)
images/           → All 23 product/profile/video images (WebP)

⚠️  ALL FOUR ITEMS must be in the repo root together.
    The site will break if any one of them is missing.

───────────────────────────────────────────────────────────────────
HOW THE SITE WORKS (multi-panel, no page reloads)
───────────────────────────────────────────────────────────────────
index.html contains 3 panels that swap via JavaScript:

  #home-panel    → the main page
  #shop-panel    → all products (opens when "All" under Shop is tapped)
  #access-panel  → guide signup form + success message

Panel switching = JS functions showShop(), showAccess(), showHome()
defined in app.js and exposed on window so inline onclick works.
Body gets a class (show-shop / show-access) that CSS uses to show/hide.

───────────────────────────────────────────────────────────────────
CURRENT FEATURES
───────────────────────────────────────────────────────────────────
• Header: avatar photo, "OG Ladka", "Hemansu Singh · Motorcycle Content Creator"
• Top social icons: Instagram, YouTube, WhatsApp
• Guide bar "Free beginner's guide for every rider" → opens signup form
  → Travels with scroll, smoothly transitions white → yellow as it descends
  → Soft pulsing white glow when it lands at the bottom
• Shop preview: 3 tiles (Matte Care, Tank Cover, Motul Chain)
  → "All" opens full shop page with 10 products
• What I Ride: RE Classic 350, Bajaj Pulsar 150, TVS Jupiter
• Best Videos: 3 Instagram Reels with play badges
• Signup form: Name, Email (Gmail-only), Bike model
  → button disabled until all fields valid
  → shows success message on submit
• GA4 analytics + Microsoft Clarity (heatmaps + session recordings)
• Link click tracker — fires GA4 event per product/social/nav click
  → 12 products individually labelled, plus socials and nav

───────────────────────────────────────────────────────────────────
SHOP PANEL EFFECTS (important — don't break these when editing)
───────────────────────────────────────────────────────────────────
The Shop panel has 3 layered visual effects:

1. SPOTLIGHT FROM ABOVE
   • Warm white radial gradient from top of viewport
   • Defined in style.css under "#shop-panel::before"
   • Lamp source dot defined in "#shop-panel::after"
   • Expands as user scrolls — controlled by --cone-w CSS variable
   • JS function `initShopSpotlight()` in app.js updates the variable

2. FROSTED GLASS TILES
   • Each .tile inside #shop-panel has backdrop-filter blur
   • Picks up the spotlight light passing behind it
   • Subtle yellow border that brightens on hover

3. PER-TILE CORNER GRADIENT
   • Each tile keeps a hint of its product colour (yellow/coral/etc.)
   • Bottom-right corner glow at ~18% opacity
   • Subtle — doesn't compete with the spotlight

───────────────────────────────────────────────────────────────────
HOW TO UPDATE THE LIVE SITE
───────────────────────────────────────────────────────────────────
1. Edit the relevant file:
   - Content/structure changes → index.html
   - Visual/colour changes     → style.css
   - Behaviour/logic changes   → app.js
   - Swap an image             → replace the file in images/

2. Go to your GitHub repo → Add file → Upload files → drag in
   the changed file(s). Commit. Live in ~1–2 minutes.

To roll back: GitHub keeps every version in commit history.

KEY DESIGN RULES:
• Bright tiles (yellow/green/white/blue/coral) ALWAYS use dark text
  (only applies to home page Shop preview — full Shop page uses
  frosted glass treatment)
• Plus Jakarta Sans font throughout
• Colour variables live in style.css under :root
  (--yellow, --coral, --green, --blue, --white, --accent)

───────────────────────────────────────────────────────────────────
STILL TO DO
───────────────────────────────────────────────────────────────────
1. EMAIL AUTOMATION — form validates and shows "guide on its way"
   but no email sends yet. To activate:
     a. Host guide content somewhere to get a public URL
     b. Set up Google Apps Script (logs to Sheet + emails guide)
     c. Paste the Script URL into app.js where SUBMIT_URL is defined

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

Every link click fires a link_click event with all three. View per-
product breakdown in GA4 → Explorations → Free Form with
"Click Label" as a row and "Event Count" as a value.

Weekly automation (separate setup) pulls from GA4 + Clarity +
Google Sheet (guide signups) and writes a report to:
  D:\OG Ladka\Automation Reports\

───────────────────────────────────────────────────────────────────
IF STARTING A NEW AI CHAT
───────────────────────────────────────────────────────────────────
Upload index.html + style.css + app.js and say:
"This is my OG Ladka link-in-bio site. It has 3 panels (home, shop,
guide form) that swap via JS. CSS is in style.css, JS in app.js,
images in the images/ folder. The Shop panel has a spotlight effect
from the top. Help me edit it."
═══════════════════════════════════════════════════════════════════
