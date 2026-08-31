'use client';

import React from 'react';
import { Button } from './primitives';

/**
 * Structural pieces every admin page composes from, so all 14 pages share one
 * header shape, one panel shape, one row shape and one editor shape.
 */

/* ----------------------------------------------------------- page header -- */

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <header className="border-b-2 border-black pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none break-words">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-black/40">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </header>
);

/* ----------------------------------------------------------------- panel -- */

export const Panel: React.FC<{
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  /** Removes body padding, for panels that hold a flush list. */
  flush?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, actions, flush, children, className = '' }) => (
  <section className={`border-2 border-black bg-white ${className}`}>
    {(title || actions) && (
      <div className="border-b-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-2 bg-gray-50">
        <div className="min-w-0">
          {title && (
            <h2 className="text-[11px] font-black uppercase tracking-widest leading-none">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-black/35">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={flush ? '' : 'p-4 sm:p-5'}>{children}</div>
  </section>
);

/* ------------------------------------------------------------- form grid -- */

export const FormGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>{children}</div>;

/* ---------------------------------------------------------- editor shell -- */

/**
 * Wraps every create/edit form: a titled header with Cancel, the fields, and a
 * sticky action bar so Save is reachable without scrolling to the bottom.
 */
export const EditorShell: React.FC<{
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  extraActions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, onCancel, onSave, saving, saveLabel = 'SAVE', extraActions, children }) => (
  <div className="space-y-5 animate-in fade-in duration-200">
    <PageHeader
      title={title}
      actions={
        <>
          {extraActions}
          <Button variant="ghost" onClick={onCancel}>
            CANCEL
          </Button>
        </>
      }
    />

    <div className="space-y-5">{children}</div>

    <div className="sticky bottom-0 -mx-4 sm:-mx-5 border-t-2 border-black bg-white/95 backdrop-blur px-4 sm:px-5 py-3 flex items-center justify-end gap-2">
      <Button variant="ghost" onClick={onCancel}>
        CANCEL
      </Button>
      <Button variant="accent" onClick={onSave} disabled={saving}>
        {saving ? 'SAVING...' : saveLabel}
      </Button>
    </div>
  </div>
);

/* -------------------------------------------------------------- list row -- */

/**
 * One record in a list. Media and actions are optional; on narrow screens the
 * actions wrap under the content instead of squeezing it.
 */
export const ListRow: React.FC<{
  media?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  dimmed?: boolean;
}> = ({ media, eyebrow, title, meta, actions, dimmed }) => (
  <div
    className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-white transition-opacity ${
      dimmed ? 'opacity-45' : ''
    }`}
  >
    {media && <div className="shrink-0">{media}</div>}

    <div className="min-w-0 flex-1">
      {eyebrow && (
        <div className="text-[9px] font-black uppercase tracking-widest text-[#FF5F1F] mb-0.5">{eyebrow}</div>
      )}
      <div className="text-sm font-black uppercase tracking-tight leading-snug break-words">{title}</div>
      {meta && <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-black/40">{meta}</div>}
    </div>

    {actions && <div className="flex flex-wrap items-center gap-1.5 shrink-0">{actions}</div>}
  </div>
);

/** Bordered container that divides its children into rows. */
export const ListPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-2 border-black divide-y-2 divide-black bg-white">{children}</div>
);

/* ------------------------------------------------------------- stat card -- */

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: string;
  highlight?: boolean;
}> = ({ label, value, hint, highlight }) => (
  <div
    className={`border-2 border-black p-4 flex flex-col justify-between gap-3 ${
      highlight ? 'bg-[#FF5F1F] text-white' : 'bg-white'
    }`}
  >
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${
        highlight ? 'text-white/80' : 'text-black/40'
      }`}
    >
      {label}
    </span>
    <span className="text-3xl sm:text-4xl font-black leading-none tabular-nums">{value}</span>
    {hint && (
      <span className={`text-[9px] font-black uppercase tracking-widest ${highlight ? 'text-white/70' : 'text-black/30'}`}>
        {hint}
      </span>
    )}
  </div>
);

/** Label / value line used inside metric panels. */
export const MetricRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-[11px] font-black uppercase tracking-wide">
    <span className="text-black/40">{label}</span>
    <span className="tabular-nums">{value}</span>
  </div>
);
