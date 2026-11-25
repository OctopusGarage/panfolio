import react from "@vitejs/plugin-react";
import { defineConfig, type ResolvedConfig } from "vite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
let config: ResolvedConfig;
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(
      JSON.parse(readFileSync("package.json", "utf8")).version,
    ),
    __BUILD_ID__: JSON.stringify(
      process.env.GITHUB_SHA?.slice(0, 7) || "local",
    ),
  },
  base: process.env.BASE_PATH || "./",
  plugins: [
    react(),
    {
      name: "offline-worker",
      configResolved(resolved) {
        config = resolved;
      },
      generateBundle(_, bundle) {
        const publicFiles = [
          "./recover.html",
          "./apple-touch-icon.png",
          "./manifest.webmanifest",
          "./icon.svg",
          "./icon-192.png",
          "./icon-512.png",
        ];
        const imageFiles = readdirSync(resolve(config.publicDir, "recipes"))
          .sort()
          .map((name) => "./recipes/" + name);
        const files = [
          "./",
          ...publicFiles,
          ...Object.keys(bundle).map((p) => "./" + p),
        ];
        const entries: [string, Uint8Array][] = [
          ...Object.entries(bundle).map(
            ([name, asset]): [string, Uint8Array] => {
              const source = asset.type === "chunk" ? asset.code : asset.source;
              return [
                "./" + name,
                typeof source === "string" ? Buffer.from(source) : source,
              ];
            },
          ),
          ...[...publicFiles, ...imageFiles].map(
            (name): [string, Uint8Array] => [
              name,
              readFileSync(resolve(config.publicDir, name)),
            ],
          ),
        ];
        const digest = createHash("sha256");
        for (const [name, bytes] of entries.sort(([a], [b]) =>
          a.localeCompare(b),
        )) {
          digest.update(JSON.stringify([name, bytes.byteLength]) + "\n");
          digest.update(bytes);
        }
        const version = digest.digest("hex").slice(0, 12);
        this.emitFile({
          type: "asset",
          fileName: "sw.js",
          source: `const PREFIX='panfolio-scope-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'${version}';
const MEDIA=CACHE+'-images';
const URLS=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(URLS);await cache.put(new URL('__offline_ready__',self.registration.scope),new Response(JSON.stringify(URLS.map(url=>new URL(url,self.registration.scope).href))));})));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE&&key!==MEDIA).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')event.waitUntil(self.skipWaiting());});
self.addEventListener('fetch',event=>{
const url=new URL(event.request.url);
if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
const image=url.pathname.startsWith(new URL('./recipes/',self.registration.scope).pathname);
event.respondWith((async()=>{
let cache;try{cache=await caches.open(image?MEDIA:CACHE);}catch{return fetch(event.request);}
const cached=await cache.match(event.request,{ignoreSearch:true,ignoreVary:true});
if(cached)return cached;
try{const response=await fetch(event.request);
if(image&&response.ok){event.waitUntil((async()=>{try{await cache.put(event.request,response.clone());const keys=await cache.keys();await Promise.all(keys.slice(0,Math.max(0,keys.length-120)).map(key=>cache.delete(key)));}catch{}})());}
return response;
}catch(error){if(event.request.mode==='navigate')return await cache.match(new URL('./',self.registration.scope));throw error;}
})());
});`,
        });
      },
    },
  ],
});
