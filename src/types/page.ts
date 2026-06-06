import type { Block } from "@blocknote/core";

export interface Page {
  id: string;
  title: string;
  content: Block[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type SidebarSort = "recent" | "alphabetical";
export type LibrarySortKey = "title" | "updatedAt" | "createdAt";
export type LibrarySortDir = "asc" | "desc";

export interface LibraryPropertyVisibility {
  preview: boolean;
  lastEdited: boolean;
  created: boolean;
}

export const DEFAULT_LIBRARY_PROPERTIES: LibraryPropertyVisibility = {
  preview: true,
  lastEdited: true,
  created: true,
};
