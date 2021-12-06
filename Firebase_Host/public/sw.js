const staticCacheName='site-static';
const assets=[
                '/',
                '/index.html',
                '/icons/icon16.png',
                '/icons/icon24.png',
                '/icons/icon32.png',
                '/icons/icon64.png',
                '/images/3DJuegos.png',
                '/images/banner.jpg',
                '/images/consolas.jpg',
                '/images/fc6.png',
                '/images/fh5.jpg',
                '/images/games.jpg',
                '/images/gta.png',
                '/images/halo-infinit.jpg',
                '/images/halo.jpg',
                '/images/hwun.jfif',
                '/images/jwe2.png',
                '/images/lcdg.jfif',
                '/images/mapa.png',
                '/images/vandal.jpg',
                '/js/app.js',
                '/pages/colection.html',
                '/pages/juegos.html',
                '/pages/noticias.html',
                '/manifest.json',
                '/sw.js'
];

self.addEventListener('install',function(event){
    event.waitUtil(
        caches.open(staticCacheName).then(cache=> {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch',evt=>{
    evt.respondWith(
        caches.match(evt.request).then(cacheRes=>{
            return cacheRes || fetch(evt.request);
        })
    )
});


self.addEventListener('push', function(event) {
    console.info('Event: Push');
    var title = 'Breaking News';
    var body = {
        'body': 'Click to see the latest breaking news', 'tag': 'pwa',
        'icon': '/icons/icon32.png'
    };
    event.waitUntil(self.registration.showNotification(title, body)
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.data);
    var url = '/pages/noticias.html';
    event.notification.close();
    event.waitUntil(
        clients.openWindow(url)
    );
});
