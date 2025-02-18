import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import UserFcmToken from '#models/user_fcm_token'
import { sendNotification } from '#services/send_notification_service'

export default class AuthController {
  async login({ request, auth, response }: HttpContext) {
    const { email, password, fcmToken } = request.all()

    const verifyCredentials = await User.verifyCredentials(email, password)

    if (verifyCredentials) {
      if (verifyCredentials.isTwoFactorEnabled) {
        return response.status(200).json({ message: '2FA' })
      }
      const head = await auth
        .use('api')
        .authenticateAsClient(verifyCredentials, [], { expiresIn: '1day' })

      if (fcmToken) {
        await UserFcmToken.updateOrCreate(
          { userId: verifyCredentials.id }, // Critères de recherche
          { fcmToken } // Données à mettre à jour
        )

        sendNotification(fcmToken, verifyCredentials, 'Login successful', 'You are now logged in')
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
