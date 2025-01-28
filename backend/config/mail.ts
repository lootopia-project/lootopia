import { defineConfig, transports } from '@adonisjs/mail'
import env from '#start/env'
import { InferMailers } from '@adonisjs/mail/types'

const mailConfig = defineConfig({
  /**
   * Mailer par défaut (doit correspondre à un nom dans la liste des mailers ci-dessous)
   */
  mailer: 'smtp', // Déclarez "smtp" comme mailer par défaut

  /**
   * Liste des mailers
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'smtp.gmail.com'), // Hôte SMTP
      port: Number(env.get('SMTP_PORT', 587)), // Port SMTP
      secure: false, // TLS (STARTTLS pour le port 587)
      auth: {
        user: env.get('SMTP_USERNAME', ''), // Nom d'utilisateur SMTP
        pass: env.get('SMTP_PASSWORD', ''), // Mot de passe SMTP
        type: 'login', // Type d'authentification
      },
    }),
  },

  /**
   * Configuration pour les templates
   */
  views: {
    engine: 'edge', // Utilisation du moteur Edge pour les templates d'emails
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
