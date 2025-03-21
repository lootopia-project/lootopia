import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import AuthAccessToken from '#models/auth_access_token'
import { sendNotification } from '#services/send_notification_service'
import { DateTime } from 'luxon'
import MailService from '#services/mail_service'
import i18nManager from '@adonisjs/i18n/services/main'
import hash from '@adonisjs/core/services/hash'

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
        await AuthAccessToken.create({
          tokenableId: verifyCredentials.id,
          hash: fcmToken,
          type: 'fcm',
          createdAt: DateTime.now(),
          expiresAt: null,
          abilities: '',
        })

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
    await User.create({
      email: email,
      password: password,
    })

    return response.json({ message: true })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.status(200).json({ message: true })
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

  async checkIsLogin({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      const lang = user.lang
      return response
        .status(200)
        .json({ message: true, lang: lang, img: user.img, crowns: user.crowns })
    }
    return response.status(200).json({ message: false })
  }

  async loginOrRegisterGoogle({ request, response, auth }: HttpContext) {
    const { email, firstName, lastName, img, provider, mode, fcmToken } = request.all()

    const USER_VERIFY = await User.findBy('email', email)
    if (USER_VERIFY && mode === 'register') {
      return response.json({ message: 'An account already exists with this email', success: false })
    } else if (USER_VERIFY && mode === 'login') {
      const head = await auth
        .use('api')
        .authenticateAsClient(USER_VERIFY, [], { expiresIn: '1day' })
      sendNotification(fcmToken, USER_VERIFY, 'Login successful', 'You are now logged in')
      const verifyCredentials = await User.findBy('email', email)
      if (verifyCredentials) {
        await AuthAccessToken.create({
          tokenableId: verifyCredentials.id,
          hash: fcmToken,
          type: 'fcm',
          createdAt: DateTime.now(),
          expiresAt: null,
          abilities: '',
        })
      }
      return response.json({ message: head, success: true })
    }

    await User.create({
      email: email,
      name: firstName,
      surname: lastName,
      img: img,
      provider: provider,
      password: '',
    })

    return response.json({ message: 'User created', success: true })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email, locale } = request.all()
    const i18n = i18nManager.locale(locale)

    const USER_VERIFY = await User.findBy('email', email)
    if (!USER_VERIFY || USER_VERIFY.provider === 'google') {
      return response.json({
        message: i18n.t(
          '_.An account with this email does not exist or is registered with a social account'
        ),
        success: false,
      })
    }

    await AuthAccessToken.create({
      tokenableId: USER_VERIFY.id,
      hash: '',
      type: 'password_reset',
      createdAt: DateTime.now(),
      expiresAt: DateTime.now().plus({ minutes: 15 }),
      abilities: '',
    })

    MailService.sendMail('password_reset', USER_VERIFY)

    return response.json({ message: i18n.t('_.Email sent'), success: true })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password, locale } = request.all()
    const i18n = i18nManager.locale(locale)
    const AUTH_ACCESS_TOKEN = await AuthAccessToken.query()
      .preload('user')
      .where('hash', token)
      .andWhere('expires_at', '>', new Date())
      .first()

    if (AUTH_ACCESS_TOKEN) {
      if (await hash.verify(AUTH_ACCESS_TOKEN.user.password, password)) {
        return response.json({
          message: i18n.t('_.Password is the same as the current one'),
          success: false,
        })
      }
      AUTH_ACCESS_TOKEN.user.password = password
      await AUTH_ACCESS_TOKEN.user.save()
      await AuthAccessToken.query()
        .where('tokenable_id', AUTH_ACCESS_TOKEN.user.id)
        .andWhere('type', 'password_reset')
        .delete()

      return response.json({ message: i18n.t('_.Password updated successfully'), success: true })
    }

    return response.json({ message: i18n.t('._Invalid or expired token'), success: false })
  }
}
