import { initializeApp, cert, getApps, getApp, deleteApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import axios from 'axios'
import env from '#start/env'

const serviceAccountUrl = env.get('FIREBASE_SERVICE_ACCOUNT_PATH') || ''
const databaseUrl = env.get('FIREBASE_DATABASE_URL') || ''

// Fonction pour initialiser Firebase Admin
export const initializeFirebaseAdmin = async () => {
  try {
    // Supprimer les instances existantes pour éviter les conflits
    if (getApps().length > 0) {
      await deleteApp(getApp())
    }

    // Télécharger le fichier serviceAccountKey
    const { data: serviceAccount } = await axios.get(serviceAccountUrl)

    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: databaseUrl,
    })

    return getDatabase()
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de Firebase Admin :", error.message)
    throw error
  }
}

// Exporter l'instance globale de la base de données Firebase Admin
export const adminDatabase = await initializeFirebaseAdmin()
