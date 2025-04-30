import { HttpContext } from '@adonisjs/core/http'
import Hunting from '#models/hunting'
import { getLastMessagesForHunts } from '#services/firebase_service'
import UsersHunting from '#models/users_hunting'
import i18nManager from '@adonisjs/i18n/services/main'

export default class HuntingsController {
  public async getAllHuntings({ auth, response }: HttpContext) {
    const user = auth.use('api').user
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
    const user = auth.use('api').user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated', success: false })
    }

    const i18n = i18nManager.locale(user.lang)

    try {
      const huntings = await Hunting.query()
        .orderBy('id', 'desc')
        .withCount('whitelist')
        .preload('items', (query) => {
          query
            .select(['id', 'name', 'description', 'img', 'price', 'rarityId'])
            .preload('rarity', (rarityQuery: any) => {
              rarityQuery.select(['id', 'name'])
            })
        })
        .preload('map', (mapQuery) => {
          mapQuery
            .select([
              'id',
              'name',
              'skin',
              'zone',
              'scale_min',
              'scale_max',
              'hunting_id',
              'cache_id',
            ])
            .preload('cache')
            .preload('spotMap', (spotMapQuery) => {
              spotMapQuery.preload('spot', (spotQuery) => {
                spotQuery.select(['id', 'lat', 'long', 'description', 'type_id'])
              })
            })
        })
      const formatted = await Promise.all(
        huntings.map(async (hunting) => {
          const data = {
            ...hunting.serialize(),
            participantCount: Number(hunting.$extras.whitelist_count),
          } as any

          if (hunting.userId === auth.user!.id) {
            const participants = await hunting
              .related('usersHunting')
              .query()
              .preload('user', (query) => {
                query.select(['id', 'nickname'])
              })

            data.participants = participants.map((p) => ({
              id: p.user.id,
              nickname: p.user.nickname,
            }))
          }

          return data
        })
      )

      console.log('Formatted huntings:', formatted)
      return response.json({
        message: i18n.t('_.Public Huntings List Succuess'),
        success: true,
        huntings: formatted,
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
    const user = auth.use('api').user
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
