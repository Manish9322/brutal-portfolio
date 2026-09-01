'use client';

import React from 'react';

/**
 * Admin UI primitives.
 *
 * The public site is deliberately oversized; the CMS is a tool, so it uses a
 * denser scale: 2px borders instead of 4, `text-sm` body copy, and compact
 * padding. The brutalist language (square corners, hard black, #FF5F1F accent)
 * is kept so it still feels like the same product.
 */

const ACCENT = '#FF5F1F';

/* ------------------------------------------------------------------ text -- */

export const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({
  children,
  htmlFor,
  className = '',
}) => (
  <label
    htmlFor={htmlFor}
    className={`block text-[10px] font-black uppercase tracking-widest text-black/50 ${className}`}
  >
    {children}
  </label>
);

export const Hint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-wide text-black/35">{children}</p>
);

/* ----------------------------------------------------------------- field -- */

/**
 * `120/300` counter. Stays quiet until 90% of the budget is used, then darkens,
 * then goes accent once the input refuses more characters — so the editor is
 * warned before the limit bites rather than surprised by it.
 */
export const CharCount: React.FC<{ length: number; max: number }> = ({ length, max }) => (
  <span
    className={`shrink-0 text-[10px] font-black tabular-nums tracking-wider ${
      length >= max ? 'text-[#FF5F1F]' : length >= max * 0.9 ? 'text-black/60' : 'text-black/25'
    }`}
  >
    {length}/{max}
  </span>
);

interface FieldProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  /** Spans both columns inside a FormGrid. */
  wide?: boolean;
  /** Character budget. Shows a counter and caps the control this wraps. */
  max?: number;
  /** Current text, used to drive the counter. Required alongside `max`. */
  value?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Injects `maxLength` into the first Input/Textarea in the tree.
 *
 * It walks rather than cloning the immediate child because a Field's control is
 * not always its only child: the gallery category pairs an Input with a
 * `<datalist>`, and the telegram handle sits in a flex row beside its Toggle.
 */
const withMaxLength = (node: React.ReactNode, max: number): React.ReactNode => {
  let injected = false;
  const walk = (n: React.ReactNode): React.ReactNode => {
    if (injected || !React.isValidElement(n)) return n;
    if (n.type === Input || n.type === Textarea) {
      injected = true;
      return React.cloneElement(n as React.ReactElement<{ maxLength?: number }>, { maxLength: max });
    }
    const kids = (n.props as { children?: React.ReactNode }).children;
    if (kids == null) return n;
    return React.cloneElement(n as React.ReactElement<{ children?: React.ReactNode }>, {
      children: React.Children.map(kids, walk),
    });
  };
  return React.Children.map(node, walk);
};

export const Field: React.FC<FieldProps> = ({
  label,
  hint,
  htmlFor,
  wide,
  max,
  value,
  children,
  className = '',
}) => {
  // maxLength is injected rather than passed at the call site so the number the
  // counter shows and the number the browser enforces cannot drift apart.
  const control = max != null ? withMaxLength(children, max) : children;

  return (
    <div className={`space-y-1.5 ${wide ? 'sm:col-span-2' : ''} ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {max != null && <CharCount length={(value ?? '').length} max={max} />}
      </div>
      {control}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
};

/* ---------------------------------------------------------------- inputs -- */

const controlBase =
  'w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold outline-none transition-colors ' +
  'focus:border-[#FF5F1F] disabled:opacity-40 placeholder:text-black/25 placeholder:font-medium';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { caps?: boolean };

export const Input: React.FC<InputProps> = ({ caps, className = '', ...props }) => (
  <input {...props} className={`${controlBase} ${caps ? 'uppercase' : ''} ${className}`} />
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { caps?: boolean; mono?: boolean };

export const Textarea: React.FC<TextareaProps> = ({ caps, mono, className = '', ...props }) => (
  <textarea
    {...props}
    className={`${controlBase} leading-relaxed resize-y ${caps ? 'uppercase' : ''} ${mono ? 'font-mono text-xs' : ''} ${className}`}
  />
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => (
  <select {...props} className={`${controlBase} uppercase cursor-pointer ${className}`}>
    {children}
  </select>
);

/* --------------------------------------------------------------- buttons -- */

type Variant = 'primary' | 'accent' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-black text-white border-2 border-black hover:bg-[#FF5F1F] hover:border-[#FF5F1F]',
  accent: 'bg-[#FF5F1F] text-white border-2 border-[#FF5F1F] hover:bg-black hover:border-black',
  ghost: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
  danger: 'bg-white text-red-600 border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[10px]',
  md: 'px-4 py-2 text-xs',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  block,
  className = '',
  children,
  ...props
}) => (
  <button
    {...props}
    className={`font-black uppercase tracking-widest transition-colors disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap ${VARIANTS[variant]} ${SIZES[size]} ${block ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
);

/** Square button for terse controls: ↑ ↓ ✕ */
export const IconButton: React.FC<ButtonProps & { 'aria-label': string }> = ({
  variant = 'ghost',
  className = '',
  children,
  ...props
}) => (
  <button
    {...props}
    className={`h-8 w-8 shrink-0 flex items-center justify-center text-xs font-black transition-colors disabled:opacity-30 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
  >
    {children}
  </button>
);

/* ---------------------------------------------------------------- status -- */

type Tone = 'neutral' | 'success' | 'muted' | 'accent';

const TONES: Record<Tone, string> = {
  neutral: 'bg-black text-white border-black',
  success: 'bg-green-100 text-black border-black',
  muted: 'bg-gray-100 text-black/50 border-black/30',
  accent: `bg-[${ACCENT}] text-white border-[${ACCENT}]`,
};

export const Badge: React.FC<{ tone?: Tone; children: React.ReactNode; className?: string }> = ({
  tone = 'muted',
  children,
  className = '',
}) => (
  <span
    className={`inline-block border-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
      tone === 'accent' ? 'bg-[#FF5F1F] text-white border-[#FF5F1F]' : TONES[tone]
    } ${className}`}
  >
    {children}
  </span>
);

/** Two-state pill used for visibility / featured flags. */
export const Toggle: React.FC<{
  on: boolean;
  onChange: () => void;
  onLabel?: string;
  offLabel?: string;
  'aria-label'?: string;
}> = ({ on, onChange, onLabel = 'VISIBLE', offLabel = 'HIDDEN', ...rest }) => (
  <button
    type="button"
    onClick={onChange}
    aria-pressed={on}
    {...rest}
    className={`border-2 border-black px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${
      on ? 'bg-[#FF5F1F] text-white' : 'bg-white text-black/50 hover:bg-gray-100'
    }`}
  >
    {on ? onLabel : offLabel}
  </button>
);

/* ------------------------------------------------------------- feedback --- */

export const Loading: React.FC<{ label?: string }> = ({ label = 'LOADING' }) => (
  <div role="status" aria-live="polite" className="py-16 text-center">
    <p className="text-xs font-black uppercase tracking-[0.3em] text-black/30 animate-pulse">{label}...</p>
  </div>
);

export const EmptyState: React.FC<{ label: string; action?: React.ReactNode }> = ({ label, action }) => (
  <div className="border-2 border-dashed border-black/30 py-12 px-6 text-center space-y-4">
    <p className="text-xs font-black uppercase tracking-widest text-black/30">{label}</p>
    {action}
  </div>
);
