import admin from 'firebase-admin'
import User from '#models/user'

export class NotificationPushService {
    /**
     * Envoie une notification push basée sur un type donné.
     * @param type Type de la notification (ex: "welcome", "reward", "payment").
     * @param user Utilisateur qui recevra la notification.
     */
    static async sendPushNotification(type: string, user: User) {
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
                title = 'Bienvenue sur Lootopia !'
                body = 'Merci de rejoindre Lootopia. Profitez de votre expérience !'
                break

            case 'reward':
                title = 'Récompenses débloquées !'
                body = 'Vous avez reçu une nouvelle récompense. Consultez votre profil pour en savoir plus.'
                break

            case 'payment':
                title = 'Paiement confirmé'
                body = 'Votre paiement a été traité avec succès. Merci pour votre confiance.'
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
            console.log('Notifications envoyées avec succès :', responses)
        } catch (error) {
            console.error('Erreur lors de l\'envoi des notifications push :', error)
            throw error
        }
    }
}
