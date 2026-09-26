const CACHE='kai-toroku-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var isPage=e.request.mode==='navigate'||e.request.destination==='document';
  if(isPage){
    e.respondWith(fetch(e.request).then(function(res){
      var cp=res.clone();caches.open(CACHE).then(function(c){c.put('./index.html',cp)});
      return res;
    }).catch(function(){return caches.match('./index.html')}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){
    return r || fetch(e.request).then(function(res){
      var cp=res.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,cp)});
      return res;
    }).catch(function(){return caches.match('./index.html')});
  }));
});
