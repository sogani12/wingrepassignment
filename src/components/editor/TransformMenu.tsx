import { useEffect, useRef } from "react";
import { BUILTIN_TRANSFORMS } from "../../lib/transformPresets";
import {
  customTransformToDefinition,
  useTransformStore,
} from "../../store/transformStore";
import type { CustomTransform } from "../../types/transform";
import { useTransformContext } from "./TransformContext";

function TransformMenuItem({
  label,
  summary,
  onClick,
  onEdit,
  onDelete,
}: {
  label: string;
  summary: string;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="group flex items-center gap-1">
      <button
        type="button"
        title={summary}
        onClick={onClick}
        className="flex min-w-0 flex-1 rounded-md px-2.5 py-2 text-left text-sm text-neutral-800 transition hover:bg-neutral-100"
      >
        <span className="truncate">{label}</span>
      </button>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              aria-label={`Edit ${label}`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="rounded px-1.5 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              aria-label={`Delete ${label}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded px-1.5 py-1 text-xs text-red-500 transition hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function TransformMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    menuOpen,
    menuAnchor,
    closeMenu,
    isTransforming,
    runTransform,
    openCreateModal,
    openEditModal,
  } = useTransformContext();

  const customTransforms = useTransformStore((state) => state.customTransforms);
  const deleteCustomTransform = useTransformStore(
    (state) => state.deleteCustomTransform,
  );

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }
      closeMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, closeMenu]);

  if (!menuOpen || !menuAnchor) {
    return null;
  }

  const top = menuAnchor.bottom + window.scrollY + 8;
  const left = menuAnchor.left + window.scrollX;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-72 rounded-xl border border-neutral-200 bg-white py-2 shadow-xl"
      style={{ top, left }}
      role="menu"
      aria-label="Transform options"
    >
      <div className="px-3 pb-1 pt-1">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Presets
        </p>
      </div>
      {BUILTIN_TRANSFORMS.map((transform) => (
        <TransformMenuItem
          key={transform.id}
          label={transform.name}
          summary={transform.summary}
          onClick={() => runTransform(transform)}
        />
      ))}

      {customTransforms.length > 0 && (
        <>
          <div className="mx-3 my-2 border-t border-neutral-100" />
          <div className="px-3 pb-1">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Your transforms
            </p>
          </div>
          {customTransforms.map((transform: CustomTransform) => (
            <TransformMenuItem
              key={transform.id}
              label={transform.name}
              summary={transform.summary}
              onClick={() =>
                runTransform(customTransformToDefinition(transform))
              }
              onEdit={() => openEditModal(transform)}
              onDelete={() => deleteCustomTransform(transform.id)}
            />
          ))}
        </>
      )}

      <div className="mx-3 my-2 border-t border-neutral-100" />
      <button
        type="button"
        disabled={isTransforming}
        onClick={openCreateModal}
        className="mx-2 flex w-[calc(100%-1rem)] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
      >
        + New transform
      </button>
    </div>
  );
}
