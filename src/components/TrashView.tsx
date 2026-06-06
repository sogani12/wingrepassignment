import { useState } from "react";
import { TRASH_RETENTION_DAYS, daysUntilPurge, formatDate, getTrashedPages } from "../lib/pageUtils";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { usePageStore } from "../store/pageStore";
import { ConfirmModal } from "./ConfirmModal";
import { EmptyState } from "./EmptyState";

export function TrashView() {
  const pages = usePageStore((state) => state.pages);
  const { restorePage } = useAppNavigate();
  const permanentDeletePage = usePageStore((state) => state.permanentDeletePage);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const trashedPages = getTrashedPages(pages).sort(
    (a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime(),
  );

  const pendingPage = pages.find((page) => page.id === pendingDeleteId);

  if (trashedPages.length === 0) {
    return (
      <EmptyState
        title="Trash is empty"
        description={`Deleted pages are kept for ${TRASH_RETENTION_DAYS} days before being permanently removed.`}
      />
    );
  }

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50">
        <header className="border-b border-neutral-200 bg-white px-8 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">Trash</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Pages are permanently deleted after {TRASH_RETENTION_DAYS} days in trash.
          </p>
        </header>

        <div className="flex-1 overflow-auto px-8 py-4">
          <ul className="space-y-2">
            {trashedPages.map((page) => (
              <li
                key={page.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">
                    {page.title || "Untitled"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Deleted {formatDate(page.deletedAt!)} ·{" "}
                    {daysUntilPurge(page.deletedAt!)} days until permanent deletion
                  </p>
                </div>
                <div className="ml-4 flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => restorePage(page.id)}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(page.id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete forever
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete forever?"
        message={
          pendingPage
            ? `"${pendingPage.title || "Untitled"}" will be permanently deleted. This cannot be undone.`
            : "This page will be permanently deleted."
        }
        confirmLabel="Delete forever"
        destructive
        onConfirm={() => {
          if (pendingDeleteId) permanentDeletePage(pendingDeleteId);
          setPendingDeleteId(null);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
