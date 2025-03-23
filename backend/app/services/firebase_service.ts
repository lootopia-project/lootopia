import { adminDatabase } from '#services/firebase_admin'
import env from '#start/env'

export const getLastMessagesForHunts = async (
  huntIds: number[],
  limit: number
): Promise<Record<string, any>[]> => {
  try {
    const db = adminDatabase
    const results: Record<string, any>[] = []
    const nameNoeud=env.get('NAME_NOEUD_FIREBASE')

    for (const huntId of huntIds) {
      const ref = db.ref(`${nameNoeud}/${huntId}/messages`)
      const snapshot = await ref.limitToLast(limit).once('value')

      if (snapshot.exists()) {
        const messages: Record<string, any>[] = []
        snapshot.forEach((child) => {
          messages.push({
            id: child.key,
            ...child.val(),
          })
        })

        const sortedMessages = messages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        if (sortedMessages.length > 0) {
          const lastMessage = sortedMessages[sortedMessages.length - 1]
          results.push({
            huntId,
            lastMessage: {
              sender: lastMessage.sender,
              text: lastMessage.text,
              date: lastMessage.timestamp,
            },
          })
        } else {
          results.push({
            huntId,
            lastMessage: null,
          })
        }
      } else {
        results.push({
          huntId,
          lastMessage: null,
        })
      }
    }

    return results
  } catch (error) {
    console.error(
      '❌ Erreur lors de la récupération des derniers messages pour les chasses :',
      error
    )
    throw error
  }
}
