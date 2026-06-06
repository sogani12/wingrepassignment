import {
  useBlockNoteEditor,
  useComponentsContext,
  useSelectedBlocks,
} from "@blocknote/react";
import { useTransformContext } from "./TransformContext";

export function TransformButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const selectedBlocks = useSelectedBlocks();
  const { openMenu, isTransforming } = useTransformContext();

  const hasInlineContent = selectedBlocks.some(
    (block) => block.content !== undefined,
  );

  if (!hasInlineContent) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip="Transform"
      onClick={() => {
        editor.focus();
        openMenu();
      }}
      isSelected={false}
      isDisabled={isTransforming}
    >
      <span className="text-xs font-semibold tracking-tight">Transform</span>
    </Components.FormattingToolbar.Button>
  );
}
