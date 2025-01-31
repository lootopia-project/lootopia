import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import admin from "#services/firebaseService";
import UserFcmToken from "#models/user_fcm_token";

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
        console.log('fcmToken reçu:', fcmToken);

        // Mettre à jour ou créer un token FCM associé à l'utilisateur
        await UserFcmToken.updateOrCreate(
            { userId: verifyCredentials.id }, // Critères de recherche
            { fcmToken } // Données à mettre à jour
        );

        try {
          // Vérifier si le token FCM est une chaîne non vide
          console.log(!fcmToken || typeof fcmToken.token !== 'string');
          if (!fcmToken || typeof fcmToken.token !== 'string') {
            throw new Error('Le token FCM fourni est vide ou invalide.');
          }

          // Construire le message
          const message = {
            notification: {
              title: 'Connexion réussie',
              body: `Bonjour ${verifyCredentials.name}, vous êtes maintenant connecté.`,
            },
            token: fcmToken.token, // Utiliser le token FCM nettoyé
          };
          console.log('Message de notification construit:', message);

          // Envoyer la notification
          const result = await admin.messaging().send(message);
          console.log('Notification envoyée avec succès.', result);
        } catch (error) {
          console.error(
              'Erreur lors de l\'envoi de la notification :',
              error.message || error,
              error.stack || ''
          );

          if (error.code === 'messaging/invalid-payload') {
            console.error(
                'Le token FCM ou le message est invalide. Vérifiez que le token FCM correspond bien à un appareil inscrit.'
            );
          }
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
