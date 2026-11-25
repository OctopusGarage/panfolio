export function createServiceWorker(version: string, files: string[]) {
  return `const PREFIX='panfolio-scope-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'${version}';
const MEDIA=CACHE+'-images';
const URLS=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{
const scope=self.registration.scope;
await cache.addAll(URLS.map(url=>new Request(new URL(url,scope),{cache:'reload'})));
const page=await cache.match(new URL('./',scope));
if(!page)throw new Error('Precached HTML is missing');
const expected=new Set(URLS.map(url=>new URL(url,scope).href));
const assetBase=new URL('./assets/',scope).href;
const references=Array.from((await page.text()).matchAll(/(?:src|href)=["']([^"']+)["']/g),match=>new URL(match[1],scope).href).filter(url=>url.startsWith(assetBase));
if(!references.length||references.some(url=>!expected.has(url)))throw new Error('Precached HTML does not match this build assets');
await cache.put(new URL('__offline_ready__',scope),new Response(JSON.stringify(Array.from(expected))));
})));
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
});`;
}
