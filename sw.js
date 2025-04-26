// Event install
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('Service Worker installed');
});

// Event activate
self.addEventListener('activate', event => {
    clients.claim();
    console.log('Service Worker activated');
});

// Event menerima pesan dari app
self.addEventListener('message', event => {
    if (event.data.type === 'SHOW_NOTIFICATION') {
        showNotification(event.data);
    }
});

// Tampilkan notifikasi
function showNotification(data) {
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        vibrate: [200, 100, 200, 100, 200],
        actions: [
            { action: 'confirm', title: 'Ya Simpan' },
            { action: 'skip', title: 'Lewati' }
        ],
        data: data.data
    });
    
    // Putar suara notifikasi
    if (data.sound) {
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'PLAY_SOUND',
                    src: data.sound
                });
            });
        });
    }
}

// Event klik notifikasi
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'confirm') {
        // Simpan tabungan
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'SAVE_DEPOSIT',
                    amount: event.notification.data.amount
                });
            });
        });
    }
    
    // Buka aplikasi jika di mobile
    event.waitUntil(
        clients.openWindow('/')
    );
});