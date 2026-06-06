import { useEffect, useMemo, useRef, useState } from "react";
import {
  getActivePages,
  getPageDisplayTitle,
  matchesSearch,
} from "../lib/pageUtils";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { usePageStore } from "../store/pageStore";

interface QuickSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ open, onClose }: QuickSearchModalProps) {
  const pages = usePageStore((state) => state.pages);
  const { toPage, createPage } = useAppNavigate();
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const active = getActivePages(pages);
    return active.filter((page) => matchesSearch(page, query));
  }, [pages, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlightIndex(0);
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((index) => Math.max(index - 1, 0));
      }

      if (event.key === "Enter" && results[highlightIndex]) {
        event.preventDefault();
        toPage(results[highlightIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, highlightIndex, toPage, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[20vh]"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-neutral-200 px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages…"
            className="w-full border-none text-base text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>

        <ul className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-neutral-500">No pages found</li>
          ) : (
            results.map((page, index) => (
              <li key={page.id}>
                <button
                  type="button"
                  onClick={() => {
                    toPage(page.id);
                    onClose();
                  }}
                  className={`flex w-full px-4 py-2.5 text-left text-sm transition ${
                    index === highlightIndex
                      ? "bg-neutral-100 text-neutral-900"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {getPageDisplayTitle(page.title)}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2 text-xs text-neutral-400">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <button
            type="button"
            onClick={() => {
              createPage();
              onClose();
            }}
            className="text-neutral-600 transition hover:text-neutral-900"
          >
            + New page
          </button>
        </div>
      </div>
    </div>
  );
}
