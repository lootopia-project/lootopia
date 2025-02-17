import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import UserFcmToken from '#models/user_fcm_token'
import fetch from 'node-fetch'
import admin from '#services/firebase_admin'
import i18nManager from '@adonisjs/i18n/services/main'
import axios from 'axios'

export default class AuthController {
  async login({ request, auth, response }: HttpContext) {
    const { email, password, fcmToken } = request.all()

    const verifyCredentials = await User.verifyCredentials(email, password)

    if (verifyCredentials) {
      const i18n = i18nManager.locale(verifyCredentials.lang)
      const head = await auth
        .use('api')
        .authenticateAsClient(verifyCredentials, [], { expiresIn: '1day' })

      // Sauvegarder ou mettre à jour le token FCM si fourni
      if (fcmToken) {
        // Mettre à jour ou créer un token FCM associé à l'utilisateur
        await UserFcmToken.updateOrCreate(
          { userId: verifyCredentials.id }, // Critères de recherche
          { fcmToken } // Données à mettre à jour
        )

        try {
          if (fcmToken.platform === 'Mobile') {
            // Envoi via Expo pour les appareils mobiles
            const expoPushToken = fcmToken.token

            if (!expoPushToken.startsWith('ExponentPushToken')) {
              throw new Error('Le token Expo Push fourni est invalide.')
            }

            const message = {
              to: expoPushToken,
              title: i18n.t('_.Login successful'),
              body: i18n.t('_.Hello {name}, you are now logged in.', {
                name: verifyCredentials.name,
              }),
            }

            const expoResponse = await axios.post(
              'https://exp.host/--/api/v2/push/send',
              message,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )

            expoResponse.data
          } else if (fcmToken.platform === 'Web') {
            const message = {
              notification: {
                title: i18n.t('_.Login successful'),
                body: i18n.t('_.You are now logged in'),
              },
              token: fcmToken.token,
            }

            await admin.messaging().send(message)
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi de la notification :", error.message || error)
        }
      }
      return response.json(head)
    }
  }

  async register({ request, response }: HttpContext) {
    const { email, password } = request.all()

    const USER_VERIFY = await User.findBy('email', email)
    if (USER_VERIFY) {
      return response.status(201).json({ message: 'User already exists' })
    }
    const newUser = await User.create({
      email: email,
      password: password,
    })

    return response.json({ message: true })
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
      const lang = user.lang
      return response.status(200).json({ message: true, lang: lang, img: user.img })
    }
    return response.status(200).json({ message: false })
  }
}
