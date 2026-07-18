/* Service worker UNIQUE de Budget Meney.
   Il fait TROIS choses : le cache PWA, la cible de partage Android, ET les notifications push.
   Un seul SW par scope est possible : les séparer faisait que le second écrasait le premier
   (bug du 18/07/2026 : notifications envoyées par le serveur mais jamais affichées). */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey:"AIzaSyAKrv6HrM7QhXrFmO-F0PVJ9B6nTFKCkR0",
  authDomain:"budget-meney.firebaseapp.com",
  databaseURL:"https://budget-meney-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:"budget-meney",
  messagingSenderId:"999394751928",
  appId:"1:999394751928:web:111461399fe73a6a2c8b4d"
});
try{
  const messaging=firebase.messaging();
  messaging.onBackgroundMessage(p=>{
    const n=p.notification||p.data||{};
    self.registration.showNotification(n.title||'Budget Meney',{
      body:n.body||'',icon:'icon-192.png',badge:'icon-192.png',
      tag:'budget-'+(n.title||''),renotify:true,
      data:{url:self.registration.scope}
    });
  });
}catch(e){}

/* Filet de sécurité : si le message arrive sans passer par le SDK Firebase,
   on l'affiche quand même (sinon le push est reçu mais reste invisible). */
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(err){try{d={notification:{title:'Budget Meney',body:e.data.text()}}}catch(e2){}}
  const n=d.notification||d.data||{};
  if(!n.title&&!n.body)return;
  e.waitUntil(self.registration.getNotifications().then(list=>{
    if(list.some(x=>x.title===n.title&&x.body===n.body))return;
    return self.registration.showNotification(n.title||'Budget Meney',{
      body:n.body||'',icon:'icon-192.png',badge:'icon-192.png',data:{url:self.registration.scope}});
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    for(const w of ws){if(w.url.includes(self.registration.scope)&&'focus'in w)return w.focus()}
    return clients.openWindow((e.notification.data&&e.notification.data.url)||'./');
  }));
});

/* ---------- Cache PWA + cible de partage ---------- */
const C='budget-v8';
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
