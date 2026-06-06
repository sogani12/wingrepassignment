import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  runTransform,
  TransformApiError,
  type TransformRequest,
} from "../shared/transformHandler.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as TransformRequest;
    const result = await runTransform(body, process.env.OPENAI_API_KEY ?? "");
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof TransformApiError) {
      return res.status(error.status).json({ error: error.message });
    }

    const message =
      error instanceof Error ? error.message : "Unexpected transform error";
    return res.status(500).json({ error: message });
  }
}
