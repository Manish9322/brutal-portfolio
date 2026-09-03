'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from './primitives';

/**
 * Confirmation modal for destructive admin actions.
 *
 * Replaces `window.confirm` where the consequence needs explaining: a native
 * dialog cannot show which asset is about to go, and its one line of text is
 * easy to click past. Removing an image deletes it from Cloudinary immediately
 * — before the record is saved — so this is the only place that warning can be
 * made before the fact.
 *
 * Cancel takes initial focus rather than confirm: for a destructive action the
 * safe option should be the one a stray Enter lands on.
 */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  /** Thumbnail of the asset in question, so there is no doubt which one it is. */
  previewUrl?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  previewUrl,
  confirmLabel = 'REMOVE',
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
}) => {
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    // Cancel is the first button in the panel; Button is not a forwardRef
    // component, so it is reached through the DOM rather than a ref.
    panel.current?.querySelector('button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }
      // Keep Tab inside the dialog; behind it sits a whole editor form.
      if (e.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        ref={panel}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-150"
      >
        <div className="border-b-2 border-black bg-black px-4 py-3">
          <h2 id="confirm-title" className="text-xs font-black uppercase tracking-widest text-white">
            {title}
          </h2>
        </div>

        <div className="p-4 space-y-3">
          {previewUrl && (
            <div className="border-2 border-black bg-gray-100 aspect-video overflow-hidden">
              <img src={previewUrl} alt="" className="w-full h-full object-contain" decoding="async" />
            </div>
          )}
          {message && (
            <div className="text-[11px] font-bold uppercase leading-relaxed tracking-wide text-black/60">
              {message}
            </div>
          )}
        </div>

        <div className="flex divide-x-2 divide-black border-t-2 border-black">
          <Button variant="ghost" block onClick={onCancel} className="border-0">
            {cancelLabel}
          </Button>
          <Button variant="danger" block onClick={onConfirm} className="border-0">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
