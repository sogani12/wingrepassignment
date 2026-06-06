import type { Block, BlockNoteEditor } from "@blocknote/core";

export interface TransformScope {
  blocks: Block[];
  inputMarkdown: string;
}

export function resolveTransformScope(
  editor: BlockNoteEditor,
): TransformScope | null {
  const selection = editor.getSelection();
  if (!selection?.blocks.length) {
    return null;
  }

  const blocks = selection.blocks;
  const inputMarkdown = editor.blocksToMarkdownLossy(blocks).trim();
  if (!inputMarkdown) {
    return null;
  }

  return { blocks, inputMarkdown };
}
