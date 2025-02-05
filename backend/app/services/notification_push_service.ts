import admin from 'firebase-admin'
import User from '#models/user'
import i18nManager from '@adonisjs/i18n/services/main'

export class NotificationPushService {
  /**
   * Envoie une notification push basée sur un type donné.
   * @param type Type de la notification (ex: "welcome", "reward", "payment").
   * @param user Utilisateur qui recevra la notification.
   */
  static async sendPushNotification(type: string, user: User) {
    const i18n = i18nManager.locale(user.lang)

    // Récupérer les jetons FCM de l'utilisateur
    const userTokens = await user.related('fcmTokens').query()

    if (userTokens.length === 0) {
      throw new Error(`Aucun jeton FCM trouvé pour l'utilisateur ${user.id}`)
    }

    // Définir le titre et le message en fonction du type
    let title = ''
    let body = ''
    switch (type) {
      case 'welcome':
        title = i18n.t('Welcome to Lootopia!')
        body = i18n.t('Thank you for joining Lootopia. Enjoy your experience!')
        break

      case 'reward':
        title = i18n.t('Rewards unlocked!')
        body = i18n.t('You have received a new reward. Check your profile for more details.')
        break

      case 'payment':
        title = i18n.t('Payment confirmed')
        body = i18n.t('Your payment has been successfully processed. Thank you for your trust.')
        break

      default:
        throw new Error(`Type de notification inconnu : ${type}`)
    }

    // Préparer les notifications pour chaque jeton
    const messages = userTokens.map((token) => ({
      token: token.fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        type,
      },
    }))

    // Envoyer les notifications via Firebase Admin SDK
    try {
      const responses = await Promise.all(
        messages.map((message) => admin.messaging().send(message))
      )
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications push :", error)
      throw error
    }
  }
}
