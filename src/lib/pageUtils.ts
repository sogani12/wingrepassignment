import type { Block } from "@blocknote/core";
import type {
  LibraryPropertyVisibility,
  Page,
  SidebarSort,
} from "../types/page";
export function normalizeLibraryProperties(
  raw?: Partial<LibraryPropertyVisibility & { title?: boolean }>,
): LibraryPropertyVisibility {
  return {
    preview: raw?.preview ?? true,
    lastEdited: raw?.lastEdited ?? true,
    created: raw?.created ?? true,
  };
}

export const TRASH_RETENTION_DAYS = 30;
const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export function isActivePage(page: Page): boolean {
  return page.deletedAt === null;
}

export function getActivePages(pages: Page[]): Page[] {
  return pages.filter(isActivePage);
}

export function getTrashedPages(pages: Page[]): Page[] {
  return pages.filter((page) => page.deletedAt !== null);
}

export function purgeExpiredTrash(pages: Page[]): Page[] {
  const cutoff = Date.now() - TRASH_RETENTION_MS;
  return pages.filter((page) => {
    if (!page.deletedAt) return true;
    return new Date(page.deletedAt).getTime() > cutoff;
  });
}

export interface PersistedSlice {
  pages?: Page[];
  activePageId?: string | null;
  sidebarSort?: SidebarSort;
  libraryColumns?: Partial<LibraryPropertyVisibility & { title?: boolean }>;
}

export function normalizePersistedState(state: PersistedSlice): {
  pages: Page[];
  activePageId: string | null;
  sidebarSort: SidebarSort;
  libraryColumns: LibraryPropertyVisibility;
} {
  const rawPages = Array.isArray(state.pages) ? state.pages : [];
  const pages = purgeExpiredTrash(rawPages.map(migratePage));
  const activePageId = pickNextActivePageId(pages, state.activePageId ?? null);

  return {
    pages,
    activePageId,
    sidebarSort: state.sidebarSort ?? "recent",
    libraryColumns: normalizeLibraryProperties(state.libraryColumns),
  };
}

export function migratePage(page: Page & { createdAt?: string; deletedAt?: string | null }): Page {
  const fallback = page.updatedAt ?? new Date().toISOString();
  return {
    ...page,
    createdAt: page.createdAt ?? fallback,
    deletedAt: page.deletedAt ?? null,
  };
}

export function sortPages(pages: Page[], sort: SidebarSort): Page[] {
  const sorted = [...pages];
  if (sort === "alphabetical") {
    return sorted.sort((a, b) =>
      (a.title || "Untitled").localeCompare(b.title || "Untitled"),
    );
  }
  return sorted.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getPagePreview(content: Block[], maxLength = 80): string {
  for (const block of content) {
    const text = extractBlockText(block);
    if (text.trim()) {
      return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
    }
  }
  return "";
}

function extractBlockText(block: Block): string {
  if (!block.content || !Array.isArray(block.content)) return "";
  return block.content
    .map((item) => {
      if (typeof item === "object" && item !== null && "text" in item) {
        return String(item.text);
      }
      return "";
    })
    .join("");
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntilPurge(deletedAt: string): number {
  const purgeAt = new Date(deletedAt).getTime() + TRASH_RETENTION_MS;
  return Math.max(0, Math.ceil((purgeAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

export function matchesSearch(page: Page, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const title = (page.title || "Untitled").toLowerCase();
  const preview = getPagePreview(page.content).toLowerCase();
  return title.includes(normalized) || preview.includes(normalized);
}

export function pickNextActivePageId(
  pages: Page[],
  currentId: string | null,
  excludeId?: string,
): string | null {
  const active = getActivePages(pages).filter((page) => page.id !== excludeId);
  if (active.length === 0) return null;
  if (currentId && active.some((page) => page.id === currentId)) return currentId;
  return active[0].id;
}
