import { useMemo, useState, type ReactNode } from "react";
import { getTrashedPages, matchesSearch, sortPages } from "../lib/pageUtils";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useAppView } from "../hooks/useAppView";
import { useActivePages, usePageStore } from "../store/pageStore";
import { PageListItem } from "./PageListItem";

export function Sidebar() {
  const activePages = useActivePages();
  const pages = usePageStore((state) => state.pages);
  const activePageId = usePageStore((state) => state.activePageId);
  const sidebarSort = usePageStore((state) => state.sidebarSort);
  const sidebarCollapsed = usePageStore((state) => state.sidebarCollapsed);
  const setSidebarSort = usePageStore((state) => state.setSidebarSort);
  const toggleSidebarCollapsed = usePageStore((state) => state.toggleSidebarCollapsed);

  const view = useAppView();
  const { toPage, toLibrary, toTrash, toEditorHome, createPage } = useAppNavigate();

  const [search, setSearch] = useState("");

  const trashedCount = getTrashedPages(pages).length;

  const filteredPages = useMemo(() => {
    const sorted = sortPages(activePages, sidebarSort);
    return sorted.filter((page) => matchesSearch(page, search));
  }, [activePages, sidebarSort, search]);

  const favoritePages = useMemo(
    () => filteredPages.filter((page) => page.favorited),
    [filteredPages],
  );

  const recentPages = useMemo(
    () => filteredPages.filter((page) => !page.favorited),
    [filteredPages],
  );

  if (sidebarCollapsed) {
    return (
      <aside className="flex h-full w-14 shrink-0 flex-col items-center border-r border-neutral-200 bg-white py-3">
        <IconButton label="Expand sidebar" onClick={toggleSidebarCollapsed}>
          »
        </IconButton>

        <div className="mt-4 flex flex-1 flex-col items-center gap-2">
          <IconButton label="Library" active={view === "library"} onClick={toLibrary}>
            Lib
          </IconButton>
        </div>

        <IconButton
          label={`Trash${trashedCount > 0 ? ` (${trashedCount})` : ""}`}
          active={view === "trash"}
          onClick={toTrash}
        >
          <TrashIcon />
        </IconButton>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-200">
      <div className="border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="min-w-0 truncate text-sm font-semibold text-neutral-900">
            WingRep Notes
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={createPage}
              className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="New page"
            >
              + New
            </button>
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="rounded-md px-2 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              «
            </button>
          </div>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search pages…"
          className="mt-3 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
        />
        <p className="mt-1.5 text-[11px] text-neutral-400">⌘K quick search</p>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 px-2 py-2">
        <NavButton active={view === "editor"} onClick={toEditorHome} label="Pages" />
        <NavButton active={view === "library"} onClick={toLibrary} label="Library" />
      </div>

      {view === "editor" && (
        <>
          <div className="flex items-center justify-end px-4 py-2">
            <select
              value={sidebarSort}
              onChange={(event) =>
                setSidebarSort(event.target.value as "recent" | "alphabetical")
              }
              className="rounded border-none bg-transparent text-xs text-neutral-500 outline-none"
              aria-label="Sort pages"
            >
              <option value="recent">Last edited</option>
              <option value="alphabetical">A–Z</option>
            </select>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            {filteredPages.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-neutral-400">
                {search ? "No pages match your search" : "No pages yet"}
              </p>
            ) : (
              <>
                {favoritePages.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                      Favorites
                    </p>
                    <ul className="space-y-0.5">
                      {favoritePages.map((page) => (
                        <PageListItem
                          key={page.id}
                          page={page}
                          isActive={page.id === activePageId && view === "editor"}
                          onOpen={() => toPage(page.id)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
                {recentPages.length > 0 && (
                  <div>
                    {favoritePages.length > 0 && (
                      <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                        Recent
                      </p>
                    )}
                    <ul className="space-y-0.5">
                      {recentPages.map((page) => (
                        <PageListItem
                          key={page.id}
                          page={page}
                          isActive={page.id === activePageId && view === "editor"}
                          onOpen={() => toPage(page.id)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </nav>
        </>
      )}

      {view === "library" && (
        <div className="flex-1 px-4 py-3">
          <p className="text-xs leading-relaxed text-neutral-500">
            Browse all pages in table view with search, sort, and property toggles.
          </p>
        </div>
      )}

      <div className="border-t border-neutral-200 p-2">
        <button
          type="button"
          onClick={toTrash}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
            view === "trash"
              ? "bg-neutral-100 font-medium text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <TrashIcon />
            Trash
          </span>
          {trashedCount > 0 && (
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
              {trashedCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
      }`}
    >
      {label}
    </button>
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
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function IconButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-md text-sm transition ${
        active
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      {children}
    </button>
  );
}
