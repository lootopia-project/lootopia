/* eslint-env serviceworker */
/* global importScripts, firebase, clients, self */
// Importer les scripts Firebase


importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');


try {
    // Configuration Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBK7_L-TtdMuTIzs55HjKntSPnUo0isLIA",
        authDomain: "lootopia-8fcf2.firebaseapp.com",
        projectId: "lootopia-8fcf2",
        storageBucket: "lootopia-8fcf2.firebasestorage.app",
        messagingSenderId: "958851825460",
        appId: "1:958851825460:web:552f74f3a8722e68a96f61",
        databaseURL: "https://lootopia-8fcf2-default-rtdb.firebaseio.com/",
    };

    // Initialiser Firebase dans le service worker
    firebase.initializeApp(firebaseConfig);

    // Récupérer une instance de Firebase Messaging
    const messaging = firebase.messaging();

    // Gérer les messages reçus en arrière-plan
    messaging.onBackgroundMessage((payload) => {

        // Vérifier que la notification existe dans le payload
        if (payload.notification) {

            const notificationTitle = payload.notification.title || 'Notification';
            const notificationOptions = {
                body: payload.notification.body || 'Vous avez une nouvelle notification.',
                icon: payload.notification.icon || '/favicon.ico', // Icône par défaut
            };

            // Afficher la notification
            self.registration.showNotification(notificationTitle, notificationOptions);
        } else {
            console.warn('[firebase-messaging-sw.js] Pas de notification dans le payload.');
        }
    });

    // Écouter l'événement "notificationclick" pour gérer les actions utilisateur
    self.addEventListener('notificationclick', (event) => {

        // Fermer la notification
        event.notification.close();

        // Ouvrir une URL ou effectuer une action en réponse au clic
        if (event.notification.data && event.notification.data.url) {
            event.waitUntil(
                clients.openWindow(event.notification.data.url)
            );
        }
    });

} catch (error) {
    console.error('[firebase-messaging-sw.js] Erreur lors de l\'initialisation :', error);
}
