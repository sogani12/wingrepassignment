import type { Block } from "@blocknote/core";

export interface Page {
  id: string;
  title: string;
  content: Block[];
  updatedAt: string;
}

export interface AppState {
  pages: Page[];
  activePageId: string;
}
