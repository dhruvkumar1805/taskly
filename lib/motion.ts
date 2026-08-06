// Shared motion tokens — keep every animated surface on the same rhythm.
// Easing mirrors the CSS custom properties in app/globals.css.
export const easeOutQuart = [0.25, 1, 0.5, 1] as const;
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const durations = {
  instant: 0.12,
  fast: 0.18,
  base: 0.22,
  layout: 0.32,
} as const;

// A list row entering/leaving/reordering — used for task rows, cards, etc.
export const rowMotion = {
  layout: true,
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.97, transition: { duration: durations.fast, ease: easeOutQuart } },
  transition: { duration: durations.base, ease: easeOutQuint, layout: { duration: durations.layout, ease: easeOutExpo } },
} as const;

// A small inline element popping in/out (badges, hints, pills).
export const popMotion = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: { duration: durations.instant, ease: easeOutQuart },
} as const;
