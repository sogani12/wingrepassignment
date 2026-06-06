import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Page } from "../types/page";
import {
  formatDate,
  formatRelativeTime,
  getPageDisplayTitle,
  getPagePreview,
} from "../lib/pageUtils";
import type { LibraryPropertyVisibility } from "../types/page";
import { usePageActions } from "../hooks/usePageActions";
import { PageOptionsMenu } from "./PageOptionsMenu";

interface LibraryPageRowProps {
  page: Page;
  columns: LibraryPropertyVisibility;
  onOpen: () => void;
}

export function LibraryPageRow({ page, columns, onOpen }: LibraryPageRowProps) {
  const { moveToTrash, rename } = usePageActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(page.title);
  const rowRef = useRef<HTMLTableRowElement>(null);
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

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    openMenu();
  };

  return (
    <tr
      ref={rowRef}
      className="group relative border-b border-neutral-100 transition hover:bg-white"
      onContextMenu={handleContextMenu}
    >
      <td className="px-4 py-3 font-medium text-neutral-900">
        {renaming ? (
          <input
            ref={renameRef}
            type="text"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") commitRename();
              if (event.key === "Escape") setRenaming(false);
            }}
            onClick={(event) => event.stopPropagation()}
            placeholder="Untitled"
            className="w-full rounded border border-neutral-200 px-2 py-1 text-sm outline-none focus:border-neutral-400"
          />
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="w-full text-left"
          >
            {getPageDisplayTitle(page.title)}
          </button>
        )}
      </td>
      {columns.preview && (
        <td
          className="max-w-xs cursor-pointer truncate px-4 py-3 text-neutral-500"
          onClick={onOpen}
        >
          {getPagePreview(page.content) || "—"}
        </td>
      )}
      {columns.lastEdited && (
        <td
          className="cursor-pointer px-4 py-3 text-neutral-500"
          title={formatDate(page.updatedAt)}
          onClick={onOpen}
        >
          {formatRelativeTime(page.updatedAt)}
        </td>
      )}
      {columns.created && (
        <td className="cursor-pointer px-4 py-3 text-neutral-500" onClick={onOpen}>
          {formatDate(page.createdAt)}
        </td>
      )}
      <td className="relative w-12 px-2 py-3">
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
          onDelete={() => moveToTrash(page.id)}
          anchorRef={rowRef}
          className="right-0"
        />
      </td>
    </tr>
  );
}
