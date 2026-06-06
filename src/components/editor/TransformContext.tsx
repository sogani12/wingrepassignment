import type { BlockNoteEditor } from "@blocknote/core";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyTransformResult } from "../../lib/applyTransform";
import { resolveTransformScope } from "../../lib/resolveTransformScope";
import { requestTransform } from "../../lib/transformApi";
import type { CustomTransform, TransformDefinition } from "../../types/transform";

type EditorModalState =
  | { mode: "create" }
  | { mode: "edit"; transform: CustomTransform }
  | null;

interface TransformContextValue {
  menuOpen: boolean;
  menuAnchor: DOMRect | null;
  openMenu: () => void;
  closeMenu: () => void;
  isTransforming: boolean;
  transformError: string | null;
  clearTransformError: () => void;
  runTransform: (transform: TransformDefinition) => Promise<void>;
  editorModal: EditorModalState;
  openCreateModal: () => void;
  openEditModal: (transform: CustomTransform) => void;
  closeEditorModal: () => void;
}

const TransformContext = createContext<TransformContextValue | null>(null);

interface TransformProviderProps {
  children: ReactNode;
  editor: BlockNoteEditor;
}

export function TransformProvider({ children, editor }: TransformProviderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [editorModal, setEditorModal] = useState<EditorModalState>(null);

  const openMenu = useCallback(() => {
    const scope = resolveTransformScope(editor);
    if (!scope) {
      setTransformError("Select some text to transform");
      return;
    }

    const anchor = editor.getSelectionBoundingBox() ?? null;
    setMenuAnchor(anchor);
    setMenuOpen(true);
    setTransformError(null);
  }, [editor]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuAnchor(null);
  }, []);

  const clearTransformError = useCallback(() => {
    setTransformError(null);
  }, []);

  const runTransform = useCallback(
    async (transform: TransformDefinition) => {
      const scope = resolveTransformScope(editor);
      if (!scope) {
        setTransformError("Select some text to transform");
        return;
      }

      setIsTransforming(true);
      setTransformError(null);

      try {
        const result = await requestTransform(transform, scope.inputMarkdown);
        applyTransformResult(editor, scope, result.markdown);
        closeMenu();
      } catch (error) {
        setTransformError(
          error instanceof Error ? error.message : "Transform failed",
        );
      } finally {
        setIsTransforming(false);
      }
    },
    [closeMenu, editor],
  );

  const openCreateModal = useCallback(() => {
    closeMenu();
    setEditorModal({ mode: "create" });
  }, [closeMenu]);

  const openEditModal = useCallback(
    (transform: CustomTransform) => {
      closeMenu();
      setEditorModal({ mode: "edit", transform });
    },
    [closeMenu],
  );

  const closeEditorModal = useCallback(() => {
    setEditorModal(null);
  }, []);

  const value = useMemo<TransformContextValue>(
    () => ({
      menuOpen,
      menuAnchor,
      openMenu,
      closeMenu,
      isTransforming,
      transformError,
      clearTransformError,
      runTransform,
      editorModal,
      openCreateModal,
      openEditModal,
      closeEditorModal,
    }),
    [
      menuOpen,
      menuAnchor,
      openMenu,
      closeMenu,
      isTransforming,
      transformError,
      clearTransformError,
      runTransform,
      editorModal,
      openCreateModal,
      openEditModal,
      closeEditorModal,
    ],
  );

  return (
    <TransformContext.Provider value={value}>
      {children}
    </TransformContext.Provider>
  );
}

export function useTransformContext(): TransformContextValue {
  const context = useContext(TransformContext);
  if (!context) {
    throw new Error("useTransformContext must be used within TransformProvider");
  }
  return context;
}
