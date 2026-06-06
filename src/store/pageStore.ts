import type { Block } from "@blocknote/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPage, createSpikeContent } from "../lib/defaultPage";
import {
  getActivePages,
  migratePage,
  normalizePersistedState,
  pickNextActivePageId,
  type PersistedSlice,
} from "../lib/pageUtils";
import type {
  LibraryPropertyVisibility,
  LibrarySortDir,
  LibrarySortKey,
  Page,
  SidebarSort,
} from "../types/page";
import { DEFAULT_LIBRARY_PROPERTIES } from "../types/page";
import { normalizeLibraryProperties } from "../lib/pageUtils";

const seedPage: Page = {
  ...createPage("Getting Started"),
  content: createSpikeContent(),
};

export type FocusTarget = "title" | null;

interface PersistedState {
  pages: Page[];
  activePageId: string | null;
  sidebarSort: SidebarSort;
  sidebarCollapsed: boolean;
  libraryColumns: LibraryPropertyVisibility;
}

interface PageStore extends PersistedState {
  focusTarget: FocusTarget;
  librarySearch: string;
  librarySortKey: LibrarySortKey;
  librarySortDir: LibrarySortDir;
  createNewPage: () => string;
  trashPage: (pageId: string) => void;
  restorePage: (pageId: string) => void;
  permanentDeletePage: (pageId: string) => void;
  renamePage: (pageId: string, title: string) => void;
  updatePageContent: (pageId: string, content: Block[]) => void;
  setSidebarSort: (sort: SidebarSort) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setLibrarySearch: (query: string) => void;
  setLibrarySort: (key: LibrarySortKey, dir: LibrarySortDir) => void;
  toggleLibraryProperty: (property: keyof LibraryPropertyVisibility) => void;
  clearFocusTarget: () => void;
}

function blocksEqual(a: Block[], b: Block[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: [seedPage],
      activePageId: seedPage.id,
      focusTarget: null,
      sidebarSort: "recent",
      sidebarCollapsed: false,
      librarySearch: "",
      librarySortKey: "updatedAt",
      librarySortDir: "desc",
      libraryColumns: DEFAULT_LIBRARY_PROPERTIES,
      createNewPage: () => {
        const page = createPage();
        set({
          pages: [...get().pages, page],
          activePageId: page.id,
          focusTarget: "title",
        });
        return page.id;
      },
      trashPage: (pageId) => {
        const now = new Date().toISOString();
        const pages = get().pages.map((page) =>
          page.id === pageId ? { ...page, deletedAt: now } : page,
        );
        const activePageId = pickNextActivePageId(pages, get().activePageId, pageId);

        set({ pages, activePageId });
      },
      restorePage: (pageId) => {
        const pages = get().pages.map((page) =>
          page.id === pageId ? { ...page, deletedAt: null } : page,
        );
        set({
          pages,
          activePageId: pageId,
          focusTarget: "title",
        });
      },
      permanentDeletePage: (pageId) => {
        const pages = get().pages.filter((page) => page.id !== pageId);
        const activePageId = pickNextActivePageId(pages, get().activePageId, pageId);
        set({ pages, activePageId });
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
        const existing = get().pages.find((page) => page.id === pageId);
        if (existing && blocksEqual(existing.content, content)) return;

        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, content, updatedAt: new Date().toISOString() }
              : page,
          ),
        }));
      },
      setSidebarSort: (sort) => set({ sidebarSort: sort }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLibrarySearch: (query) => set({ librarySearch: query }),
      setLibrarySort: (key, dir) => set({ librarySortKey: key, librarySortDir: dir }),
      toggleLibraryProperty: (property) =>
        set((state) => ({
          libraryColumns: {
            ...state.libraryColumns,
            [property]: !state.libraryColumns[property],
          },
        })),
      clearFocusTarget: () => set({ focusTarget: null }),
    }),
    {
      name: "wingrep-notes",
      version: 3,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as PersistedSlice;
        const rawPages = Array.isArray(state.pages)
          ? state.pages.map((page) =>
              migratePage(page as Page & { createdAt?: string; deletedAt?: string | null }),
            )
          : [];

        return normalizePersistedState({
          pages: rawPages.length > 0 ? rawPages : [seedPage],
          activePageId: state.activePageId ?? rawPages[0]?.id ?? seedPage.id,
          sidebarSort: state.sidebarSort,
          sidebarCollapsed: state.sidebarCollapsed,
          libraryColumns: normalizeLibraryProperties(state.libraryColumns),
        });
      },
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;

        return {
          ...currentState,
          ...normalizePersistedState(persistedState as PersistedSlice),
        };
      },
      partialize: (state) => ({
        pages: state.pages,
        activePageId: state.activePageId,
        sidebarSort: state.sidebarSort,
        sidebarCollapsed: state.sidebarCollapsed,
        libraryColumns: state.libraryColumns,
      }),
    },
  ),
);

export function getActivePage(
  pages: Page[],
  activePageId: string | null,
): Page | null {
  if (!activePageId) return null;
  const page = pages.find((item) => item.id === activePageId);
  if (!page || page.deletedAt) return null;
  return page;
}

export function useActivePages(): Page[] {
  const pages = usePageStore((state) => state.pages);
  return getActivePages(pages);
}
