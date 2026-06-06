import { useEffect, useMemo, useRef, useState } from "react";
import { getActivePages, matchesSearch } from "../lib/pageUtils";
import type { LibrarySortKey, Page } from "../types/page";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { usePageStore } from "../store/pageStore";
import { EmptyState } from "./EmptyState";
import { LibraryPageRow } from "./LibraryPageRow";

export function LibraryView() {
  const pages = usePageStore((state) => state.pages);
  const librarySearch = usePageStore((state) => state.librarySearch);
  const librarySortKey = usePageStore((state) => state.librarySortKey);
  const librarySortDir = usePageStore((state) => state.librarySortDir);
  const libraryColumns = usePageStore((state) => state.libraryColumns);
  const setLibrarySearch = usePageStore((state) => state.setLibrarySearch);
  const setLibrarySort = usePageStore((state) => state.setLibrarySort);
  const toggleLibraryProperty = usePageStore((state) => state.toggleLibraryProperty);
  const { toPage, createPage } = useAppNavigate();

  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const propertiesRef = useRef<HTMLDivElement>(null);

  const activePages = getActivePages(pages);

  const displayedPages = useMemo(() => {
    const filtered = activePages.filter((page) => matchesSearch(page, librarySearch));
    return [...filtered].sort((a, b) => comparePages(a, b, librarySortKey, librarySortDir));
  }, [activePages, librarySearch, librarySortKey, librarySortDir]);

  useEffect(() => {
    if (!propertiesOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        propertiesRef.current &&
        !propertiesRef.current.contains(event.target as Node)
      ) {
        setPropertiesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [propertiesOpen]);

  function handleSort(key: LibrarySortKey) {
    if (librarySortKey === key) {
      setLibrarySort(key, librarySortDir === "asc" ? "desc" : "asc");
      return;
    }
    setLibrarySort(key, key === "title" ? "asc" : "desc");
  }

  if (activePages.length === 0) {
    return (
      <EmptyState
        title="No pages yet"
        description="Create your first page to see it in the library."
        actionLabel="Create page"
        onAction={createPage}
      />
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-neutral-900">Library</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {displayedPages.length} page{displayedPages.length === 1 ? "" : "s"}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={librarySearch}
            onChange={(event) => setLibrarySearch(event.target.value)}
            placeholder="Search by title or content…"
            className="min-w-64 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />

          <div ref={propertiesRef} className="relative">
            <button
              type="button"
              onClick={() => setPropertiesOpen((open) => !open)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              Properties
            </button>
            {propertiesOpen && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
                <PropertyToggle
                  label="Preview"
                  checked={libraryColumns.preview}
                  onChange={() => toggleLibraryProperty("preview")}
                />
                <PropertyToggle
                  label="Last edited"
                  checked={libraryColumns.lastEdited}
                  onChange={() => toggleLibraryProperty("lastEdited")}
                />
                <PropertyToggle
                  label="Created"
                  checked={libraryColumns.created}
                  onChange={() => toggleLibraryProperty("created")}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {displayedPages.length === 0 ? (
        <EmptyState
          title="No results"
          description="Try a different search term."
        />
      ) : (
        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
                <SortableHeader
                  label="Title"
                  active={librarySortKey === "title"}
                  dir={librarySortDir}
                  onClick={() => handleSort("title")}
                />
                {libraryColumns.preview && <th className="px-4 py-3 font-medium">Preview</th>}
                {libraryColumns.lastEdited && (
                  <SortableHeader
                    label="Last edited"
                    active={librarySortKey === "updatedAt"}
                    dir={librarySortDir}
                    onClick={() => handleSort("updatedAt")}
                  />
                )}
                {libraryColumns.created && (
                  <SortableHeader
                    label="Created"
                    active={librarySortKey === "createdAt"}
                    dir={librarySortDir}
                    onClick={() => handleSort("createdAt")}
                  />
                )}
                <th className="w-12 px-2 py-3" aria-label="Page options" />
              </tr>
            </thead>
            <tbody>
              {displayedPages.map((page) => (
                <LibraryPageRow
                  key={page.id}
                  page={page}
                  columns={libraryColumns}
                  onOpen={() => toPage(page.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function comparePages(
  a: Page,
  b: Page,
  key: LibrarySortKey,
  dir: "asc" | "desc",
): number {
  let result = 0;
  if (key === "title") {
    result = (a.title || "Untitled").localeCompare(b.title || "Untitled");
  } else {
    result = new Date(a[key]).getTime() - new Date(b[key]).getTime();
  }
  return dir === "asc" ? result : -result;
}

function SortableHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 hover:text-neutral-600"
      >
        {label}
        {active && <span className="text-neutral-500">{dir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}

function PropertyToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="rounded" />
      {label}
    </label>
  );
}
