import type { ReactNode } from 'react';

interface BlobProps {
  size?: number;
  gradient?: boolean;
  background?: string;
  children?: ReactNode;
  className?: string;
}

// Soft organic "blob" shape — a light illustration accent (see
// Design/design_handoff_flo_restyle). Fill with an emoji, icon, or nothing.
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
