import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { memo, useEffect } from "react";
import type { Page } from "../types/page";
import { usePageStore } from "../store/pageStore";

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
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
});
