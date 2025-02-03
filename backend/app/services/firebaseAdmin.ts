import { initializeApp, cert, getApps, getApp, deleteApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import https from "https";
import env from "#start/env";

const serviceAccountUrl = env.get("FIREBASE_SERVICE_ACCOUNT_PATH") || "";
const databaseUrl = env.get("FIREBASE_DATABASE_URL") || "";




const fetchServiceAccount = async (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {

        https.get(serviceAccountUrl, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`❌ Échec du téléchargement de la clé privée : Code ${response.statusCode}`));
            }

            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                try {
                    const serviceAccount = JSON.parse(data);
                    resolve(serviceAccount);
                } catch (error) {
                    console.error("❌ Erreur lors de l'analyse de la clé privée :", error);
                    reject(new Error(`Erreur JSON : ${error.message}`));
                }
            });
        }).on("error", (error) => {
            console.error("❌ Erreur lors du téléchargement de la clé privée :", error);
            reject(new Error(`Erreur de connexion : ${error.message}`));
        });
    });
};

// ✅ Fonction pour initialiser Firebase Admin avec vérification et rechargement
const initializeFirebaseAdmin = async () => {
    try {

        const serviceAccount = await fetchServiceAccount();

        if (getApps().length > 0) {
            await deleteApp(getApp());
        }

        initializeApp({
            credential: cert(serviceAccount),
            databaseURL: databaseUrl, // ✅ URL Firebase
        });


        let db = getDatabase();

        if (!db) {
            // Supprimer l'application Firebase Admin si elle existe déjà
            // if (getApps().length > 0) {
            //     console.log("🔄 Suppression de l'ancienne instance Firebase Admin...");
            //     await deleteApp(getApp());
            // }
            initializeApp({
                credential: cert(serviceAccount),
                databaseURL: databaseUrl, // ✅ URL Firebase
            });

            db = getDatabase();
        }

        return db;
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de Firebase Admin :", error.message);
        throw error;
    }
};


export const adminDatabase = await initializeFirebaseAdmin();
