# Handoff: Flo Health-Inspired Restyle ("1c" blush + plum duotone)

## Overview
Restyles Pregg's existing rose/slate visual system to a blush + plum duotone — a direction
explored toward Flo Health's general aesthetic mood (softer, deeper jewel-tone brand color,
warmer neutrals, gentle illustration presence). This is a **palette and illustration-accent
change only** — no layout, navigation, or feature changes. It does not copy any of Flo Health's
actual proprietary UI, iconography, or artwork; nothing here was traced or reproduced from their
app.

## About the Design Files
The files in `reference/` are **design references built in HTML/React outside your codebase**
(a separate Design System project) — they demonstrate the intended colors, component styling,
and the new illustration motif, but are not meant to be copied in as-is. Recreate the same visual
result inside Pregg's real Tailwind/React codebase, using its existing component structure
(`src/components/`, `src/pages/`) and Tailwind conventions — do not introduce a new styling
approach.

## Fidelity
**High-fidelity.** Every hex value below is final. Apply them exactly — do not round or
approximate to a different Tailwind swatch.

## Design Tokens — exact values to change

Pregg currently uses Tailwind's built-in `rose` and `slate` palettes directly as utility classes
(`bg-rose-500`, `text-slate-800`, `border-rose-100`, etc.) — there is no `tailwind.config` color
override today. The cleanest implementation is to add a Tailwind theme extension that maps
`rose-*` and `slate-*` to these new hex values, so every existing `rose-*`/`slate-*` class in the
codebase picks up the new palette with no per-component edits:

```js
// tailwind.config.js (or wherever Tailwind theme is configured)
theme: {
  extend: {
    colors: {
      rose: {
        50:  '#fdf3f6',
        100: '#f9e6ec',
        200: '#f3dbe3',
        300: '#e8c2d0',
        400: '#c46b8f',
        500: '#7c4a68', // primary brand — was #ec4a7a
        600: '#63384f', // hover — was #db2a63
      },
      slate: {
        50:  '#fdf8fa',
        100: '#f7eef1',
        200: '#ecd9e0',
        300: '#d9b8c4',
        400: '#a67e8f',
        500: '#8a6373',
        600: '#6b4a5a',
        700: '#523844',
        800: '#3d2733',
      },
    },
  },
},
```

If Tailwind v4's CSS-based `@theme` config is in use instead (check `src/index.css`), add the
same values as CSS custom properties there instead of a JS config.

**Everything else is unchanged**: `amber`, `emerald`, `red`, and `sky` (used for BP category
badges, weight-change badges, and destructive actions) keep their default Tailwind values — do
not recolor health-status semantics.

App background wash: `bg-rose-50/40` → keep the same class, it now resolves to the new blush
tone automatically.

## New component: Blob (illustration placeholder)

A soft, organic gradient shape used as a placeholder illustration slot — see
`reference/Blob.jsx` for the source. Source at `reference/blob-illustration.jsx`. Add it to `src/components/Blob.tsx`:

```tsx
interface BlobProps {
  size?: number;
  gradient?: boolean;
  background?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Blob({ size = 52, gradient = true, background, children, className = '' }: BlobProps) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
        background: background ?? (gradient ? 'linear-gradient(135deg, #7c4a68, #c46b8f)' : '#f9e6ec'),
        fontSize: size * 0.42,
        color: gradient || background ? '#fff' : '#7c4a68',
      }}
    >
      {children}
    </div>
  );
}
```

### Where to use it (replaces existing circular icon-avatar `div`s — no other markup changes)

- **`src/pages/Dashboard.tsx`** — the due-date CTA row's `w-11 h-11 rounded-full bg-amber-50`
  avatar (wrapping `getBabyEmoji(...)`) → `<Blob size={44}>{getBabyEmoji(week)}</Blob>`.
- **`src/pages/Baby.tsx`** — `DueDateSection`'s pair of `w-20 h-20 rounded-full` avatars (the
  `BabyIcon` circle and the baby-emoji circle) → one `<Blob size={80}><BabyIcon/></Blob>` and one
  `<Blob size={80} gradient={false}>{getBabyEmoji(week)}</Blob>`.
- **`src/pages/Auth.tsx`** — the centered `HeartPulse` mark above the "Pregg" wordmark on both the
  sign-in screen and the loading/confirmation states → `<Blob size={56}>🌸</Blob>` (or keep
  `HeartPulse` inside the Blob if you'd rather not introduce emoji — either reads fine).

Do not add Blob anywhere else — it's a light illustration accent, not a general-purpose avatar
component, so keep it to these three spots for now.

## Interactions & Behavior
No changes. All existing hover/press/focus states, transitions, and animations are unchanged —
only the colors they reference are different.

## Assets
- `src/favicon.svg` (or `public/favicon.svg`) is left as-is intentionally — it's the one real
  brand asset in the repo. It will read slightly warmer/pinker than the new palette until a new
  mark is commissioned; that's expected, not a bug.
- No other new binary assets — Blob is pure CSS (gradient + border-radius), no image file needed.

## Files
- `reference/tokens-colors.css` — the full new color token set (also shows the semantic mapping
  used by the Design System project, useful context even though Pregg doesn't use CSS variables
  today).
- `reference/blob-illustration.jsx` — Blob component source (React, plain CSS-in-JS style props
  — adapt to Tailwind/`className` as shown above if you prefer utility classes over inline styles).
- `reference/ui-kit-screens/index.html` — a live click-through recreation of all 7 Pregg screens
  in the new palette, for visual reference (open directly in a browser). The rest of
  `reference/ui-kit-screens/` holds the individual screen files (`dashboard-screen.jsx`,
  `auth-screen.jsx`, `reminders-screen.jsx`, `blood-pressure-screen.jsx`, `weight-screen.jsx`,
  `baby-screen.jsx`, `settings-screen.jsx`, plus fake `data.js`) it's composed from.
