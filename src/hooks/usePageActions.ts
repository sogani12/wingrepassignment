import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getPageDisplayTitle } from "../lib/pageUtils";
import { parsePageId } from "../lib/routes";
import { useAppNavigate } from "./useAppNavigate";
import { useToastStore } from "../store/toastStore";
import { usePageStore } from "../store/pageStore";

export { getPageDisplayTitle };

export function usePageActions() {
  const trashPage = usePageStore((state) => state.trashPage);
  const renamePage = usePageStore((state) => state.renamePage);
  const showTrashToast = useToastStore((state) => state.showTrashToast);
  const { toPage, toLibrary, restorePage } = useAppNavigate();
  const location = useLocation();

  const moveToTrash = useCallback(
    (pageId: string) => {
      const page = usePageStore.getState().pages.find((item) => item.id === pageId);
      if (!page) return;

      const title = getPageDisplayTitle(page.title);
      const wasActive = parsePageId(location.pathname) === pageId;

      trashPage(pageId);
      showTrashToast({ pageId, title });

      if (wasActive) {
        const nextId = usePageStore.getState().activePageId;
        if (nextId) {
          toPage(nextId);
        } else {
          toLibrary();
        }
      }
    },
    [trashPage, showTrashToast, location.pathname, toPage, toLibrary],
  );

  const restoreFromToast = useCallback(
    (pageId: string) => {
      restorePage(pageId);
      useToastStore.getState().clearTrashToast();
    },
    [restorePage],
  );

  const rename = useCallback(
    (pageId: string, title: string) => {
      renamePage(pageId, title);
    },
    [renamePage],
  );

  return { moveToTrash, restoreFromToast, rename };
}
