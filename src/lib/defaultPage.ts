import type { Block } from "@blocknote/core";
import type { Page } from "../types/page";

export function createEmptyBlock(): Block {
  return {
    id: crypto.randomUUID(),
    type: "paragraph",
    props: {
      backgroundColor: "default",
      textColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  };
}

export function createPage(title = ""): Page {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    content: [createEmptyBlock()],
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    favorited: false,
  };
}

export function createSpikeContent(): Block[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "paragraph",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [
        {
          type: "text",
          text: "Welcome to WingRep Notes. Try ",
          styles: {},
        },
        {
          type: "text",
          text: "bold",
          styles: { bold: true },
        },
        {
          type: "text",
          text: " and ",
          styles: {},
        },
        {
          type: "text",
          text: "italic",
          styles: { italic: true },
        },
        {
          type: "text",
          text: " formatting.",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: crypto.randomUUID(),
      type: "heading",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
        level: 2,
      },
      content: [{ type: "text", text: "Block types", styles: {} }],
      children: [],
    },
    {
      id: crypto.randomUUID(),
      type: "bulletListItem",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [
        {
          type: "text",
          text: "Paragraphs, headings, and bullet lists",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: crypto.randomUUID(),
      type: "bulletListItem",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [
        {
          type: "text",
          text: "Drag the handle on the left to reorder blocks",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: crypto.randomUUID(),
      type: "bulletListItem",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [
        {
          type: "text",
          text: "Type / for slash commands",
          styles: {},
        },
      ],
      children: [],
    },
  ];
}
