# Poe Heights — GoHighLevel handoff

This folder is the source-of-truth for the redesigned Poe Heights site. It
mirrors the pattern used for Verde Valley (`../site/`): a portable CSS/JS
pair you paste into GoHighLevel's Custom Code panels, plus one reference
HTML file per page that shows exactly what markup goes into each page's
Custom HTML element.

## Quick start: one-page client approval demo

**`onepage.html` is a single, self-contained page** — homepage plus all 8
service "detail" write-ups folded into one long scrolling page (each
service card jumps down to its own block via an in-page anchor, e.g.
`#detail-rope-access`, with a "back to all services" link to return). Use
this to get client approval fast, before splitting things into real
subpages:

1. Paste `css/poe-heights.css` into GHL's Custom CSS.
2. Paste `js/poe-heights.js` into that page's footer Custom Code.
3. Paste everything between `<body class="ph-root">` and `</body>` in
   `onepage.html` (skip the trailing `<script>` tag) into that page's
   Custom HTML element.
4. Add the two Google Fonts `<link>` tags from the top of `onepage.html`'s
   `<head>` to GHL's header Custom Code.

Once the client approves, split `onepage.html` back into `index.html` +
`services/*.html` (already built and ready in this folder — see below) and
delete `onepage.html`.

## What changed vs. the client's original mockup

1. **Color palette** — swapped the black/cream theme for the client's
   requested blues + white (multiple shades: deep navy, mid accent blue,
   light sky blue, pale blue-white background). All colors are CSS
   variables at the top of `css/poe-heights.css` (`--ph-ink`, `--ph-accent`,
   etc.) so the client can tweak the exact shades in one place.
2. **About section photo** — the client asked for "a building with someone
   hanging, cleaning the window" in that section. It now has a real
   `<img>` slot (see "Photos to add" below) over a styled blue placeholder
   panel, so the page looks intentional even before the real photo is
   uploaded.
3. **Clickable services** — each of the 8 service cards on the homepage is
   now a link to its own detail page (`services/*.html`) with a bigger
   photo, a longer description, a checklist of what's included, and an
   "ideal for" list, per the client's request.

## How to publish the full multi-page version in GoHighLevel

(Skip this section for the one-page approval demo above — use it once the
client has signed off and you're ready to split things into real pages.)

1. **CSS** — paste the entire contents of `css/poe-heights.css` into
   Site Settings → Custom CSS (or the page's own Custom CSS field). It's
   namespaced with the `ph-` prefix so it won't collide with GHL's own
   builder classes.
2. **JS** — paste the entire contents of `js/poe-heights.js` into each
   page's footer Custom Code ("before `</body>`"). It's defensive — every
   feature checks the element exists first, so it's safe even on a page
   that only has some of these sections.
3. **HTML** — for each page (`index.html`, `services/rope-access.html`,
   etc.), copy everything between `<body class="ph-root">` and
   `</body>` (i.e. skip the `<!DOCTYPE>`/`<head>` and the trailing
   `<script>` tag) into that page's Custom HTML / embed element in GHL.
   Create one GHL page per file: the homepage, and 8 service pages.
4. **Fonts** — add the two Google Fonts `<link>` tags from the top of any
   file's `<head>` into GHL's site-wide header Custom Code, if not already
   present.
5. Once the 8 service pages exist in GHL and you know their real URLs,
   update the `href="services/xxx.html"` links on the homepage (and the
   `../index.html#services` links on each service page) to match.

### Two GHL quirks already worked around here (learned from Verde Valley)

- GoHighLevel's Custom HTML element silently strips `<main>`, `<section>`,
  and `<article>` tags. Every section on every page here uses `<div>`
  instead — don't reintroduce those tags when pasting into GHL.
- The scroll-reveal fade-in effect is visible-by-default in CSS; JS only
  *adds* the hidden state right before animating an element in. If GHL's
  footer script is ever slow to load or blocked, content stays visible
  instead of getting stuck invisible.

## Photos and logo to add (local files, then re-upload to GHL Media Storage)

Every image below is wired up with a graceful fallback (`onerror` hides a
missing image and a blue placeholder panel shows instead), so the site
never looks broken while these are pending. Search the HTML/CSS for the
word **REPLACE** to find every spot in context.

| File to add | Used on | Notes |
|---|---|---|
| `assets/logo-icon.png` | Header, every page | Crop just the "P" mark icon from the client's real logo (transparent background). It's shown at ~34px tall. Until this exists, a line-art "P" mark is drawn in SVG as a fallback. |
| `assets/photos/about-team.jpg` | Homepage → About section | **The photo the client specifically requested**: a building façade with a technician cleaning windows on rope access. Recommended: portrait/tall crop, at least 1000×1250px. |
| `assets/photos/hero-building.jpg` | Homepage → hero background | Optional bonus: a wide establishing shot of a technician on a building, shown at low opacity behind the hero text. Recommended: at least 1600×1000px, landscape. |
| `assets/photos/services/rope-access.jpg` | Services grid + detail page | |
| `assets/photos/services/swing-stage-lifts.jpg` | Services grid + detail page | |
| `assets/photos/services/water-fed-pole.jpg` | Services grid + detail page | |
| `assets/photos/services/interior-glass-cleaning.jpg` | Services grid + detail page | |
| `assets/photos/services/window-sealing-leak-testing.jpg` | Services grid + detail page | |
| `assets/photos/services/pressure-washing.jpg` | Services grid + detail page | |
| `assets/photos/services/solar-panel-cleaning.jpg` | Services grid + detail page | |
| `assets/photos/services/window-restoration.jpg` | Services grid + detail page | Recommended: landscape, at least 1200×750px, one real job photo per service. |

The header logo uses a CSS trick (`filter: invert(1)`) to show the client's
black logo as white against the transparent dark header, then removes the
filter once the header goes solid/light on scroll — see the comment above
`.ph-logo-img` in `css/poe-heights.css`. If the client instead exports a
proper reversed (white) logo file, delete that filter and swap in the two
versions directly.

## Still reference-only, not wired up

- **The quote form** (`.ph-quote-form` on the homepage) is a static HTML
  form with a JS `alert()` on submit — it does not send data anywhere.
  Replace it with a native GHL Form/Survey element (or wire the fields
  into a GHL workflow) before going live.
- **Testimonials** are placeholders (per the client's own intake answers —
  none have been collected yet). Swap in real reviews when available.
- **Social links** in the footer point to `#` (client has none yet).
