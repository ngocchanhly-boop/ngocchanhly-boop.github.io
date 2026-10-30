/* Nhạc offline — giữ giao diện app trong máy để mở được khi không có mạng.
   Nhạc của bạn nằm trong bộ nhớ của trình duyệt (IndexedDB), không đi qua file này. */
const CACHE='nhac-offline-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;          /* nhạc từ link mây: để trình duyệt tự xử lý */
  if(r.mode==='navigate'){                                          /* trang app: mạng trước để nhận bản mới, mất mạng thì dùng bản đã lưu */
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r)));
});
