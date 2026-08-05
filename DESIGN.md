# Design

## Visual Theme

"Night operations desk" — a dense, matte instrument panel, not a soft glowing SaaS dashboard. Dark is the primary canvas: near-black neutral surfaces with zero decorative chroma, one committed ember/rust accent used only where it means something (primary actions, focus, urgency), and a cool slate-blue held in reserve for secondary/informational state. No glassmorphism, no gradients, no pastel icon badges, no side-stripe accents.

Strategy: **Restrained-to-committed hybrid**. Neutrals carry zero chroma (pure grayscale) so the ember accent reads as a genuine signal, not one hue among six.

## Color

All values OKLCH. Seed hue 35° (warm ember/rust) anchors `--primary`; kept within ±10°.

### Dark (primary mode)

```css
--background: oklch(0.14 0 0);       /* page canvas */
--card: oklch(0.19 0 0);             /* panels, sidebar, popovers */
--popover: oklch(0.21 0 0);          /* raised above card */
--secondary: oklch(0.24 0 0);        /* neutral button / chip fill */
--muted: oklch(0.24 0 0);
--accent: oklch(0.27 0 0);           /* neutral hover/focus highlight — NOT colored */
--border: oklch(1 0 0 / 10%);
--input: oklch(1 0 0 / 14%);

--foreground: oklch(0.95 0 0);
--muted-foreground: oklch(0.64 0 0);
--accent-foreground: oklch(0.95 0 0);

--primary: oklch(0.66 0.19 38);      /* ember */
--primary-foreground: oklch(0.99 0 0);
--ring: oklch(0.66 0.19 38 / 0.5);

--destructive: oklch(0.60 0.22 20);  /* alarm red, hue kept apart from ember */
--destructive-foreground: oklch(0.99 0 0);

--info: oklch(0.68 0.11 240);        /* slate-blue — secondary/low-priority/in-progress */
--success: oklch(0.70 0.14 150);     /* muted green — completed only, used sparingly */
```

### Light (derived, same system)

```css
--background: oklch(0.985 0 0);
--card: oklch(1 0 0);
--popover: oklch(1 0 0);
--secondary: oklch(0.96 0 0);
--muted: oklch(0.96 0 0);
--accent: oklch(0.955 0 0);
--border: oklch(0.90 0 0);
--input: oklch(0.88 0 0);

--foreground: oklch(0.17 0 0);
--muted-foreground: oklch(0.45 0 0);
--accent-foreground: oklch(0.17 0 0);

--primary: oklch(0.58 0.19 38);
--primary-foreground: oklch(0.99 0 0);
--ring: oklch(0.58 0.19 38 / 0.45);

--destructive: oklch(0.55 0.22 20);
--destructive-foreground: oklch(0.99 0 0);

--info: oklch(0.48 0.11 240);
--success: oklch(0.50 0.14 150);
```

Text-on-fill: white/near-white text on any filled primary, destructive, info, or success surface (all are mid-luminance saturated fills). Dark ink only on neutral or pale fills.

## Semantic mapping (replaces the old rose/amber/sky/emerald badge set)

- **Priority HIGH** → primary (ember), solid weight
- **Priority MEDIUM** → neutral (muted-foreground), plain
- **Priority LOW** → info (slate-blue), subdued
- **Status TODO** → neutral outline
- **Status IN PROGRESS** → info (slate-blue)
- **Status COMPLETED** → success (green), small check only — never a big filled pill
- **Overdue** → primary (ember), solid — same "needs attention" signal as HIGH priority
- **Due today / soon** → primary at reduced opacity (tint, not a new hue)
- **Due later** → neutral, text only

One hue family (ember) carries all urgency. Info-blue is the only other functional color. Green is reserved for "done" and used minimally.

## Typography

Geist Sans (UI text) + Geist Mono (already loaded, previously unused) for anything that reads as data: dates, timestamps, counts, keyboard-shortcut chips, status codes. This is the load-bearing "engineered, not decorated" move — hierarchy comes from type and mono/sans contrast, not gradients or blur.

- Display/hero: clamp scale, ceiling 6rem, letter-spacing ≥ -0.04em, `text-wrap: balance`.
- Body: 65–75ch measure, `text-wrap: pretty` on prose.

## Layout & Surface

- Radius tightened: `--radius: 0.5rem` (was 0.625rem). Crisper, less "bubbly."
- No `backdrop-blur` on cards, headers, or panels — solid `--card` surfaces with 1px `--border` hairlines instead of translucency + blur.
- No gradient fills, no gradient text, no side-stripe borders, no hover-glow accent bars.
- Sidebar/header surfaces use `--card` solid, not `bg-card/85 backdrop-blur-xl`.

## Motion

Keep the existing `fade-up` / `scale-in` utilities (expo ease-out, already has `prefers-reduced-motion` guard) — they're already well-built. Apply with intent (staggered list reveals), not uniformly on every element. No bounce/elastic easing anywhere.

## Components

- **Card**: `rounded-lg` (was `rounded-xl`), solid `--card` bg, 1px border, no blur, no translucency.
- **Badge/status chip**: text + small dot/icon rather than a filled pastel pill; reserve solid fills for the few states in the semantic map above.
- **Button**: unchanged structurally (already token-driven) — primary variant now reads as ember.
- **Task priority/status**: rebuilt per the semantic map; drop the rose/sky/amber/emerald ad-hoc Tailwind utility colors entirely in favor of the tokens above.
- Keyboard-shortcut affordances (the `N` chip, `/` search) are a genuine brand asset for this "engineered" direction — kept and reinforced with mono type.
