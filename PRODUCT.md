# Product

## Register

product

## Users
People who sign up to use Taskly as a real product to run their day: individual daily task management, not a team/collaboration tool (no multi-user workspace concepts). They open it multiple times a day to capture tasks, check what's due, and mark things done. Since it's meant to be launchable, the UI needs to read as a credible, considered product — not a weekend project.

## Product Purpose
Taskly helps someone organize, prioritize, and finish their daily tasks with minimal friction: quick capture, clear priority/status, due-date awareness, and an honest read on progress. Success is a tool that feels fast and gets out of the way — someone opens it, sees exactly what matters today, and closes it again.

## Brand Personality
Calm, precise, confident. Voice is quiet and direct, never cheerful-filler ("You're all caught up! 🎉") or corporate-stiff. It should feel engineered rather than decorated — closer to Linear/Raycast than to a template SaaS dashboard. Warm enough to not feel cold/enterprise, restrained enough to not feel playful/bubbly.

## Anti-references
The current UI is the primary anti-reference: unstyled default shadcn grayscale tokens with ad-hoc teal/emerald/amber gradients bolted on, heavy `backdrop-blur` glassmorphism on cards and headers, pastel icon-in-colored-box badges repeated everywhere, gradient hover glows, side-accent gradient bars, generic 3-card feature grids and testimonial cards, and scaffolding like a "v1.0 is live" eyebrow badge on the landing page. Also avoid: playful/bubbly (Duolingo-esque rounded candy color) and cold/enterprise (Jira/Salesforce-esque stiffness).

## Design Principles
1. **Dark is the primary canvas.** Design and perfect dark mode first; light mode is a first-class derivation of the same system, not a palette-swap afterthought.
2. **One committed accent, used with intent.** A single strong accent color carries real meaning (priority, status, focus) instead of a rainbow of pastel badge backgrounds.
3. **Density with clarity.** Compact, keyboard-first, minimal chrome — Linear/Raycast territory — but never cramped or ambiguous. Every element earns its space.
4. **Typography does the hierarchy work.** Real type scale, weight, and spacing contrast replace gradients and blur as the primary tools for emphasis.
5. **Motion communicates state, not decoration.** Transitions exist to show something changed, not to perform polish.

## Accessibility & Inclusion
WCAG AA contrast minimum (body text ≥4.5:1, large text ≥3:1) in both themes. Full keyboard navigability (the existing "n" new-task shortcut and dialog/dropdown focus traps must keep working). Every animation ships a `prefers-reduced-motion` alternative. Focus states must stay visible against the dark-primary background — no focus rings suppressed for aesthetics.
