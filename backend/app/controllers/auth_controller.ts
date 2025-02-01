import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import admin from "#services/firebaseService";
import UserFcmToken from "#models/user_fcm_token";
import fetch from 'node-fetch';

export default class AuthController {

  async login({ request, auth, response }: HttpContext) {
    const { email, password, fcmToken } = request.all();

    // Vérifiez les informations d'identification
    const verifyCredentials = await User.verifyCredentials(email, password);

    if (verifyCredentials) {
      // Authentifier l'utilisateur et générer un token d'accès
      const head = await auth
          .use('api')
          .authenticateAsClient(verifyCredentials, [], { expiresIn: '1day' });

      // Sauvegarder ou mettre à jour le token FCM si fourni
      if (fcmToken) {

        // Mettre à jour ou créer un token FCM associé à l'utilisateur
        await UserFcmToken.updateOrCreate(
            { userId: verifyCredentials.id }, // Critères de recherche
            { fcmToken } // Données à mettre à jour
        );

        try {
          if (fcmToken.platform === 'Mobile') {
            // Envoi via Expo pour les appareils mobiles
            const expoPushToken = fcmToken.token;

            if (!expoPushToken.startsWith('ExponentPushToken')) {
              throw new Error('Le token Expo Push fourni est invalide.');
            }

            // Construire le message
            const message = {
              to: expoPushToken,
              title: 'Connexion réussie',
              body: `Bonjour ${verifyCredentials.name}, vous êtes maintenant connecté.`,
            };

            // Envoyer la notification via l'API Expo
            const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            });

            const result = await expoResponse.json();
            console.log('Notification envoyée via Expo avec succès:', result);
          } else if (fcmToken.platform === 'Web') {
            // Envoi via Firebase pour les navigateurs Web
            const message = {
              notification: {
                title: 'Connexion réussie',
                body: `Bonjour ${verifyCredentials.name}, vous êtes maintenant connecté.`,
              },
              token: fcmToken.token, // Utiliser le token FCM pour le Web
            };

            const result = await admin.messaging().send(message);
            console.log('Notification envoyée via Firebase avec succès:', result);
          } else {
            console.warn('Plateforme non reconnue. Aucune notification envoyée.');
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de la notification :', error.message || error);
        }
      } else {
        console.warn('Aucun token FCM fourni. La notification ne sera pas envoyée.');
      }

      return response.json(head);
    } else {
      return response.unauthorized({ message: 'Invalid credentials' });
    }
  }





  async register({ request, response }: HttpContext) {
    const { email, password } = request.all()

    const USER_VERIFY = await User.findBy('email', email)
    if (USER_VERIFY) {
      return response.status(401).json({ message: 'User already exists' })
    }
    const newUser = await User.create({
      email: email,
      password: password,
    })

    return response.json(newUser)
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      db.from('auth_access_tokens').where('tokenable_id', user.id).delete().exec()
      return response.status(200).json({ message: true })
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

  async checkIsLogin({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      return response.status(200).json({ message: true })
    }
    return response.status(200).json({ message: false })
  }
}
