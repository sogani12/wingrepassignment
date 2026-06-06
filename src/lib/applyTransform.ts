import type { BlockNoteEditor } from "@blocknote/core";
import type { TransformScope } from "./resolveTransformScope";

export function applyTransformResult(
  editor: BlockNoteEditor,
  scope: TransformScope,
  outputMarkdown: string,
): void {
  const newBlocks = editor.tryParseMarkdownToBlocks(outputMarkdown);
  if (!newBlocks.length) {
    throw new Error("Could not parse transformed content into blocks");
  }

  editor.transact(() => {
    editor.replaceBlocks(
      scope.blocks.map((block) => block.id),
      newBlocks,
    );
  });
}
