# OG Ladka — Link in Bio

Live site: https://onehemansu-dotcom.github.io

## Structure
- `index.html` — markup (single page, panels toggled by JS)
- `style.css`  — all styling, both themes
- `app.js`     — panel switching, forms, animations, tracking
- `images/`    — all photos and product images

The GA4 and Clarity snippets stay inline in `index.html` on purpose —
they must load before anything else.

## Deploy
Push to the `onehemansu-dotcom.github.io` repo. GitHub Pages serves
`index.html` from the root automatically.

## Panels
Single-page app; JS toggles between panels:
Home · About · Shop · Ask a Question · Work With Me · Free Guide · Announcement

## Forms (Google Sheets via Apps Script)
Both forms POST to Apps Script web apps that append rows to a Google Sheet.
The URLs are near the top of `app.js`:
- `APPS_SCRIPT_URL`     — free-guide signups
- `QUESTIONS_SCRIPT_URL` — reader questions

If a form stops writing, redeploy the Apps Script with
**Deploy → Manage deployments → Edit → New version**
(keeps the same /exec URL), and make sure access is set to **Anyone**.

## Analytics
- Google Analytics 4: `G-GYS2RWZJ4T`
- Microsoft Clarity

Every clickable carries `data-label` + `data-category`. A global listener
fires a `link_click` event for each. Validated form submissions fire an
additional `form_submit` event.

## Theme
Switches automatically on the visitor's local time:
**light 6:00am - 5:59pm, dark 6:00pm - 5:59am.**
Re-checks every minute, so an open tab flips on its own at the boundary.
Set by `initTimeTheme()` in index.html, which puts `data-theme="light|dark"`
on `<body>`. Light is the CSS default; every dark value is scoped under
`body[data-theme="dark"]`.

Dark palette:
| Role   | Hex     |
|--------|---------|
| Top    | #181818 |
| Body   | #222222 |
| Card   | #2D2D2D |
| Border | #3C3C3C |
| Text   | #F4F1EE |
| Muted  | #A89A91 |
| Accent | #FF6B35 |
| Hover  | #FF8557 |
