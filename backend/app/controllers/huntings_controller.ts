import { HttpContext } from '@adonisjs/core/http'
import Hunting from '#models/hunting'
import { getLastMessagesForHunts } from '#services/firebase_service'
import UsersHunting from '#models/users_hunting'

export default class HuntingsController {
  public async getAllHuntings({ auth, response }: HttpContext) {

    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated', success: false })
    }

    try {
      const huntings = await Hunting.query().orderBy('id', 'desc')

      return response.json({
        message: 'Liste des chasses récupérée avec succès',
        success: true,
        huntings,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses :', error)

      return response.internalServerError({
        message: 'Erreur lors de la récupération des chasses',
        success: false,
      })
    }
  }

  public async getPublicHuntings({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated', success: false })
    }
  
    try {
      const huntings = await Hunting.query()
        .where('private', false)
        .orderBy('id', 'desc')
  
      return response.json({
        message: 'Liste des chasses publiques récupérée avec succès',
        success: true,
        huntings,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses publiques :', error)
      return response.internalServerError({
        message: 'Erreur lors de la récupération des chasses publiques',
        success: false,
      })
    }
  }
  

  async getHuntingsParticpatedOrOrganized({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

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
        return {
          id,
          role,
          message,
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
        message: 'Erreur lors de la récupération des chasses.',
      })
    }
  }
}
