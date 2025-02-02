import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import https from "https";
import env from "#start/env";

const serviceAccountUrl = env.get("FIREBASE_SERVICE_ACCOUNT_PATH")||"";
const databaseUrl = env.get("FIREBASE_DATABASE_URL")||"";


// Fonction pour télécharger la clé privée
const fetchServiceAccount = async (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
        https.get(serviceAccountUrl, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Échec du téléchargement de la clé privée : Code ${response.statusCode}`));
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
                    reject(new Error(`Erreur lors de l'analyse de la clé privée : ${error.message}`));
                }
            });
        }).on("error", (error) => {
            reject(new Error(`Erreur lors du téléchargement de la clé privée : ${error.message}`));
        });
    });
};

// Initialisation ou récupération de l'application Firebase Admin
const initializeFirebaseAdmin = async () => {
    try {
        const serviceAccount = await fetchServiceAccount();

        if (!getApps().length) {
            initializeApp({
                credential: cert(serviceAccount),
                databaseURL: databaseUrl,
            });
        }
        return getDatabase();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de Firebase Admin :", error.message);
        throw error;
    }
};

export const adminDatabase = await initializeFirebaseAdmin();
