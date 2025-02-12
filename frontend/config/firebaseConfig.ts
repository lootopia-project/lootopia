console.log("📢 Vérification de firebaseConfig :");
console.log("PROJECT_ID:", process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
console.log("DATABASE_URL:", process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL);

if (!process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || !process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL) {
    console.error("⚠️ ERREUR : Certaines variables Firebase sont manquantes !");
    throw new Error("Firebase config is missing required values.");
}

export const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

