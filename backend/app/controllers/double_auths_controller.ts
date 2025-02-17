import { HttpContext } from '@adonisjs/core/http'
import cryptoRandomString from 'crypto-random-string'
import User from '#models/user'
import twoFactor from 'node-2fa'
import QRCode from 'qrcode'
import { sendNotification } from '#services/send_notification_service'

export default class DoubleAuthsController {
  private issuer = 'adonisjs-2fa'

  async toggleTwoFactorAuth({ auth, response, request }: HttpContext) {
    const user = auth.use('api').user
    const isTwoFactorEnabled = request.input('isTwoFactorEnabled')
    if (user) {
      if (isTwoFactorEnabled) {
        user.twoFactorSecret = this.generateSecret(user)
        user.twoFactorRecoveryCodes = await this.generateRecoveryCodes()
        await user.save()
        const qrCode = await this.generateQrCode(user)
        return response.status(200).json({ code: qrCode })
      } else {
        user.isTwoFactorEnabled = false
        await user.save()
        return response.status(200).json({ message: '2FA Désactivé' })
      }
    }
  }

  async isTwoFactorEnabled({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      return response.status(200).json({ message: user.isTwoFactorEnabled })
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

  private async generateRecoveryCodes() {
    const recoveryCodeLimit: number = 8
    const codes: string[] = []
    for (let i = 0; i < recoveryCodeLimit; i++) {
      const recoveryCode: string = `${await this.secureRandomString()}-${await this.secureRandomString()}`
      codes.push(recoveryCode)
    }
    return codes
  }

  private async secureRandomString() {
    return cryptoRandomString({ length: 10, type: 'hex' })
  }

  private generateSecret(user: User) {
    const secret = twoFactor.generateSecret({ name: this.issuer, account: user.email })
    return secret.secret
  }

  private async generateQrCode(user: User) {
    const appName = encodeURIComponent(this.issuer)
    const userName = encodeURIComponent(user.email)
    const query = `?secret=${user.twoFactorSecret}&issuer=${appName}`
    const url = `otpauth://totp/${appName}${userName}${query}`
    const svg = await QRCode.toDataURL(url)
    return { svg, url }
  }

  async validateTwoFactorCode({ request, auth, response }: HttpContext) {
    const { otpCode } = request.only(['otpCode'])
    const user = auth.use('api').user
    if (user) {
      if (otpCode) {
        const isValid = twoFactor.verifyToken(user.twoFactorSecret as string, otpCode)
        if (isValid?.delta === 0) {
          user.isTwoFactorEnabled = true
          await user.save()
          return response.status(200).json({ message: true })
        } else {
          user.isTwoFactorEnabled = false
          await user.save()
          return response.status(200).json({ message: false })
        }
      }
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

  async checkDoubleAuth({ request, response, auth }: HttpContext) {
    const { otpCode, email, fcmToken } = request.all()
    const user = await User.findBy('email', email)
    if (user) {
      const isValid = twoFactor.verifyToken(user.twoFactorSecret as string, otpCode)
      if (isValid?.delta === 0) {
        const head = await auth.use('api').authenticateAsClient(user, [], { expiresIn: '1day' })
        sendNotification(fcmToken, user, 'Login successful', 'You are now logged in')
        return response.status(200).json({ message: head })
      }
      return response.status(200).json({ message: false })
    }
  }

  protected async recoveryCode({ auth, response }: HttpContext) {
    console.log('recoveryCode')
    const user = auth.use('api').user
    if (user) {
      return response.status(200).json(user.twoFactorRecoveryCodes)
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

  protected async checkRecoveryCode({ request, response, auth }: HttpContext) {
    const { recoveryCode, email, fcmToken } = request.only(['recoveryCode', 'email', 'fcmToken'])
    const user = await User.findBy('email', email)
    if (user) {
      const codes = user.twoFactorRecoveryCodes ?? []
      if (codes.includes(recoveryCode)) {
        user.twoFactorRecoveryCodes = codes.filter((c) => c !== recoveryCode)
        await user.save()
        sendNotification(fcmToken, user, 'Login successful', 'You are now logged in')
        const head = await auth.use('api').authenticateAsClient(user, [], { expiresIn: '1day' })
        return response.status(200).json({ message: head })
      }
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }
}
