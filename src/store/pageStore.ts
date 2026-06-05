import type { Block } from "@blocknote/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPage, createSpikeContent } from "../lib/defaultPage";
import type { Page } from "../types/page";

const seedPage: Page = {
  ...createPage("Getting Started"),
  content: createSpikeContent(),
};

interface PageStore {
  pages: Page[];
  activePageId: string;
  hydrated: boolean;
  setHydrated: () => void;
  setActivePage: (pageId: string) => void;
  createNewPage: () => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, title: string) => void;
  updatePageContent: (pageId: string, content: Block[]) => void;
}

export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: [seedPage],
      activePageId: seedPage.id,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setActivePage: (pageId) => set({ activePageId: pageId }),
      createNewPage: () => {
        const page = createPage();
        set((state) => ({
          pages: [...state.pages, page],
          activePageId: page.id,
        }));
      },
      deletePage: (pageId) => {
        const { pages, activePageId } = get();
        if (pages.length <= 1) return;

        const nextPages = pages.filter((page) => page.id !== pageId);
        const nextActive =
          activePageId === pageId ? nextPages[0].id : activePageId;

        set({ pages: nextPages, activePageId: nextActive });
      },
      renamePage: (pageId, title) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, title, updatedAt: new Date().toISOString() }
              : page,
          ),
        }));
      },
      updatePageContent: (pageId, content) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, content, updatedAt: new Date().toISOString() }
              : page,
          ),
        }));
      },
    }),
    {
      name: "wingrep-notes",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        pages: state.pages,
        activePageId: state.activePageId,
      }),
    },
  ),
);

export function getActivePage(pages: Page[], activePageId: string): Page {
  return pages.find((page) => page.id === activePageId) ?? pages[0];
}
