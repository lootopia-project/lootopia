import type { HttpContext } from '@adonisjs/core/http'
import { generateRandomImageName, uploadBase64ImageToAzureStorage } from '#services/azure_service'
import env from '#start/env'
import User from '#models/user'
import i18nManager from '@adonisjs/i18n/services/main'
const AZURE_ACCOUNT_NAME = env.get('AZURE_ACCOUNT_NAME') || ''
const AZURE_ACCOUNT_KEY = env.get('AZURE_ACCOUNT_KEY') || ''
const AZURE_CONTAINER_PROFIL_IMAGE = env.get('AZURE_CONTAINER_PROFIL_IMAGE') || ''

export default class UsersController {
  async getInfoUser({ auth }: HttpContext) {
    const user = auth.user
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      isPartner: user.isPartner,
      img: user.img,
      nickname: user.nickname,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      phone: user.phone,
      lang: user.lang,
      checkMail: user.checkMail,
    }
  }

  async updateInfoUser({ response, auth, request }: HttpContext) {
    const user = auth.user
    const i18n = i18nManager.locale(user.lang)
    const {
      email,
      name,
      surname,
      isPartner,
      img,
      nickname,
      isTwoFactorEnabled,
      phone,
      lang,
      checkMail,
    } = request.body()

    let image = img
    if (img.includes('data:image')) {
      const matches = img.match(/^data:image\/(\w+);base64,/)
      //
      const extension = matches[1]
      image = await uploadBase64ImageToAzureStorage(
        img,
        generateRandomImageName(extension),
        AZURE_ACCOUNT_NAME,
        AZURE_ACCOUNT_KEY,
        AZURE_CONTAINER_PROFIL_IMAGE
      )
    }

    user.email = email
    user.name = name
    user.img = image
    user.surname = surname
    user.isPartner = isPartner
    user.nickname = nickname
    user.isTwoFactorEnabled = isTwoFactorEnabled
    user.phone = phone
    user.lang = lang
    user.checkMail = checkMail

    const updatedUser = await user.save()

    if (updatedUser) {
      return {
        success: true,
        message: i18n.t('_.User updated'),
      }
    } else {
      return {
        success: false,
        message: i18n.t('_.User not updated'),
      }
    }
  }
  async updatePassword({ response, auth, request }: HttpContext) {
    const user = auth.user
    const i18n = i18nManager.locale(user.lang)
    const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])
    try {
      await User.verifyCredentials(user.email, currentPassword)
      user.password = newPassword
      await user.save()

      return response.ok({
        success: true,
        message: i18n.t('_.Password updated'),
      })
    } catch {
      return response.ok({
        success: false,
        message: i18n.t('_.Invalid current password'),
      })
    }
  }
}
