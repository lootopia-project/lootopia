import { HttpContext } from '@adonisjs/core/http'
import Hunting from '#models/hunting'
import { getLastMessagesForHunts } from '#services/firebase_service'
import UsersHunting from '#models/users_hunting'
import i18nManager from '@adonisjs/i18n/services/main'


export default class HuntingsController {
  public async getAllHuntings({ auth, response }: HttpContext) {

    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated', success: false })
    }

    const i18n = i18nManager.locale(user.lang)

    try {
      const huntings = await Hunting.query().orderBy('id', 'desc')

      return response.json({
        message: i18n.t('_.Huntings List Succuess'),
        success: true,
        huntings,
      })
    } catch (error) {
      console.error('_.Error getting huntings:', error)
      return response.internalServerError({
        message: i18n.t('_.Error getting huntings'),
        success: false,
      })
    }
  }

  public async getPublicHuntings({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated', success: false })
    }

    const i18n = i18nManager.locale(user.lang)

    try {
      const huntings = await Hunting.query()
        .where('private', false)
        .orderBy('id', 'desc')
  
      return response.json({
        message: i18n.t('_.Public Huntings List Succuess'),

        success: true,
        huntings,
      })
    } catch (error) {
      console.error('Error getting public huntings:', error)
      return response.internalServerError({
        message: i18n.t('_.Error getting public huntings'),
        success: false,
      })
    }
  }
  

  async getHuntingsParticpatedOrOrganized({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }
    const i18n = i18nManager.locale(user.lang)

    try {
      const organizedHuntings = await Hunting.query().where('userId', user.id).select('id')

      const participatedHuntings = await UsersHunting.query()
        .where('user_id', user.id)
        .select('hunting_id')
      const huntIds = [
        ...organizedHuntings.map((hunting) => hunting.id),
        ...participatedHuntings.map((userHunting) => userHunting.huntingId),
      ]


      const huntMessages = await getLastMessagesForHunts(huntIds, 1)

      let lastMessage = huntIds.map((id) => {
        const role = organizedHuntings.some((hunting) => hunting.id === id)
          ? 'organizer'
          : 'participant'
        const message = huntMessages.find((hunt) => hunt.huntId === id)?.lastMessage
        const type = huntMessages.find((hunt) => hunt.huntId === id)?.type
        return {
          id,
          role,
          message,
          type,
        }
      })

      lastMessage = lastMessage.sort((a, b) => {
        const dateA = a.message?.date ? new Date(a.message.date).getTime() : 0
        const dateB = b.message?.date ? new Date(b.message.date).getTime() : 0
        return dateB - dateA
      })

      const lastMessageHunting = {
        lastMessage,
        user,
      }

      return response.ok(lastMessageHunting)
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses :', error)
      return response.internalServerError({
        message: i18n.t('_.Error getting huntings'),
      })
    }
  }
}
