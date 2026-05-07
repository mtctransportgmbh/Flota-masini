// Firebase Messaging Service Worker
// Gestionează notificările push când aplicația e în background sau închisă

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ⬇ IMPORTANT: pune EXACT aceleași valori ca în config.js
firebase.initializeApp({
  apiKey: "AIzaSyA1O2Lw3unTXECgCtp2bdYuHjgfVqPEW6U",
  authDomain: "flota-firma.firebaseapp.com",
  projectId: "flota-firma",
  storageBucket: "flota-firma.firebasestorage.app",
  messagingSenderId: "281579444434",
  appId: "1:281579444434:web:facb358aa0434a2c00b50b"
});

const messaging = firebase.messaging();

// Notificări când aplicația e în background
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Flotă MTC', {
    body: body || '',
    icon: icon || './icon-192.png',
    badge: './icon-192.png',
    tag: payload.collapseKey || 'mtc-notification',
    data: payload.data
  });
});

// Dimineața la 08:00 — verifică sarcini (ca backup pentru notificarea din aplicație)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('./');
      }
    })
  );
});
