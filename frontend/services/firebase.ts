import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import * as Notifications from "expo-notifications";
import { getDatabase, ref, get, child } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialiser Firebase pour le web
const app = initializeApp(firebaseConfig);

// Configurer Expo Notifications pour le mobile
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Fonction pour afficher une notification
const showNotification = (title: string, body: string) => {
    if (Platform.OS === "web") {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        } else {
            console.warn("Les notifications ne sont pas autorisées par le navigateur.");
        }
    } else {
        Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: null,
        });
    }
};

// Fonction pour gérer les notifications Web avec Firebase
const requestFcmTokenWeb = async (): Promise<{ platform: string; token: string | null }> => {
    try {
        if ("serviceWorker" in navigator) {
            console.log("Enregistrement du Service Worker pour le Web.");
            await navigator.serviceWorker
                .register("./firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker enregistré :", registration.scope);
                });
        }

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

        onMessage(messaging, (payload) => {
            console.log("Message reçu en premier plan (Web) :", payload);

            if (payload.notification) {
                const { title, body } = payload.notification;
                showNotification(title || "Notification", body || "Vous avez une nouvelle notification.");
            }
        });

        return { platform: "Web", token: fcmToken };
    } catch (error) {
        console.error("Erreur lors de la récupération du token FCM (Web) :", error);
        return { platform: "Web", token: null };
    }
};

// Fonction pour gérer les notifications Mobile avec Expo Notifications
const requestFcmTokenMobile = async (): Promise<{ platform: string; token: string | null }> => {
    try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
            console.warn("Les permissions de notification push ont été refusées.");
            return { platform: "Mobile", token: null };
        }

        const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

        Notifications.addNotificationReceivedListener((notification) => {});

        return { platform: "Mobile", token: expoPushToken };
    } catch (error) {
        console.error("Erreur lors de la récupération du token Expo Push :", error);
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

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
const database = getDatabase(app);


// Exporter les objets nécessaires
export { Notifications,  getDatabase, ref, get, child,database };
export default app;
