import {
  buildTransformUserPrompt,
  stripMarkdownFences,
  UNIVERSAL_SYSTEM_PROMPT,
} from "./transformPrompt.js";

export interface TransformRequest {
  name: string;
  description: string;
  inputMarkdown: string;
}

export interface TransformResponse {
  markdown: string;
}

export class TransformApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "TransformApiError";
    this.status = status;
  }
}

export async function runTransform(
  request: TransformRequest,
  apiKey: string,
): Promise<TransformResponse> {
  if (!apiKey) {
    throw new TransformApiError("OPENAI_API_KEY is not configured", 500);
  }

  const { name, description, inputMarkdown } = request;
  if (!name?.trim() || !description?.trim() || !inputMarkdown?.trim()) {
    throw new TransformApiError("Missing required transform fields", 400);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: UNIVERSAL_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildTransformUserPrompt(name, description, inputMarkdown),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new TransformApiError(
      `OpenAI request failed (${response.status}): ${errorBody}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new TransformApiError("Empty response from model", 502);
  }

  const markdown = stripMarkdownFences(content);
  if (!markdown) {
    throw new TransformApiError("Model returned empty markdown", 502);
  }

  return { markdown };
}
