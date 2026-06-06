import { useEffect, useRef, type ReactNode, type RefObject } from "react";

interface PageOptionsMenuProps {
  open: boolean;
  onClose: () => void;
  onRename: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isFavorited: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
}

export function PageOptionsMenu({
  open,
  onClose,
  onRename,
  onToggleFavorite,
  onDelete,
  isFavorited,
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
      className={`absolute top-full z-20 mt-1 w-52 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg ${className}`}
      role="menu"
    >
      <MenuItem
        icon={<PencilIcon />}
        label="Rename"
        onClick={() => {
          onRename();
          onClose();
        }}
      />
      <MenuItem
        icon={<StarIcon filled={isFavorited} />}
        label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        onClick={() => {
          onToggleFavorite();
          onClose();
        }}
      />
      <MenuItem
        icon={<TrashIcon />}
        label="Move to trash"
        variant="danger"
        onClick={() => {
          onDelete();
          onClose();
        }}
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-50"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center ${
          variant === "danger" ? "text-red-500" : "text-neutral-400"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01Z" />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
