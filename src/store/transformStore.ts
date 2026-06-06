import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deriveTransformSummary } from "../lib/transformSummary";
import type { CustomTransform } from "../types/transform";
import { MAX_CUSTOM_TRANSFORMS } from "../types/transform";

interface TransformStore {
  customTransforms: CustomTransform[];
  addCustomTransform: (name: string, description: string) => CustomTransform;
  updateCustomTransform: (
    id: string,
    name: string,
    description: string,
  ) => void;
  deleteCustomTransform: (id: string) => void;
  isNameTaken: (name: string, excludeId?: string) => boolean;
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export const useTransformStore = create<TransformStore>()(
  persist(
    (set, get) => ({
      customTransforms: [],

      isNameTaken: (name, excludeId) => {
        const normalized = normalizeName(name);
        return get().customTransforms.some(
          (transform) =>
            transform.id !== excludeId &&
            normalizeName(transform.name) === normalized,
        );
      },

      addCustomTransform: (name, description) => {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedDescription) {
          throw new Error("Name and description are required");
        }

        if (get().isNameTaken(trimmedName)) {
          throw new Error("A transform with this name already exists");
        }

        if (get().customTransforms.length >= MAX_CUSTOM_TRANSFORMS) {
          throw new Error(`You can save up to ${MAX_CUSTOM_TRANSFORMS} custom transforms`);
        }

        const now = new Date().toISOString();
        const transform: CustomTransform = {
          id: crypto.randomUUID(),
          name: trimmedName,
          description: trimmedDescription,
          summary: deriveTransformSummary(trimmedDescription),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          customTransforms: [...state.customTransforms, transform],
        }));

        return transform;
      },

      updateCustomTransform: (id, name, description) => {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedDescription) {
          throw new Error("Name and description are required");
        }

        if (get().isNameTaken(trimmedName, id)) {
          throw new Error("A transform with this name already exists");
        }

        set((state) => ({
          customTransforms: state.customTransforms.map((transform) =>
            transform.id === id
              ? {
                  ...transform,
                  name: trimmedName,
                  description: trimmedDescription,
                  summary: deriveTransformSummary(trimmedDescription),
                  updatedAt: new Date().toISOString(),
                }
              : transform,
          ),
        }));
      },

      deleteCustomTransform: (id) => {
        set((state) => ({
          customTransforms: state.customTransforms.filter(
            (transform) => transform.id !== id,
          ),
        }));
      },
    }),
    {
      name: "wingrep-transforms",
      version: 1,
    },
  ),
);

export function customTransformToDefinition(
  transform: CustomTransform,
): import("../types/transform").TransformDefinition {
  return {
    id: transform.id,
    name: transform.name,
    description: transform.description,
    summary: transform.summary,
    builtin: false,
  };
}
