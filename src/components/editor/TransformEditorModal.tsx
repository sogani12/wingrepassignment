import { useBlockNoteEditor } from "@blocknote/react";
import { useEffect, useRef, useState } from "react";
import { applyTransformResult } from "../../lib/applyTransform";
import {
  resolveTransformScope,
  type TransformScope,
} from "../../lib/resolveTransformScope";
import { requestTransform } from "../../lib/transformApi";
import { useTransformStore } from "../../store/transformStore";
import { TRANSFORM_DESCRIPTION_PLACEHOLDER } from "../../types/transform";
import { useTransformContext } from "./TransformContext";

export function TransformEditorModal() {
  const editor = useBlockNoteEditor();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const {
    editorModal,
    closeEditorModal,
    transformError,
    clearTransformError,
  } = useTransformContext();

  const addCustomTransform = useTransformStore((state) => state.addCustomTransform);
  const updateCustomTransform = useTransformStore(
    (state) => state.updateCustomTransform,
  );
  const isNameTaken = useTransformStore((state) => state.isNameTaken);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testPreview, setTestPreview] = useState<{
    scope: TransformScope;
    inputMarkdown: string;
    outputMarkdown: string;
  } | null>(null);

  const isEdit = editorModal?.mode === "edit";
  const editingId = isEdit ? editorModal.transform.id : undefined;

  useEffect(() => {
    if (!editorModal) return;

    if (editorModal.mode === "edit") {
      setName(editorModal.transform.name);
      setDescription(editorModal.transform.description);
    } else {
      setName("");
      setDescription("");
    }

    setFormError(null);
    setTestPreview(null);
    clearTransformError();
    cancelRef.current?.focus();
  }, [editorModal, clearTransformError]);

  useEffect(() => {
    if (!editorModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeEditorModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editorModal, closeEditorModal]);

  if (!editorModal) return null;

  const handleSave = () => {
    setFormError(null);

    try {
      if (isNameTaken(name, editingId)) {
        setFormError("A transform with this name already exists");
        return;
      }

      if (isEdit) {
        updateCustomTransform(editorModal.transform.id, name, description);
      } else {
        addCustomTransform(name, description);
      }

      if (testPreview) {
        applyTransformResult(
          editor,
          testPreview.scope,
          testPreview.outputMarkdown,
        );
      }

      closeEditorModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save transform",
      );
    }
  };

  const handleTest = async () => {
    setFormError(null);
    clearTransformError();

    const scope = resolveTransformScope(editor);
    if (!scope) {
      setFormError("Select some text in the editor to test this transform");
      return;
    }

    if (!name.trim() || !description.trim()) {
      setFormError("Name and description are required to test");
      return;
    }

    setIsTesting(true);
    try {
      const result = await requestTransform(
        { name: name.trim(), description: description.trim() },
        scope.inputMarkdown,
      );
      setTestPreview({
        scope,
        inputMarkdown: result.inputMarkdown,
        outputMarkdown: result.markdown,
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Transform test failed",
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={closeEditorModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transform-editor-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2
            id="transform-editor-title"
            className="text-lg font-semibold text-neutral-900"
          >
            {isEdit ? "Edit transform" : "New transform"}
          </h2>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-4">
          <div>
            <label
              htmlFor="transform-name"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Name
            </label>
            <input
              id="transform-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Standup summary"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
            />
          </div>

          <div>
            <label
              htmlFor="transform-description"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <textarea
              id="transform-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={TRANSFORM_DESCRIPTION_PLACEHOLDER}
              rows={6}
              className="w-full resize-y rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400/80 focus:border-neutral-400"
            />
          </div>

          {(formError || transformError) && (
            <p className="text-sm text-red-600">{formError ?? transformError}</p>
          )}

          {testPreview && (
            <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                Test preview
              </p>
              <div>
                <p className="mb-1 text-xs text-neutral-500">Before</p>
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-sm text-neutral-800">
                  {testPreview.inputMarkdown}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">After</p>
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-sm text-neutral-800">
                  {testPreview.outputMarkdown}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={closeEditorModal}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
          >
            {isTesting ? "Testing…" : "Test"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {testPreview ? "Save & apply" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
