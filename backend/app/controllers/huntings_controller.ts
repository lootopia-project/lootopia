import { HttpContext } from '@adonisjs/core/http'
import Hunting from '#models/hunting'
import { getLastMessages, getLastMessagesForHunts } from '#services/firebase_service'
import UsersHunting from "#models/users_hunting";
import db from "@adonisjs/lucid/services/db";

export default class HuntingsController {
  async getHuntingsParticpatedOrOrganized({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    try {
      // Récupération des chasses organisées
      const organizedHuntings = await Hunting.query().where('userId', user.id).select('id')

      const participatedHuntings=await UsersHunting.query().where('user_id', user.id).select('hunting_id')
      console.log(participatedHuntings)
      // Fusionner les IDs des chasses
      const huntIds = [
        ...organizedHuntings.map((hunting) => hunting.id),
        ...participatedHuntings.map((userHunting) => userHunting.huntingId),
      ]

      // Récupérer les derniers messages pour chaque chasse
      const huntMessages = await getLastMessagesForHunts(huntIds, 1)

      // Associer les rôles (organizer/participant) et les derniers messages
      let hunts = huntIds.map((id) => {
        const role = organizedHuntings.some((hunting) => hunting.id === id)
          ? 'organizer'
          : 'participant'
        const lastMessage = huntMessages.find((hunt) => hunt.huntId === id)?.lastMessage

        return {
          id,
          role,
          lastMessage,
        }
      })

      hunts = hunts.sort((a, b) => {
        const dateA = a.lastMessage?.date ? new Date(a.lastMessage.date).getTime() : 0
        const dateB = b.lastMessage?.date ? new Date(b.lastMessage.date).getTime() : 0
        return dateB - dateA // Tri descendant
      })

      return response.ok(hunts)
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses :', error)
      return response.internalServerError({
        message: 'Erreur lors de la récupération des chasses.',
      })
    }
  }
}
