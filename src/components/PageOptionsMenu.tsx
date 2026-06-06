import { useEffect, useRef, type RefObject } from "react";

interface PageOptionsMenuProps {
  open: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
}

export function PageOptionsMenu({
  open,
  onClose,
  onRename,
  onDelete,
  anchorRef,
  className = "right-0",
}: PageOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute top-full z-20 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg ${className}`}
      role="menu"
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onRename();
          onClose();
        }}
        className="flex w-full px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-50"
      >
        Rename
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex w-full px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
      >
        Move to trash
      </button>
    </div>
  );
}
