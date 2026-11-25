import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import cookbook from "../generated/cookbook.json" with { type: "json" };

const documents: Readonly<Record<string, string>> = cookbook.files;
export const contentVersion = cookbook.contentVersion;
export const sourceRevision = cookbook.sourceRevision;
export const documentCount = Object.keys(documents).length;
export function readDocument(path: string): string {
  if (!Object.hasOwn(documents, path))
    throw Error(
      "Unknown cookbook document. Use an exact path from get_guide or an index; URLs and traversal are not accepted.",
    );
  return documents[path];
}
export const version = cookbook.version;
export const guidanceVersion = cookbook.guidanceVersion;
export const fingerprint = cookbook.fingerprint;
export const iconSha256 = cookbook.iconSha256;
export const iconBytes = Uint8Array.from(atob(cookbook.iconBase64), (c) =>
  c.charCodeAt(0),
);
export function getGuide(language: "zh" | "en"): string {
  const introduction =
    language === "zh"
      ? `# Panfolio 使用指南\n\n使用 read_document 读取 ${language}/recipes.md 或 ${language}/references.md。目录链接中 /content/ 后面的部分就是文档路径，通过 MCP 继续读取，无需打开浏览器。\n`
      : `# Panfolio guide\n\nUse read_document with ${language}/recipes.md or ${language}/references.md. The portion after /content/ in each link is the document path; read it through MCP instead of a browser.\n`;
  return (
    introduction +
    `\n${language}/preparations/samukichi-asparagus/pork-rolls.md\n${language}/preparations/samukichi-salmon/main.md\n\n` +
    cookbook.guidance[language]
  );
}
export const metadata = {
  version,
  contentVersion,
  guidanceVersion,
  sourceRevision,
  fingerprint,
};
export function createServer() {
  const server = new McpServer(
    {
      name: "panfolio",
      version,
      icons: [
        {
          src: new URL(`/icons/${iconSha256}.png`, cookbook.endpoint).href,
          mimeType: "image/png",
          sizes: ["512x512"],
        },
      ],
    },
    {
      instructions:
        "Read-only Panfolio cookbook. Start with get_guide, then read_document for indexes and selected preparations. Follow the user's language. Retrieve full text through MCP; no web browser or terminal is needed. Preserve source quantities and method boundaries.",
    },
  );
  const annotations = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
  server.registerTool(
    "get_guide",
    {
      title: "Panfolio guide / 使用指南",
      description:
        "Get the Panfolio cookbook guide and starting document paths. / 获取菜谱指南和目录路径。",
      inputSchema: z.object({ language: z.enum(["zh", "en"]).default("en") }),
      annotations,
    },
    async ({ language }) => ({
      content: [{ type: "text", text: getGuide(language) }],
      structuredContent: metadata,
    }),
  );
  server.registerTool(
    "read_document",
    {
      title: "Read cookbook / 读取菜谱",
      description:
        "Read a complete bundled Markdown recipe, preparation or kitchen reference using its exact index path. No web browsing needed. / 按目录中的路径读取完整菜谱或厨房基础。",
      inputSchema: z.object({ path: z.string().min(1).max(240) }),
      annotations,
    },
    async ({ path }) => {
      try {
        return {
          content: [{ type: "text", text: readDocument(path) }],
          structuredContent: { path, ...metadata },
        };
      } catch {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Unknown cookbook document / 未找到文档。Use an exact path from get_guide or an index; no URLs or traversal. 请使用指南或目录中的准确路径。",
            },
          ],
        };
      }
    },
  );
  return server;
}
