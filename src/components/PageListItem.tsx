import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Page } from "../types/page";
import { formatRelativeTime, getPageDisplayTitle } from "../lib/pageUtils";
import { usePageActions } from "../hooks/usePageActions";
import { PageOptionsMenu } from "./PageOptionsMenu";

interface PageListItemProps {
  page: Page;
  isActive: boolean;
  onOpen: () => void;
}

export function PageListItem({ page, isActive, onOpen }: PageListItemProps) {
  const { moveToTrash, rename, toggleFavorite } = usePageActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(page.title);
  const rowRef = useRef<HTMLLIElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) {
      renameRef.current?.focus();
      renameRef.current?.select();
    }
  }, [renaming]);

  useEffect(() => {
    if (!renaming) setRenameValue(page.title);
  }, [page.title, renaming]);

  const openMenu = () => setMenuOpen(true);

  const commitRename = () => {
    rename(page.id, renameValue);
    setRenaming(false);
  };

  if (renaming) {
    return (
      <li className="px-2 py-1">
        <input
          ref={renameRef}
          type="text"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitRename();
            if (event.key === "Escape") setRenaming(false);
          }}
          placeholder="Untitled"
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </li>
    );
  }

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    openMenu();
  };

  return (
    <li
      ref={rowRef}
      className="group relative flex items-center gap-1"
      onContextMenu={handleContextMenu}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`min-w-0 flex-1 rounded-md px-3 py-2 text-left transition ${
          isActive
            ? "bg-neutral-100 font-medium text-neutral-900"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        }`}
      >
        <span className="block truncate text-sm">{getPageDisplayTitle(page.title)}</span>
        <span className="block truncate text-xs text-neutral-400">
          {formatRelativeTime(page.updatedAt)}
        </span>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((open) => !open);
        }}
        title="Rename or move to trash"
        aria-label={`Options for ${getPageDisplayTitle(page.title)}`}
        className="rounded px-2 py-1 text-sm text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-700 data-[open=true]:opacity-100"
        data-open={menuOpen}
      >
        ⋯
      </button>
      <PageOptionsMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRename={() => setRenaming(true)}
        onToggleFavorite={() => toggleFavorite(page.id)}
        onDelete={() => moveToTrash(page.id)}
        isFavorited={page.favorited}
        anchorRef={rowRef}
        className="left-2 right-auto"
      />
    </li>
  );
}
