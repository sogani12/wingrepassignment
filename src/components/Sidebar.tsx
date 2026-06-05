import { usePageStore } from "../store/pageStore";

export function Sidebar() {
  const pages = usePageStore((state) => state.pages);
  const activePageId = usePageStore((state) => state.activePageId);
  const setActivePage = usePageStore((state) => state.setActivePage);
  const createNewPage = usePageStore((state) => state.createNewPage);
  const deletePage = usePageStore((state) => state.deletePage);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
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

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {pages.map((page) => {
            const isActive = page.id === activePageId;

            return (
              <li key={page.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePage(page.id)}
                  className={`min-w-0 flex-1 truncate rounded-md px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-neutral-100 font-medium text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {page.title || "Untitled"}
                </button>
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deletePage(page.id)}
                    className="rounded px-2 py-1 text-xs text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${page.title}`}
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
