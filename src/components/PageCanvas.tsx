import { useEffect, useRef } from "react";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { getActivePage, usePageStore } from "../store/pageStore";
import { EmptyState } from "./EmptyState";
import { PageEditor } from "./PageEditor";

export function PageCanvas() {
  const pages = usePageStore((state) => state.pages);
  const activePageId = usePageStore((state) => state.activePageId);
  const focusTarget = usePageStore((state) => state.focusTarget);
  const renamePage = usePageStore((state) => state.renamePage);
  const { createPage } = useAppNavigate();
  const clearFocusTarget = usePageStore((state) => state.clearFocusTarget);

  const titleRef = useRef<HTMLInputElement>(null);
  const activePage = getActivePage(pages, activePageId);

  useEffect(() => {
    if (focusTarget === "title") {
      titleRef.current?.focus();
      if (activePage?.title) {
        titleRef.current?.select();
      }
      clearFocusTarget();
    }
  }, [focusTarget, activePage?.id, activePage?.title, clearFocusTarget]);

  if (!activePage) {
    return (
      <EmptyState
        title="No pages yet"
        description="Create a page to start writing, or restore one from trash."
        actionLabel="Create page"
        onAction={createPage}
      />
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-3xl px-8 py-10">
        <input
          ref={titleRef}
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
