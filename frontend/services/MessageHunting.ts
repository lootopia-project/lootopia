import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import {
    getAuth,
    signInAnonymously,
    setPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import { firebaseConfig } from "@/config/firebaseConfig";

// ✅ Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const nameNoeud = process.env.EXPO_PUBLIC_NAME_NOEUD_FIREBASE as string;
// ✅ Initialisation de Firebase Auth
const auth = getAuth(app);

// ✅ Gestion des erreurs silencieuses Firebase
const originalConsoleError = console.error;
console.error = (message?: any, ...optionalParams: any[]): void => {
    if (typeof message === "string" && message.includes(" @firebase/auth")) {
        return;
    }
    if (
        optionalParams.some(
            (param) =>
                typeof param === "object" &&
                param?.message?.includes("INTERNAL ASSERTION FAILED: Expected a class definition")
        )
    ) {
        return;
    }
    originalConsoleError(message, ...optionalParams);
};

// ✅ Configuration de la persistance
const configurePersistence = async () => {
    try {
        await setPersistence(auth, browserSessionPersistence);
    } catch (error) {
        console.error("❌ Erreur lors de la configuration de la persistance :", error);
    }
};

// ✅ Authentification anonyme
const authenticateUser = async (): Promise<void> => {
    try {
        await configurePersistence();

        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'authentification anonyme :", error);
    }
};

const database = getDatabase(app);

// ✅ Fonction pour récupérer une chasse au trésor
export const fetchTreasureHunt = async (huntId: string): Promise<any> => {
    try {
        await authenticateUser();

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `${nameNoeud}/hunting_chat/${huntId}`));

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.warn("⚠️ Aucune donnée trouvée pour ce huntId !");
            return null;
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error);
        return null; // Retourner une valeur par défaut pour éviter un crash
    }
};

// ✅ Exportation des instances Firebase
export { app, auth, database };
