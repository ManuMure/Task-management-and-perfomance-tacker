"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

interface ActionsMenuProps {
  label?: string;
  children: (close: () => void) => ReactNode;
  onClose?: () => void;
}

export default function ActionsMenu({
  label = "Actions",
  children,
  onClose,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect =
      buttonRef.current.getBoundingClientRect();

    const menuWidth = 200;
    const menuHeight =
      menuRef.current?.offsetHeight ?? 300;

    const gap = 6;
    const padding = 8;

    const spaceBelow =
      window.innerHeight - buttonRect.bottom;

    const spaceAbove = buttonRect.top;

    let top: number;

    /*
     * Open below the button when there is enough
     * space available.
     */
    if (spaceBelow >= menuHeight + gap) {
      top = buttonRect.bottom + gap;
    }

    /*
     * Otherwise open above the button.
     */
    else if (spaceAbove >= menuHeight + gap) {
      top = buttonRect.top - menuHeight - gap;
    }

    /*
     * If there isn't enough room above or below,
     * keep the menu inside the viewport.
     */
    else {
      top = Math.max(
        padding,
        Math.min(
          buttonRect.bottom + gap,
          window.innerHeight -
            menuHeight -
            padding
        )
      );
    }

    /*
     * Align the right edge of the menu with
     * the right edge of the action button.
     */
    let left =
      buttonRect.right - menuWidth;

    /*
     * Prevent menu from going off the left side.
     */
    if (left < padding) {
      left = padding;
    }

    /*
     * Prevent menu from going off the right side.
     */
    if (
      left + menuWidth >
      window.innerWidth - padding
    ) {
      left =
        window.innerWidth -
        menuWidth -
        padding;
    }

    setPosition({
      top,
      left,
    });
  };

  /*
   * Handle outside clicks, Escape key,
   * scrolling and resizing.
   */
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      close();
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const handleReposition = () => {
      updatePosition();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    window.addEventListener(
      "resize",
      handleReposition
    );

    window.addEventListener(
      "scroll",
      handleReposition,
      true
    );

    /*
     * Wait until the menu has rendered so that
     * offsetHeight is available.
     */
    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      cancelAnimationFrame(frame);

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      window.removeEventListener(
        "resize",
        handleReposition
      );

      window.removeEventListener(
        "scroll",
        handleReposition,
        true
      );
    };
  }, [open]);

  return (
    <>
      {/* ACTION BUTTON */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            close();
          } else {
            setOpen(true);
          }
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreVertical size={18} />
      </button>

      {/* DROPDOWN MENU */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-9999 w-50 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {children(close)}
          </div>,
          document.body
        )}
    </>
  );
}