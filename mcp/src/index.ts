import { createMcpHandler } from "agents/mcp/server";
import {
  createServer,
  contentVersion,
  sourceRevision,
  documentCount,
  version,
  guidanceVersion,
  fingerprint,
  iconSha256,
  iconBytes,
} from "./server";
const handler = createMcpHandler(createServer, {
  route: "/mcp",
  responseMode: "json",
  legacy: "stateless",
  allowedOriginHostnames: [
    "chatgpt.com",
    "gemini.google.com",
    "www.doubao.com",
    "doubao.com",
  ],
});
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (
      (url.pathname === "/icon.png" ||
        url.pathname === `/icons/${iconSha256}.png`) &&
      request.method === "GET"
    )
      return new Response(iconBytes.slice().buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": url.pathname.startsWith("/icons/")
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    if (url.pathname === "/health" && request.method === "GET")
      return Response.json({
        name: "panfolio",
        version,
        guidanceVersion,
        fingerprint,
        iconSha256,
        contentVersion,
        sourceRevision,
        documentCount,
      });
    if (url.pathname === "/" && request.method === "GET")
      return Response.json({
        name: "Panfolio MCP",
        endpoint: new URL("/mcp", url).href,
        description: "Public read-only cookbook / 公开只读菜谱",
        tools: ["get_guide", "read_document"],
      });
    if (url.pathname !== "/mcp")
      return new Response("Not found / 未找到", { status: 404 });
    if (Number(request.headers.get("content-length") || 0) > 16384)
      return new Response("Request too large / 请求过大", { status: 413 });
    if (request.method === "POST" && request.body) {
      const reader = request.body.getReader();
      const chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 16384) {
          await reader.cancel();
          return new Response("Request too large / 请求过大", { status: 413 });
        }
        chunks.push(value);
      }
      const body = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      }
      request = new Request(request, { body });
    }
    return handler.fetch(request);
  },
} satisfies ExportedHandler;
