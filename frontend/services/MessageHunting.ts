import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import {firebaseConfig} from "@/config/firebaseConfig";



// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Fonction pour connecter anonymement un utilisateur
const authenticateUser = async (): Promise<void> => {
    try {
        await signInAnonymously(auth);
    } catch (error) {
        console.error("Erreur lors de la connexion anonyme :", error);
        throw error;
    }
};

// Fonction pour récupérer les données
export const fetchTreasureHunt = async (huntId: string) => {
    try {
        // Authentifiez l'utilisateur avant de récupérer les données
        await authenticateUser();

        const dbRef = ref(database);

        const snapshot = await get(child(dbRef, `treasureHunts/${huntId}`));

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.warn("Aucune donnée trouvée pour ce huntId !");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};
