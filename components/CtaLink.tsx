import React from 'react';
import Link from 'next/link';

const BASE =
  'group inline-flex items-center justify-center gap-3 text-center border-4 ' +
  'px-6 sm:px-10 md:px-12 py-4 md:py-6 ' +
  'text-sm sm:text-base md:text-lg font-black uppercase tracking-wider md:tracking-widest ' +
  'break-words transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0';

const VARIANTS = {
  /** Filled: the primary route onward. */
  primary:
    'border-black bg-black text-white hover:bg-[#FF5F1F] hover:border-[#FF5F1F] ' +
    'hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
  /** Outlined: the secondary option. */
  secondary:
    'border-black bg-white text-black hover:bg-black hover:text-white ' +
    'hover:shadow-[8px_8px_0px_0px_rgba(255,95,31,1)]',
} as const;

interface CtaLinkProps {
  href: string;
  variant?: keyof typeof VARIANTS;
  arrow?: 'left' | 'right' | 'none';
  children: React.ReactNode;
  className?: string;
}

const CtaLink: React.FC<CtaLinkProps> = ({
  href,
  variant = 'secondary',
  arrow = 'none',
  children,
  className = '',
}) => (
  <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
    {arrow === 'left' && (
      <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
        ←
      </span>
    )}
    {children}
    {arrow === 'right' && (
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    )}
  </Link>
);

export default CtaLink;
