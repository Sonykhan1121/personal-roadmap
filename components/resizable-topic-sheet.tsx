'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- This focusable separator is a window splitter, not a document divider. */

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { SheetContent } from '@/components/ui/sheet';

const DEFAULT_WIDTH = 680;
const MIN_WIDTH = 420;
const MAX_WIDTH = 1200;
const STORAGE_KEY = 'nextchapter:topic-drawer-width';

function readPreferredWidth() {
  if (typeof window === 'undefined') return DEFAULT_WIDTH;
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved >= MIN_WIDTH && saved <= MAX_WIDTH)
      return saved;
  } catch {
    // Resizing still works when browser storage is unavailable.
  }
  return DEFAULT_WIDTH;
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}
const readViewport = () => window.innerWidth;
const serverViewport = () => 1024;

export function ResizableTopicSheet({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) {
  const [preferredWidth, setPreferredWidth] = useState(readPreferredWidth);
  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    readViewport,
    serverViewport,
  );
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startWidth: number;
    lastWidth: number;
  } | null>(null);

  useEffect(() => {
    if (open) return;
    // Escape or an external close can remove the handle during a drag.
    if (drag.current) {
      try {
        localStorage.setItem(STORAGE_KEY, String(drag.current.lastWidth));
      } catch {
        // Keep the in-memory preference if storage is unavailable.
      }
    }
    drag.current = null;
  }, [open]);

  const mobile = viewportWidth <= 640;
  const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, viewportWidth - 48));
  const width = mobile ? viewportWidth : Math.min(preferredWidth, maxWidth);
  const clamp = (value: number) =>
    Math.round(Math.min(maxWidth, Math.max(MIN_WIDTH, value)));

  function remember(value: number) {
    setPreferredWidth(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // A browser preference must never block opening or saving a lesson.
    }
  }

  function finishResize() {
    if (!drag.current) return;
    remember(drag.current.lastWidth);
    drag.current = null;
  }

  return (
    <SheetContent
      id="topic-drawer-content"
      className="topic-sheet"
      style={{ '--topic-drawer-width': `${width}px` } as CSSProperties}
    >
      <div
        role="separator"
        className="drawer-resize-handle"
        tabIndex={mobile ? -1 : 0}
        aria-label="Resize topic drawer"
        aria-controls="topic-drawer-content"
        aria-describedby="drawer-resize-help"
        aria-orientation="vertical"
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={maxWidth}
        aria-valuenow={mobile ? MIN_WIDTH : width}
        aria-valuetext={`${width} pixels wide`}
        title="Drag to resize · Double-click to reset"
        onPointerDown={(event) => {
          if (mobile || event.button !== 0 || !event.isPrimary) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startWidth: width,
            lastWidth: width,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.pointerId !== event.pointerId)
            return;
          const next = clamp(
            drag.current.startWidth + drag.current.startX - event.clientX,
          );
          drag.current.lastWidth = next;
          setPreferredWidth(next);
        }}
        onPointerUp={finishResize}
        onPointerCancel={finishResize}
        onLostPointerCapture={finishResize}
        onDoubleClick={() => remember(clamp(DEFAULT_WIDTH))}
        onKeyDown={(event) => {
          const next = {
            ArrowLeft: width + 24,
            ArrowRight: width - 24,
            Home: MIN_WIDTH,
            End: maxWidth,
          }[event.key];
          if (next === undefined) return;
          event.preventDefault();
          remember(clamp(next));
        }}
      >
        <span aria-hidden="true" />
      </div>
      <span id="drawer-resize-help" className="sr-only">
        Drag the left edge or use the left and right arrow keys to resize.
        Double-click to reset the width.
      </span>
      {children}
    </SheetContent>
  );
}
