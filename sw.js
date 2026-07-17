const C='budget-v7';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./index.html','./manifest.json'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='shared-files').map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
const url=new URL(e.request.url);
/* Cible de partage Android : réceptionner les CSV puis rouvrir l'app */
if(e.request.method==='POST'&&url.pathname.endsWith('/share-import')){
e.respondWith((async()=>{
const fd=await e.request.formData();
const files=fd.getAll('csvfiles');
const cache=await caches.open('shared-files');
for(let i=0;i<files.length;i++){
const f=files[i];
await cache.put('./shared/'+Date.now()+'_'+i,new Response(await f.arrayBuffer(),{headers:{'X-Filename':encodeURIComponent(f.name||'partage.csv')}}))}
return Response.redirect('./index.html?shared=1','303')})());
return}
if(e.request.method!=='GET')return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok&&e.request.url.startsWith(self.location.origin)){const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request)))});
