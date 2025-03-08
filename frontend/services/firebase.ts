import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import * as Notifications from "expo-notifications";
import { getDatabase, ref, get, child } from "firebase/database";

import {firebaseConfig} from "@/config/firebaseConfig";


const app = initializeApp(firebaseConfig);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

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

const requestFcmTokenWeb = async (): Promise<{ platform: string; token: string | null }> => {
    const messaging = getMessaging(app);
    await deleteToken(messaging);

    try {

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./firebase-messaging-sw.js')
        } else {
            console.warn("Les Service Workers ne sont pas supportés par ce navigateur.");
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.warn("Les notifications push ne sont pas autorisées.");
            return { platform: "Web", token: null };
        }

        const fcmToken = await getToken(messaging, {
            vapidKey: process.env.EXPO_PUBLIC_FCM_PUBLIC_KEY,
        });
        onMessage(messaging, (payload) => {
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


export { Notifications,  getDatabase, ref, get, child,database };
export default app;
