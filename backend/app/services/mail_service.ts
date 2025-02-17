import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'
import env from '#start/env'
import AuthAccessToken from '#models/auth_access_token'
import { DateTime } from 'luxon';
import { TokenService } from '#services/token_service'

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
      case 'checkMail':
        const nowLuxon = DateTime.now();
        const expires24HLuxon = nowLuxon.plus({ hours: 24 });

        const authAccessToken = await AuthAccessToken.create(
          {
            tokenableId: user.id,
            type: 'check_mail',
            hash: TokenService.generateRandomToken(),
            createdAt: nowLuxon,
            expiresAt: expires24HLuxon,
            abilities: ""
          }
        )
        subject = i18n.t('_.Check your email')
        view = 'emails/checkMail'
        templateData = {
          name: user.name,
          message: i18n.t('_.Please check your email for further instructions.'),
          object: subject,
          lang: user.lang,
          hello: i18n.t('_.hello'),
          url: `${env.get('FRONT_URL')}/user/checkMail?token=${authAccessToken.hash}`,
          url_text: i18n.t('_.Check'),
        }
        break;


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
