import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { FormattingToolbarController, useCreateBlockNote } from "@blocknote/react";
import { memo, useEffect } from "react";
import type { Page } from "../types/page";
import { usePageStore } from "../store/pageStore";
import { CustomFormattingToolbar } from "./editor/CustomFormattingToolbar";
import { TransformOverlays } from "./editor/TransformOverlays";
import { TransformProvider } from "./editor/TransformContext";

interface PageEditorProps {
  page: Page;
}

export const PageEditor = memo(function PageEditor({ page }: PageEditorProps) {
  const updatePageContent = usePageStore((state) => state.updatePageContent);

  const editor = useCreateBlockNote({
    initialContent: page.content,
  });

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      updatePageContent(page.id, editor.document);
    });

    return () => unsubscribe();
  }, [editor, page.id, updatePageContent]);

  return (
    <div className="page-editor">
      <TransformProvider editor={editor}>
        <BlockNoteView editor={editor} theme="light" formattingToolbar={false}>
          <FormattingToolbarController
            formattingToolbar={CustomFormattingToolbar}
          />
          <TransformOverlays />
        </BlockNoteView>
      </TransformProvider>
    </div>
  );
});
