import {HttpContext} from "@adonisjs/core/http";
import cryptoRandomString from "crypto-random-string";
import User from "#models/user";
import twoFactor from 'node-2fa'
import QRCode from 'qrcode'
import { log } from "console";


export default class DoubleAuthsController {
    private issuer = 'adonisjs-2fa'

    async toggleTwoFactorAuth({auth, response,request}: HttpContext) {
        const user = auth.use('api').user
        user.isTwoFactorEnabled = request.input('isTwoFactorEnabled')
        if (user) {
            if (user.isTwoFactorEnabled) {
                user.twoFactorSecret = this.generateSecret(user)
                user.twoFactorRecoveryCodes = await this.generateRecoveryCodes()
                await user.save()
                const qrCode = await this.generateQrCode(user)
                return response.status(200).json({code: qrCode})
            } else {
                user.twoFactorSecret = null
                user.twoFactorRecoveryCodes = null
                await user.save()
                return response.status(200).json({message: '2FA Désactivé'})
            }
        }
    }

    async isTwoFactorEnabled({ auth, response }: HttpContext) {
        const user = auth.use('api').user
        if (user) {
            return response.status(200).json({message: user.isTwoFactorEnabled})
        }
        return response.status(401).json({message: 'Unauthorized'})
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

    protected async checkDoubleAuth({ request, auth, response }: HttpContext) {
        console.log('checkDoubleAuth')
        const { otpCode } = request.only(['otpCode']);
        const user = auth.use('api').user;
        console.log(otpCode);
        if (user) {
            if (otpCode) {
                const isValid = twoFactor.verifyToken(user.twoFactorSecret as string, otpCode);
                console.log(isValid);
                if (isValid?.delta === 0) {
                    user.isTwoFactorEnabled = true;
                    await user.save();
                    return response.status(200).json({ message: true });
                }
                else{
                    user.isTwoFactorEnabled = false;
                    await user.save();
                    return response.status(200).json({ message: false });
                }
            }
        }
        return response.status(401).json({ message: 'Unauthorized' });
    }

}
