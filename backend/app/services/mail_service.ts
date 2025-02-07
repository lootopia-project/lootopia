import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'
import env from '#start/env'

export default class MailService {
  static async sendMail(type: string, user: User) {
    let subject = ''
    let view = ''
    let templateData: any = {}
    const i18n = i18nManager.locale(user.lang)
    switch (type) {
      case 'inscription':
        subject = i18n.t('_.Welcome to Lootopia!')
        view = 'emails/notification'
        templateData = {
          name: user.name,
          hello: i18n.t('_.hello'),
          message: i18n.t('_.Thank you for registering on Lootopia.'),
          objet: subject,
          lang: user.lang,
        }
        break

      case 'recompenses':
        subject = i18n.t('_.Congratulations on your awards!')
        view = 'emails/notification'
        templateData = {
          name: user.name,
          message: i18n.t("_.You've unlocked new rewards on Lootopia!"),
          hello: i18n.t('_.hello'),
          lang: user.lang,
          objet: subject,
        }
        break

      case 'paiement':
        subject = i18n.t('_.Payment confirmation')
        view = 'emails/notification'
        templateData = {
          name: user.name,
          message: i18n.t('_.Your payment has been processed successfully.'),
          objet: subject,
          lang: user.lang,
          hello: i18n.t('_.hello'),
        }
        break

      default:
        throw new Error(`Type d'email inconnu : ${type}`)
    }

    await mail.send((message) => {
      message
        .from(env.get('SMTP_USERNAME'))
        .to(user.email)
        .subject(subject)
        .htmlView(view, templateData)
    })
  }
}
