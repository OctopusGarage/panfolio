import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { createServiceWorker } from "../scripts/service-worker";

const scope = "https://app.test/panfolio/";
const urls = ["./", "./assets/current.js", "./assets/current.css"];
const fresh =
  '<script type="module" src="./assets/current.js"></script><link href="./assets/current.css" rel="stylesheet">';
const stale = '<script type="module" src="./assets/retired.js"></script>';
function install(alwaysStale = false) {
  const handlers = new Map<
    string,
    (event: { waitUntil: (promise: Promise<void>) => void }) => void
  >();
  const stored = new Map<string, Response>();
  const requests: Request[] = [];
  const cache = {
    async addAll(items: (string | Request)[]) {
      for (const item of items) {
        const request =
          typeof item === "string" ? new Request(new URL(item, scope)) : item;
        requests.push(request);
        stored.set(
          request.url,
          new Response(
            request.url === scope
              ? alwaysStale || request.cache !== "reload"
                ? stale
                : fresh
              : "asset",
          ),
        );
      }
    },
    async match(url: string | URL) {
      return stored.get(String(url))?.clone();
    },
    async put(url: string | URL, response: Response) {
      stored.set(String(url), response);
    },
  };
  runInNewContext(createServiceWorker("test-build", urls), {
    self: {
      registration: { scope },
      location: { origin: new URL(scope).origin },
      addEventListener: (
        name: string,
        handler: typeof handlers extends Map<string, infer H> ? H : never,
      ) => handlers.set(name, handler),
    },
    caches: { open: async () => cache },
    Request,
    Response,
    URL,
  });
  let completion!: Promise<void>;
  handlers.get("install")!({
    waitUntil: (promise) => {
      completion = promise;
    },
  });
  return { completion, requests, stored };
}
test("install bypasses HTTP cache and records readiness only for matching HTML and assets", async () => {
  const run = install();
  await run.completion;
  assert.ok(run.requests.every((request) => request.cache === "reload"));
  assert.equal(await run.stored.get(scope)!.text(), fresh);
  assert.deepEqual(
    JSON.parse(await run.stored.get(scope + "__offline_ready__")!.text()),
    urls.map((url) => new URL(url, scope).href),
  );
});
test("a stale CDN homepage cannot be marked offline-ready for the current assets", async () => {
  const run = install(true);
  await assert.rejects(run.completion, /HTML.*assets/i);
  assert.equal(run.stored.has(scope + "__offline_ready__"), false);
});
