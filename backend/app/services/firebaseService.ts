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
        console.log('Fichier serviceAccountKey.json téléchargé avec succès.');

        // Initialiser Firebase Admin
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase Admin initialisé avec succès.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Firebase Admin :', error.message);
        throw error;
    }
})();

export default admin;
