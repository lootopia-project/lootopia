import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import messaging from "@react-native-firebase/messaging";

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

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

const showNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === "granted") {
        new Notification(title, options);
    } else {
        console.warn("Les notifications ne sont pas autorisées par le navigateur.");
    }
};

// Fonction pour le Web : enregistrer le Service Worker et récupérer le token
const requestFcmTokenWeb = async (): Promise<{ platform: string; token: string | null }> => {
    try {
        // if ("serviceWorker" in navigator) {
        //     console.log("Enregistrement du Service Worker pour le Web.");
        //     await navigator.serviceWorker
        //         .register("./firebase-messaging-sw.js")
        //         .then((registration) => {
        //             console.log("Service Worker enregistré :", registration.scope);
        //         });
        // } else {
        //     console.warn("Les Service Workers ne sont pas pris en charge par ce navigateur.");
        //     return { platform: "Web", token: null };
        // }

        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.warn("Les notifications push ne sont pas autorisées.");
            return { platform: "Web", token: null };
        }

        const fcmToken = await getToken(messaging, {
            vapidKey: "BP-o-H2NKTa-Ske6pWy7Cl4CSvxRyrmJwwEaH4T_y7obZ-q2qmHPNQ8PQqSGh69QplFT7FIEYQ6JxjMjO3kYoK8",
        });

        console.log("FCM Token (Web):", fcmToken);

        // Ajouter un écouteur pour les messages en premier plan
        onMessage(messaging, (payload) => {
            console.log("Message reçu en premier plan :", payload);

            if (payload.notification) {
                const notificationTitle = payload.notification.title || "Notification";
                const notificationOptions: NotificationOptions = {
                    body: payload.notification.body || "Vous avez une nouvelle notification.",
                    icon: payload.notification.icon || "/favicon.ico", // Icône par défaut
                };

                // Afficher la notification en premier plan
                showNotification(notificationTitle, notificationOptions);
            } else {
                console.warn("Pas de notification dans le payload.");
            }
        });

        return { platform: "Web", token: fcmToken };
    } catch (error) {
        console.error("Erreur lors de la récupération du token FCM (Web) :", error);
        return { platform: "Web", token: null };
    }
};

// Fonction pour React Native : demander les permissions et récupérer le token
const requestFcmTokenMobile = async (): Promise<{ platform: string; token: string | null }> => {
    try {
        const authStatus = await messaging().requestPermission();
        const isAuthorized =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (isAuthorized) {
            const fcmToken = await messaging().getToken();
            console.log("FCM Token (Mobile):", fcmToken);

            // Ajouter un écouteur pour les messages en premier plan
            messaging().onMessage(async (payload) => {
                console.log("Message reçu en premier plan (Mobile) :", payload);
            });

            return { platform: "Mobile", token: fcmToken };
        } else {
            console.warn("Les permissions de notification push ont été refusées.");
            return { platform: "Mobile", token: null };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token FCM (Mobile) :", error);
        return { platform: "Mobile", token: null };
    }
};

// Fonction principale pour récupérer le token FCM selon la plateforme
export const requestFcmToken = async (): Promise<{ platform: string; token: string | null }> => {
    if (Platform.OS === "web") {
        return await requestFcmTokenWeb();
    } else {
        return await requestFcmTokenMobile();
    }
};

// Exporter l'objet messaging pour d'autres usages
export { messaging };
export default app;
