export const UNIVERSAL_SYSTEM_PROMPT = `You are a document transform engine for a block-based notes editor.

Rules:
- Transform the user's content according to the transform instructions.
- Output markdown only. No code fences, no commentary, no preamble.
- Use headings (#, ##), bullet lists (-), and task lists (- [ ]) as appropriate.
- Preserve bold (**text**) and italic (*text*) when they carry meaning.
- Do not invent facts that are not implied by the input.
- Match the scope of the input unless the transform explicitly expands it.`;

export function buildTransformUserPrompt(
  name: string,
  description: string,
  inputMarkdown: string,
): string {
  return `Transform: "${name}"

Instructions:
${description.trim()}

Content to transform:
${inputMarkdown}`;
}

export function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:markdown|md)?\s*\n?([\s\S]*?)\n?```$/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return trimmed;
}
