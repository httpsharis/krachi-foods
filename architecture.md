# Architecture.md — Karachi Foods Ordering Site

## 1. System summary

A single static HTML file. No backend, no build step, no database, no server-side code. All state (menu, cart, location) lives in the browser and is either rendered to the DOM or handed off to WhatsApp as a pre-filled message. This is intentional: zero infrastructure to host, pay for, or maintain, which matches a first, unpaid build for a client with no prior web presence.

```
Browser (client-side only)
 ├─ Static HTML/CSS/JS  →  served as-is from GitHub Pages (or any static host)
 ├─ In-memory state      →  MENU (const), cart (object), locationInfo (string)
 ├─ localStorage         →  order counter, remembered delivery area
 ├─ Browser APIs         →  Geolocation, IntersectionObserver, matchMedia
 └─ External calls       →  Google Fonts (CSS), OpenStreetMap Nominatim (reverse geocode)

No server. No API keys. No user accounts. No payment processing.
```

## 2. File structure

Currently one file: `index.html` (referred to across this project as `karachi-foods-order.html`), containing:

```
<head>   → meta, Google Fonts link, all CSS in one <style> block
<body>   → all markup, sections in DOM order (see design.md §6)
<script> → one IIFE at the bottom, no external JS files, no build tooling
```

This is deliberate for a v1 handed to a non-technical owner: one file to upload, no `npm install`, no bundler, nothing to break in transit. If this grows into a second or third client site, it's worth splitting into `index.html` / `style.css` / `app.js` and templating the config block (see §7) — not worth the overhead for a single-shop v1.

## 3. Data flow

### 3.1 Menu → cart → total
```
MENU (const array of {id, name, price, cat, tag})
   │
   ├─ renderTabs()  → builds category filter buttons from MENU categories
   ├─ renderGrid()  → renders food cards for the active category
   │                   each card reads/writes cart[item.id]
   │
   └─ cart (object: { itemId: quantity })
          │
          └─ renderCart() → recomputes on every change:
                subtotal = Σ (qty × price)
                fee      = DELIVERY_FEE if subtotal > 0 else 0
                total    = subtotal + fee
                belowMin = subtotal < MIN_ORDER  → disables send + shows warning
```

Cart state is not persisted — a page refresh clears it. This is a known limitation (see §8), acceptable for a fast, single-session order flow.

### 3.2 Location → order message
```
"Check my location" click
   │
   ├─ navigator.geolocation.getCurrentPosition()
   │     │
   │     ├─ success → haversine(SHOP coords, user coords) → distance
   │     │              │
   │     │              ├─ fetch() → Nominatim reverse geocode → area name
   │     │              │              (falls back to distance-only text on failure)
   │     │              │
   │     │              └─ locationInfo = "<distance> from the shop, near <area>"
   │     │
   │     └─ failure/denied → prompts manual area text input instead
   │
   └─ manual "area" input (change event) → locationInfo = "Customer-entered area: <text>"
                                             also saved to localStorage (kf_last_area)
```

`locationInfo` is a plain string, not structured data — it's inserted directly into the WhatsApp message body. There's no validation beyond "geolocation succeeded or a fallback string exists."

### 3.3 Send order → WhatsApp handoff
```
"Send order on WhatsApp" click
   │
   ├─ builds a plain-text message: item lines, subtotal, delivery fee,
   │  total, locationInfo, optional notes field
   │
   ├─ URL-encodes the message
   │
   ├─ window.open("https://wa.me/<WA_NUMBER>?text=<encoded message>")
   │     → hands off entirely to WhatsApp's own web/app client
   │
   └─ localStorage counter increment (kf_order_clicks) — see §5
```

There is no order confirmation, no receipt, no record of the order anywhere except inside the resulting WhatsApp conversation itself. The site's job ends the moment WhatsApp opens.

## 4. External dependencies

| Dependency | Purpose | Failure mode |
|---|---|---|
| Google Fonts (`fonts.googleapis.com`) | Alfa Slab One, Space Mono | Falls back to browser default fonts if blocked/offline — layout still works |
| OpenStreetMap Nominatim (`nominatim.openstreetmap.org`) | Reverse geocoding (coords → area name) | Caught in a `.catch()` — falls back to distance-only text, order flow still completes |
| `wa.me` (WhatsApp) | Order handoff | Hard dependency — if unreachable, nothing downstream works. No fallback by design, since WhatsApp *is* the ordering channel for this business |

No API keys anywhere in the codebase. Nominatim's public endpoint has fair-use rate limits — fine for one shop's traffic; would need a paid geocoding provider if this scales across many client sites hitting the same key/IP pattern.

## 5. Browser storage (`localStorage`)

| Key | Written | Read | Purpose |
|---|---|---|---|
| `kf_order_clicks` | On every successful "Send order" | Only when URL has `?owner=1` | Quiet, owner-only order counter — never shown to customers |
| `kf_last_area` | On manual area entry | On page load, pre-fills the input | Convenience for repeat customers in the same ~1000m radius |

Both wrapped in `try/catch` — if storage is disabled (private browsing, some in-app browsers), the site degrades silently rather than throwing.

## 6. Rendering & interaction model

- No framework. Direct DOM manipulation (`innerHTML`, `createElement`, event listeners) inside one IIFE.
- `IntersectionObserver` drives scroll-reveal (`.reveal` → `.in-view`), unobserving each element once triggered — a one-time cost, not a scroll listener.
- `matchMedia('(hover: hover) and (pointer: fine)')` gates all pointer-tilt effects — see design.md §7 for rationale.
- `matchMedia('(prefers-reduced-motion: reduce)')` disables animation globally via CSS and skips tilt JS entirely.
- Category filtering and cart updates re-render the whole grid/cart list rather than patching individual nodes — acceptable at this scale (single-digit menu categories, low item count); would need a proper diffing approach if the menu grew to hundreds of items.

## 7. Configuration surface

Everything a non-developer would need to change lives in one block at the top of the `<script>`:

```js
var MENU = [ ... ]              // id, name, price, cat, tag per item
var SHOP = {lat, lng}           // delivery-radius origin point
var WA_NUMBER = '92...'         // international format, no +
var DINEIN_OPEN_HOUR = 12       // used by updateDineInStatus()
var DINEIN_CLOSE_HOUR = 3
var DELIVERY_FEE = 50
var MIN_ORDER = 300
```

This is the intended edit surface for future updates (new menu items, price changes, hour changes) without touching rendering or event logic below it.

## 8. Known limitations / technical debt

- **No persistence of cart across reloads.** A refresh mid-order loses the cart. Low risk for a short single-session flow, but worth a `localStorage`-backed cart if abandonment becomes a problem.
- **No order history for the owner.** The counter (§5) gives a count, not a log. If the owner wants to see *what* was ordered, that requires a real backend — out of scope for this static-site model.
- **Distance calculation is straight-line (haversine), not road distance.** Fine for a rough in-range/out-of-range signal; not accurate for actual delivery routing.
- **Single-file structure won't scale to multiple client sites cleanly.** Fine for one shop; revisit componentization (see §2) before reusing this as a template for a second or third client.
- **No automated tests.** Given the file's size and the amount of interdependent state (cart/location/status), a regression (e.g. editing the config block) is caught only by manual testing.

## 9. Deployment model

Static file → GitHub Pages (or any static host: Netlify, Vercel, plain nginx). No environment variables, no server process, no CI/CD required for v1. HTTPS is required for the Geolocation API to function — GitHub Pages serves HTTPS by default, so this is satisfied automatically once deployed there.
