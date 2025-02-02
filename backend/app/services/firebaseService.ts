import admin from 'firebase-admin';
import env from '#start/env';
import axios from 'axios';

(async () => {
    try {
        // Récupérer l'URL du fichier JSON depuis l'environnement
        const serviceAccountUrl = env.get('FIREBASE_SERVICE_ACCOUNT_PATH');
        if (!serviceAccountUrl) {
            throw new Error(
                "L'URL du fichier serviceAccountKey.json est manquante dans les variables d'environnement."
            );
        }

        // Télécharger le fichier JSON
        const { data: serviceAccount } = await axios.get(serviceAccountUrl);

        // Initialiser Firebase Admin
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Firebase Admin :', error.message);
        throw error;
    }
})();



export const getLastMessagesForHunts = async (
    huntIds: number[],
    limit: number
): Promise<Record<string, any>[]> => {
    try {
        // Récupérer la référence à la base de données Firebase
        const db = admin.database();
        const results: Record<string, any>[] = [];

        // Pour chaque chasse, récupérer les derniers messages
        for (const huntId of huntIds) {
            const ref = db.ref(`treasureHunts/${huntId}/messages`);
            const snapshot = await ref.limitToLast(limit).once("value");

            if (snapshot.exists()) {
                const messages: Record<string, any>[] = [];
                snapshot.forEach((child) => {
                    messages.push({
                        id: child.key,
                        ...child.val(),
                    });
                });

                // Ajouter les informations du dernier message à la chasse correspondante
                if (messages.length > 0) {
                    const lastMessage = messages[messages.length - 1]; // Dernier message
                    results.push({
                        huntId,
                        lastMessage: {
                            sender: lastMessage.sender,
                            text: lastMessage.text,
                            date: lastMessage.timestamp,
                        },
                    });
                } else {
                    results.push({
                        huntId,
                        lastMessage: null, // Aucun message pour cette chasse
                    });
                }
            } else {
                results.push({
                    huntId,
                    lastMessage: null, // Aucun message pour cette chasse
                });
            }
            console.log(results);
        }

        return results;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des derniers messages pour les chasses :",
            error
        );
        throw error;
    }
};

export default admin;
