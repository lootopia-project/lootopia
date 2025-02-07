import admin from 'firebase-admin'
import { cert, getApps } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import axios from 'axios'
import env from '#start/env'

const serviceAccountUrl = env.get('FIREBASE_SERVICE_ACCOUNT_PATH') || ''
const databaseUrl = env.get('FIREBASE_DATABASE_URL') || ''

// Vérifie si Firebase Admin est déjà initialisé
if (!getApps().length) {
  try {
    // Télécharger la clé privée
    const { data: serviceAccount } = await axios.get(serviceAccountUrl)

    // Initialisation de Firebase Admin
    admin.initializeApp({
      credential: cert(serviceAccount),
      databaseURL: databaseUrl,
    })
  } catch (error) {
    console.error("❌ Erreur d'initialisation de Firebase Admin :", error.message)
    throw error
  }
}

// **Exporter Firebase Admin et la base de données Firebase**
export const adminDatabase = getDatabase()
export default admin
