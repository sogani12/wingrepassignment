import type { TransformDefinition } from "../types/transform";

export interface TransformResult {
  markdown: string;
  inputMarkdown: string;
}

export async function requestTransform(
  transform: Pick<TransformDefinition, "name" | "description">,
  inputMarkdown: string,
): Promise<TransformResult> {
  const response = await fetch("/api/transform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: transform.name,
      description: transform.description,
      inputMarkdown,
    }),
  });

  const data = (await response.json()) as {
    markdown?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? `Transform failed (${response.status})`);
  }

  if (!data.markdown?.trim()) {
    throw new Error("Transform returned empty content");
  }

  return {
    markdown: data.markdown,
    inputMarkdown,
  };
}
