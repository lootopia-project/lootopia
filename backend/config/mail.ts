import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'
import { InferMailers } from '@adonisjs/mail/types'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      secure: true,

      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME') ?? '',
        pass: env.get('SMTP_PASSWORD') ?? '',
      },
      tls: {},

      ignoreTLS: false,
      requireTLS: false,

      pool: false,
      maxConnections: 5,
      maxMessages: 100,
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
