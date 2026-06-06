import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pickNextActivePageId } from "../lib/pageUtils";
import { routes } from "../lib/routes";
import { usePageStore } from "../store/pageStore";

export function useAppNavigate() {
  const navigate = useNavigate();

  const toPage = useCallback(
    (pageId: string, options?: { focusTitle?: boolean }) => {
      usePageStore.setState({
        activePageId: pageId,
        focusTarget: options?.focusTitle ? "title" : null,
      });
      navigate(routes.page(pageId));
    },
    [navigate],
  );

  const toLibrary = useCallback(() => {
    navigate(routes.library);
  }, [navigate]);

  const toTrash = useCallback(() => {
    navigate(routes.trash);
  }, [navigate]);

  const toEditorHome = useCallback(() => {
    const { pages, activePageId } = usePageStore.getState();
    const nextId = pickNextActivePageId(pages, activePageId);
    if (nextId) {
      toPage(nextId);
      return;
    }
    navigate(routes.library);
  }, [navigate, toPage]);

  const createPage = useCallback(() => {
    const pageId = usePageStore.getState().createNewPage();
    navigate(routes.page(pageId));
  }, [navigate]);

  const restorePage = useCallback(
    (pageId: string) => {
      usePageStore.getState().restorePage(pageId);
      navigate(routes.page(pageId));
    },
    [navigate],
  );

  return {
    toPage,
    toLibrary,
    toTrash,
    toEditorHome,
    createPage,
    restorePage,
  };
}
