# Design Brief — Relief Resource Management

## Purpose & Context
Emergency relief coordination platform. Citizens report resource needs (food, water, medicine) via map. NGOs claim requests and track delivery. Admins monitor all activity. Field-optimized UI for phone-based operation under stress with intermittent connectivity.

## Tone & Aesthetic
**Actionable Clarity** — Humanitarian-first interface prioritizing rapid task completion. Professional warmth avoiding corporate coldness. High contrast for outdoor/poor light conditions. Color semantics tied to relief urgency and delivery status. Mobile-first responsive, dark mode for nighttime field ops.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary (Teal) | `0.58 0.15 205` | Trust, stability, primary CTAs |
| Secondary (Green) | `0.68 0.21 151` | Success, delivered resources |
| Accent (Red-Orange) | `0.58 0.24 30` | Urgent/open requests, destructive actions |
| Chart-2 (Amber) | `0.72 0.19 62` | In-transit/claimed intermediate state |
| Chart-4 (Purple) | `0.58 0.15 205` | Secondary actions, tooltips |
| Background | `0.98 0 0` light / `0.15 0 0` dark | Canvas, maintains AA+ contrast |
| Foreground | `0.18 0 0` light / `0.92 0 0` dark | Text, accessible on all backgrounds |
| Muted | `0.92 0.01 0` light / `0.28 0.01 0` dark | Disabled, secondary info |

## Typography

| Role | Font | Scale | Usage |
|------|------|-------|-------|
| Display | General Sans | 32px / 24px | Headings, dashboard titles, emergency labels |
| Body | DM Sans | 16px base / 14px mobile | Narrative text, request details, form inputs |
| Mono | Geist Mono | 12px / 11px | Resource IDs, emergency codes, timestamps |

## Elevation & Depth

| Surface | Token | Treatment |
|---------|-------|-----------|
| Background | `bg-background` | Neutral base, reduces eye fatigue |
| Card | `bg-card` shadow-subtle | Lifted, clickable sections, request cards |
| Popover | `bg-popover` shadow-elevated | Modal dialogs, map info bubbles, urgent alerts |
| Input | `bg-input` border-border | Form fields, search, inline edits |

## Structural Zones

| Zone | Light Background | Dark Background | Border | Purpose |
|------|------------------|-----------------|--------|---------|
| Header | `bg-sidebar` | `bg-sidebar` | `border-b border-sidebar-border` | App branding, user role badge, menu toggle |
| Main Map | `bg-background` | `bg-background` | none | Relief pins (red=open, amber=claimed, green=delivered), NGO service radius circles (teal) |
| Request Cards | `bg-card` | `bg-card` | `border border-border` | Stacked list view, status badge inline, relief category icon, distance, urgency level |
| Dashboard Stats | `bg-muted/30` | `bg-muted/20` | `border-t border-border` | KPI tiles, verified counts, delivery progress |
| Footer/Actions | `bg-muted/10` | `bg-muted/10` | `border-t border-border` | Call-to-action buttons, SOS trigger (5s long-press), emergency contact |

## Component Patterns

| Component | State | Style |
|-----------|-------|-------|
| Request Card (Open) | `.status-open` | Red-orange background, accent text, pulsing shadow |
| Request Card (Claimed) | `.status-claimed` | Amber background, muted text, standard shadow |
| Request Card (Delivered) | `.status-delivered` | Green background, secondary text, subtle shadow |
| Relief Icon (Food) | `.relief-food` | Purple (chart-4) color |
| Relief Icon (Water) | `.relief-water` | Teal (primary) color |
| Relief Icon (Medical) | `.relief-medical` | Red-orange (accent) color |
| Map Pin (Open) | `.map-pin-open` | Accent bg, 2px border, auto-pulse |
| Map Pin (Delivered) | `.map-pin-delivered` | Green bg, 2px border |
| NGO Service Radius | `.ngo-radius` | Teal border 30% opacity, teal fill 5% opacity, circular boundary |

## Spacing & Rhythm

- **Micro**: 4px (icon padding, inline gaps)
- **Small**: 8px (button padding, gap between items)
- **Base**: 16px (section margins, card padding)
- **Large**: 24px (section breaks, stacked cards)
- **XL**: 32px (page edges on mobile, section dividers)

Mobile-first breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

## Motion & Interaction

- **Transition Default**: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth, professional)
- **Status Change**: Fade-in (`fade-in 0.3s`) for new request arrivals
- **Urgent Alert**: Pulsing glow (`pulse 2s`) on open requests, decaying opacity
- **Card Entry**: Slide-up (`slide-up 0.3s`) when expanding request details
- **No bounce**: Kept motion grounded; field workers value clarity over delight

## Signature Detail

**Color-Coded Request Urgency on Map**: Open requests render as pulsing red-orange pins; claimed/in-transit as steady amber; delivered as green. On hover/tap, map info bubble shows relief category icon inline with urgency level badge. Creates scannable visual hierarchy without requiring text read on low-connectivity conditions.

## Constraints & Anti-Patterns

- No gradients on buttons — solid colors only, ensure accessible tap targets
- No dark text on dark backgrounds in either mode — always maintain 0.7+ L (lightness) difference
- No animations longer than 0.5s — field workers prioritize speed over spectacle
- No scrolling modals — keep dialogs brief, pinned to viewport
- Relief icons always paired with text labels for accessibility
- Map always responsive; never assume fixed viewport size

## Accessibility

- Minimum touch target: 44×44px for mobile
- All status badges use color + text + icon (red + "Open" + exclamation)
- Form inputs have visible labels (never placeholder-only)
- High contrast preserved in both light/dark: AA+ compliance verified
