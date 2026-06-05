import { useMemo, useState } from "react";
import { formatRelativeTime, getTrashedPages, matchesSearch, sortPages } from "../lib/pageUtils";
import { useActivePages, usePageStore } from "../store/pageStore";
import { ConfirmModal } from "./ConfirmModal";

export function Sidebar() {
  const activePages = useActivePages();
  const pages = usePageStore((state) => state.pages);
  const activePageId = usePageStore((state) => state.activePageId);
  const view = usePageStore((state) => state.view);
  const sidebarSort = usePageStore((state) => state.sidebarSort);
  const setActivePage = usePageStore((state) => state.setActivePage);
  const createNewPage = usePageStore((state) => state.createNewPage);
  const trashPage = usePageStore((state) => state.trashPage);
  const setView = usePageStore((state) => state.setView);
  const setSidebarSort = usePageStore((state) => state.setSidebarSort);

  const [search, setSearch] = useState("");
  const [pendingTrashId, setPendingTrashId] = useState<string | null>(null);

  const trashedCount = getTrashedPages(pages).length;

  const filteredPages = useMemo(() => {
    const sorted = sortPages(activePages, sidebarSort);
    return sorted.filter((page) => matchesSearch(page, search));
  }, [activePages, sidebarSort, search]);

  const pendingPage = pages.find((page) => page.id === pendingTrashId);

  return (
    <>
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-neutral-900">WingRep Notes</h1>
            <button
              type="button"
              onClick={createNewPage}
              className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="New page"
            >
              + New
            </button>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pages…"
            className="mt-3 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
          />
        </div>

        <div className="flex gap-1 border-b border-neutral-200 px-2 py-2">
          <NavButton
            active={view === "editor"}
            onClick={() => setView("editor")}
            label="Pages"
          />
          <NavButton
            active={view === "library"}
            onClick={() => setView("library")}
            label="Library"
          />
        </div>

        {view === "editor" && (
          <>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                Recent
              </span>
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
                <ul className="space-y-0.5">
                  {filteredPages.map((page) => {
                    const isActive = page.id === activePageId && view === "editor";

                    return (
                      <li key={page.id} className="group flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActivePage(page.id)}
                          className={`min-w-0 flex-1 rounded-md px-3 py-2 text-left transition ${
                            isActive
                              ? "bg-neutral-100 font-medium text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          }`}
                        >
                          <span className="block truncate text-sm">
                            {page.title || "Untitled"}
                          </span>
                          <span className="block truncate text-xs text-neutral-400">
                            {formatRelativeTime(page.updatedAt)}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingTrashId(page.id)}
                          className="rounded px-2 py-1 text-xs text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Move ${page.title || "Untitled"} to trash`}
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </nav>
          </>
        )}

        {view === "library" && (
          <div className="flex-1 px-4 py-3">
            <p className="text-xs leading-relaxed text-neutral-500">
              Browse all pages in table view with search, sort, and column toggles.
            </p>
          </div>
        )}

        <div className="border-t border-neutral-200 p-2">
          <button
            type="button"
            onClick={() => setView("trash")}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
              view === "trash"
                ? "bg-neutral-100 font-medium text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>Trash</span>
            {trashedCount > 0 && (
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
                {trashedCount}
              </span>
            )}
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={pendingTrashId !== null}
        title="Move to trash?"
        message={
          pendingPage
            ? `"${pendingPage.title || "Untitled"}" will be moved to trash. You can restore it within 30 days.`
            : "This page will be moved to trash."
        }
        confirmLabel="Move to trash"
        destructive
        onConfirm={() => {
          if (pendingTrashId) trashPage(pendingTrashId);
          setPendingTrashId(null);
        }}
        onCancel={() => setPendingTrashId(null)}
      />
    </>
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
