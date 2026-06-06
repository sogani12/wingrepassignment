import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStoreHydration } from "../hooks/useStoreHydration";
import { getActivePages, pickNextActivePageId } from "../lib/pageUtils";
import { parsePageId, routes } from "../lib/routes";
import { usePageStore } from "../store/pageStore";

export function RouteSync() {
  const hydrated = useStoreHydration();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pages = usePageStore((state) => state.pages);

  useEffect(() => {
    if (!hydrated) return;

    if (pathname === routes.library || pathname === routes.trash) {
      return;
    }

    const pageIdFromPath = parsePageId(pathname);

    if (pageIdFromPath) {
      const page = pages.find((item) => item.id === pageIdFromPath);
      if (page && !page.deletedAt) {
        usePageStore.setState({ activePageId: pageIdFromPath, focusTarget: null });
        return;
      }

      const fallbackId = pickNextActivePageId(pages, usePageStore.getState().activePageId);
      navigate(fallbackId ? routes.page(fallbackId) : routes.library, { replace: true });
      return;
    }

    if (pathname === routes.home) {
      const activePages = getActivePages(pages);
      const { activePageId } = usePageStore.getState();
      const fallbackId =
        activePageId && activePages.some((page) => page.id === activePageId)
          ? activePageId
          : pickNextActivePageId(pages, activePageId);

      navigate(fallbackId ? routes.page(fallbackId) : routes.library, { replace: true });
    }
  }, [hydrated, pathname, pages, navigate]);

  return null;
}
