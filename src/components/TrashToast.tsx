import { useEffect } from "react";
import { usePageActions } from "../hooks/usePageActions";
import { useToastStore } from "../store/toastStore";

const TOAST_DURATION_MS = 3000;

export function TrashToast() {
  const trashToast = useToastStore((state) => state.trashToast);
  const clearTrashToast = useToastStore((state) => state.clearTrashToast);
  const { restoreFromToast } = usePageActions();

  useEffect(() => {
    if (!trashToast) return;

    const timer = window.setTimeout(() => {
      clearTrashToast();
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [trashToast, clearTrashToast]);

  if (!trashToast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg">
        <span>
          <span className="font-medium">{trashToast.title}</span> moved to trash
        </span>
        <button
          type="button"
          onClick={() => restoreFromToast(trashToast.pageId)}
          className="font-medium text-neutral-300 underline-offset-2 transition hover:text-white hover:underline"
        >
          Restore
        </button>
      </div>
    </div>
  );
}
