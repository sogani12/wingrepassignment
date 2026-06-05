import { getActivePage, usePageStore } from "../store/pageStore";
import { PageEditor } from "./PageEditor";

export function PageCanvas() {
  const pages = usePageStore((state) => state.pages);
  const activePageId = usePageStore((state) => state.activePageId);
  const hydrated = usePageStore((state) => state.hydrated);
  const renamePage = usePageStore((state) => state.renamePage);

  const activePage = getActivePage(pages, activePageId);

  if (!hydrated) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-neutral-500">
        Loading…
      </main>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-8 py-10">
        <input
          type="text"
          value={activePage.title}
          onChange={(event) => renamePage(activePage.id, event.target.value)}
          placeholder="Untitled"
          className="mb-6 w-full border-none bg-transparent text-4xl font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
        />
        <PageEditor key={activePage.id} page={activePage} />
      </div>
    </main>
  );
}
