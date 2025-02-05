// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import admin from 'firebase-admin'

export default class NotificationsController {
  async sendPushNotification({ request, response }: HttpContext) {
    const { fcmToken, title, body } = request.all()
    const message = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    }
    try {
      await admin.messaging().send(message)
      return response.ok({ message: 'Notification sent' })
    } catch (error) {
      return response.badRequest({ message: 'Failed to send notification' })
    }
  }
}
