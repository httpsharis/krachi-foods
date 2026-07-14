# Design.md — Karachi Foods Ordering Site

## 1. Brief

**Subject:** Karachi Foods, a 24-hour fast food shop in Johar Town, Lahore, currently operating entirely through WhatsApp with no website.
**Audience:** Existing local customers within ~1000m, ordering by phone, mostly on mid-range Android devices.
**Job of the page:** Let a customer build an order from a real menu and send it straight to WhatsApp — with their delivery distance attached — in fewer steps than typing a WhatsApp message from scratch.

This is not a brand site or a portfolio piece for the shop. It's a single-purpose ordering tool wearing the shop's own visual language.

## 2. Rejected direction (and why)

The first pass used a dark-slate background, gold gradient text, and glassy bento cards. Rated on its own it looked fine, but it was the generic AI-default "premium SaaS dark mode" — the kind of look that shows up regardless of subject. It also fought the audience: heavy blur/glass rendering is expensive on the phones this shop's actual customers use, and a SaaS dashboard aesthetic has nothing to do with a street food stall.

That direction was scrapped in favor of pulling from the subject's own world instead.

## 3. Design concept: the signboard + the order ticket

The site is styled as if it *is* the physical shop signage and a printed order receipt, not a screen pretending to be one:

- The hero is a **hand-painted hanging signboard** — enamel red, chained, gently swinging.
- The cart is a literal **order ticket** — perforated edges, dashed stitch lines, monospace line items, a stamped "hot & ready" button.
- The menu is a **chalkboard-style board** with washi-tape corners.
- A scrolling **LED ticker strip** stands in for the string-light signage common on food stalls at night.

This is the signature: a page that reads as *this specific shop's actual signage*, not a template with the shop's name dropped in.

## 4. Color tokens

| Token | Hex | Usage |
|---|---|---|
| `--paper` | `#F1E6C9` | Page background — aged sign paper |
| `--paper-2` | `#FBF6E8` | Card / ticket surfaces — lighter receipt paper |
| `--ink` | `#211405` | Primary text, borders, dark surfaces (menu board, cart drawer) |
| `--maroon` | `#AF2A20` | Primary accent — signboard enamel red, primary buttons |
| `--maroon-2` | `#7E1D17` | Shadow/depth value under maroon, text shadow on hero |
| `--mustard` | `#E1A22C` | Secondary accent — string-light glow, tags, live-status highlights |
| `--pink` | `#D93E77` | Tertiary accent — used sparingly (alternating bulbs, location pin) |
| `--green` | `#3FAE63` | Status-only color — "open" state |
| `--line` | `rgba(33,20,5,0.20)` | Hairlines, dashed dividers, dotted rules |

Rule: maroon is the only color used for primary actions (Send Order, Add). Mustard and pink are decorative/status accents and never compete with maroon for attention on interactive elements.

## 5. Typography

| Role | Face | Usage |
|---|---|---|
| Display | **Alfa Slab One** | Headlines, section titles, buttons — the "painted signboard lettering" voice. Used with restraint: never body text, never more than a few words at a time. |
| Body / utility | **Space Mono** | Everything else — paragraph copy, menu items, receipt lines, labels. Reinforces the "printed ticket" concept even outside the cart. |

No third face. The two-face system (bold slab + monospace) is deliberately narrow — it's what makes the receipt metaphor read consistently across every section instead of just the cart.

## 6. Layout — section order and purpose

```
[Ticker strip]      — ambient signage, sets tone before any content
[Nav]                — brand + jump links + call button
[Hero]               — signboard, rating, two CTAs (Build order / Check range)
[Story strip]        — two-column: short copy + quick-fact card
[Digital menu]       — category tabs + food-token grid, this is the core feature
[Delivery range]     — location checker, radar visual, distance + fee/minimum
[Status]             — live dine-in status, delivery status, address/phone
[Footer]             — address, contact links, credit line
[Floating cart FAB]  — persistent, opens the order ticket drawer
```

Ordering logic: hero sells the concept in one glance, menu is the actual task, location/status answer the two questions a first-time visitor has ("can they reach me" / "are they open"), footer is reference info. The cart is global (floating), not a section, because ordering can start from any point in the page.

## 7. Signature interactions

- **Hero parallax:** the signboard tilts toward the cursor (`rotateY`/`rotateX` driven by mouse position) layered under a slow, independent CSS `swing` keyframe — two motions compose into one "hanging object" feel.
- **Order ticket flip-punch:** when an item is added, the cart drawer plays a short `rotateY` flip, like a ticket being stamped.
- **Menu card tilt:** food cards tilt toward the cursor on hover, treating each item like a physical token being picked up.

All three are gated behind `(hover: hover) and (pointer: fine)` — they're pointer-driven effects with real paint cost, so touch devices (the actual customer base) skip them entirely rather than paying for an effect they can't trigger.

## 8. Motion system

One rule: **ambient (always-running) animation is kept to a minimum; interaction-triggered animation carries the personality.**

Current ambient motion, deliberately limited to two:
- Ticker scroll (38s loop — slowed from an original 22s, which read as frantic)
- Status "open" beacon pulse

Removed during refactor: bulb flicker, and a duplicate pulse keyframe that ran alongside the beacon. Two duplicate pulse animations (`pulse` / `pulse2`) were consolidated into one reusable `pulse-dot` system, colored via a CSS custom property (`--pulse-c`) instead of two hand-copied keyframe blocks — this is the actual color/motion *system*, not just a stylistic cleanup.

`prefers-reduced-motion: reduce` disables all animation and transition globally via a single rule at the top of the stylesheet.

## 9. Component patterns

- **Buttons:** two variants only — `stamp-btn`/`btn-primary` (filled, maroon or ink, used for the one primary action per section) and `btn-ghost`/`cat-tab` (outlined, secondary actions and filters). No third button style.
- **Cards:** consistent `2px solid var(--ink)` border + flat offset shadow (`Npx Npx 0 var(--line)`), never a soft blurred box-shadow — keeps the "printed/cut paper" feel instead of a glassy UI feel.
- **Dividers:** dashed or dotted, never solid hairlines — ties every section back to the receipt/ticket motif established in the cart.

## 10. Accessibility & responsiveness floor

- `:focus-visible` gets an explicit 3px pink outline — never relies on browser default alone.
- All animation respects `prefers-reduced-motion`.
- Grid layouts collapse to single-column under 760px; hero type scales with `clamp()`.
- Tilt/parallax effects require a fine pointer, so they never block or slow down touch interaction.

## 11. Known placeholders — confirm before going live

These live at the top of the `<script>` block, clearly commented:

| Value | Current placeholder | Needs |
|---|---|---|
| `SHOP` lat/lng | Approximate Johar Town coordinates | Exact pin from the owner or Google Maps |
| `DINEIN_OPEN_HOUR` | `12` (noon) | Real opening hour |
| `DELIVERY_FEE` | `Rs 50` | Real fee, or confirmation it's free |
| `MIN_ORDER` | `Rs 300` | Real minimum, or confirmation there isn't one |
| Menu items beyond the 5 confirmed burgers | Fries, nuggets, cold drink, milkshake — invented | Real menu + real prices |

None of these are cosmetic — they're the numbers that go into a real customer's WhatsApp order, so they need sign-off before this is treated as production-ready.
