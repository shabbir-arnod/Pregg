import React from 'react';

// Soft organic "blob" shape — a placeholder illustration motif (Flo-inspired direction "1c")
// standing in for commissioned character/scene illustration. Fill with an emoji, glyph, or
// nothing at all; never hand-draw detailed art inside it.
function Blob({ size = 52, gradient = true, background, children, style }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
        background: background || (gradient ? 'var(--illo-gradient)' : 'var(--brand-tint)'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: size * 0.42,
        color: gradient || background ? 'var(--text-on-brand)' : 'var(--brand)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
