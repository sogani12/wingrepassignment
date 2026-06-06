import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vite";
import {
  runTransform,
  TransformApiError,
  type TransformRequest,
} from "./shared/transformHandler.ts";

function transformApiDevPlugin(): Plugin {
  return {
    name: "transform-api-dev",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "");

      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/transform" || req.method !== "POST") {
          next();
          return;
        }

        try {
          const chunks: Uint8Array[] = [];
          for await (const chunk of req) {
            chunks.push(
              chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk),
            );
          }
          const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
          const combined = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          const body = JSON.parse(
            new TextDecoder().decode(combined),
          ) as TransformRequest;

          const result = await runTransform(
            body,
            env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (error) {
          const status =
            error instanceof TransformApiError ? error.status : 500;
          const message =
            error instanceof Error ? error.message : "Unexpected transform error";

          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), transformApiDevPlugin()],
});
