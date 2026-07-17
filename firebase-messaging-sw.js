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
const messaging=firebase.messaging();
messaging.onBackgroundMessage(p=>{
  const n=p.notification||{};
  self.registration.showNotification(n.title||'Budget Meney',{
    body:n.body||'',icon:'icon-192.png',badge:'icon-192.png',
    data:{url:self.registration.scope}
  });
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    for(const w of ws){if(w.url.includes(self.registration.scope)&&'focus'in w)return w.focus()}
    return clients.openWindow(e.notification.data&&e.notification.data.url||'./');
  }));
});
