# VoltEdge Energy — concept website

A fictional solar, backup power and electrical solutions brand, designed by
**Local Edge** as a portfolio demonstration. It is not a real company, and the
site never claims to be one.

Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step,
no paid dependencies. Works on GitHub Pages as is.

## Files

```
index.html      page structure and content
style.css       all styling (tokens at the top, sections, form, responsive rules)
script.js       navigation, scroll reveal, quote form, and the CONFIG block
assets/         photographs (see manifest below)
README.md       this file
```

## Asset manifest

Your five photos arrived without descriptive filenames (all were called
"image"), so they were given descriptive names. The originals were not altered:
optimised copies were made for the web.

| Supplied photo (as received) | File(s) in `assets/` | Where it is used | Notes |
|---|---|---|---|
| 1. Two installers kneeling on a metal roof, wide (1800×1200) | `solar-hero-800.jpg`, `solar-hero-1280.jpg`, `solar-hero-1800.jpg` | **Hero** (responsive `srcset`) | Native resolution is wide enough for a full hero. Preloaded and `fetchpriority="high"`. |
| 1 (detail crop) | `solar-install-detail.jpg` (600×750) | **Project gallery, tile 01** | A 4:5 crop of the installer's hands and the panel rail, taken at native resolution. The same person appears in the hero, so replace this tile when more photos arrive. |
| 2. Two workers with a laptop on a roof (800×600, converted from WebP) | `solar-team-planning.jpg` | **Project gallery, tile 02** | |
| 3. Close-up of a solar panel surface (612×459) | `solar-panel-detail.jpg` | **Project gallery, tile 03** | Low resolution. Used at card size only. |
| 4. Large blue rooftop array (612×408) | `solar-commercial-array.jpg` | **Solutions: Commercial energy** | Low resolution. Used at card size only, never full width. |
| 5. Electrician at an inverter and wiring (612×407) | `solar-inverter-wiring.jpg` | **Solutions: Backup power** | Shows an inverter and cabling on an exterior wall. Low resolution. |

Every image has descriptive alt text, explicit `width` and `height`, and
`loading="lazy"` except the hero.

### Assets still needed

| Role | Currently | What to supply |
|---|---|---|
| Residential solar | A CSS/SVG illustration (`#residential` in `index.html`, marked with a comment) | A photo of solar panels on a house roof, about 3:2 landscape, at least 1200 px wide |
| Inverter and battery system | Photo 5 (wiring and inverter only) | A clean, well-lit photo of an inverter with batteries |
| Completed project | None (gallery is labelled "Illustrative concept") | One or two attractive photos of a finished installation, about 4:5 portrait or 3:2 landscape |
| Second hero-quality photo | None | Optional, for variety |
| Logo | A CSS and inline SVG wordmark | Only if a real brand is ever created |

Photos 3, 4 and 5 are 612 px wide, which is stock-preview size. They look fine
at card size but would be soft if enlarged. **Confirm every photo's licence**
(for example Unsplash, Pexels or a purchased licence) before publishing, and keep a
`CREDITS.txt` file if the licence asks for attribution.

## Configuration (`script.js`)

Open `script.js` and fill in the `CONFIG` block at the top. Anything left empty
stays switched off, so the site never shows a contact route that does not exist.

| Setting | Example | Effect |
|---|---|---|
| `whatsappNumber` | `'263771234567'` | Digits only with country code. Adds a WhatsApp link in the footer and under the form, and the form opens WhatsApp with the enquiry pre-written. |
| `phone` | `'263771234567'` | Adds a tap-to-call link in the footer. |
| `email` | `'hello@yourdomain.com'` | Adds an email link in the footer. |
| `formEndpoint` | `'https://formspree.io/f/abcdwxyz'` | Posts enquiries to a form service and shows a real "sent" message. |

### How the quote form behaves

| Configuration | Behaviour |
|---|---|
| Nothing set (default) | **Demo mode.** A visible notice says it is a demonstration, and after a valid submit the page states that nothing was sent and shows what would have been. |
| `whatsappNumber` set | Opens WhatsApp with the enquiry pre-written. The demo notice is hidden. |
| `formEndpoint` set | Posts to the form service. Success and failure messages are shown honestly. |

GitHub Pages cannot process forms itself, so a form service (or WhatsApp) must
be connected before real enquiries can be collected.

## Deploy to GitHub Pages

1. Create a new repository, for example `voltedge-demo`.
2. Upload `index.html`, `style.css`, `script.js`, `README.md` and the `assets` folder.
   Keep the folder name `assets` exactly, in lowercase.
3. In the repository, open **Settings → Pages**, choose **Deploy from a branch**,
   select `main` and the `/ (root)` folder, then save.
4. After a minute or two the site is live at
   `https://YOUR-USERNAME.github.io/voltedge-demo/`.
5. Optional: add an `og:image` tag in `index.html` (a comment shows where) using
   the full URL of `assets/solar-hero-1280.jpg`.

All file paths are relative, so the site works from a repository subfolder.

## What was checked

- Every local image reference resolves to a file in `assets/`.
- Every in-page link and button leads to a real section.
- No horizontal scrolling at 320, 390, 768, 1024 and 1440 px.
- Mobile menu opens and closes by touch, keyboard, Escape and link tap.
- Form validation messages, demo mode, WhatsApp mode and form-service mode.
- The scroll reveal never leaves content hidden, and is off for visitors who
  prefer reduced motion.
- Copy contains no invented statistics, prices, client names, testimonials,
  certifications, addresses or phone numbers.

Fonts (Bricolage Grotesque and Source Sans 3) load from Google Fonts with
system-font fallbacks, so the page remains readable if they fail to load.

## Credits

Concept website designed by [Local Edge](https://poppedcalf.github.io/Local-Edge/).
