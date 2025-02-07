import admin, { adminDatabase } from '#services/firebase_admin'

export const getLastMessagesForHunts = async (
  huntIds: number[],
  limit: number
): Promise<Record<string, any>[]> => {
  try {
    const db = adminDatabase // Réutilisation de l'instance Firebase Admin
    const results: Record<string, any>[] = []

    for (const huntId of huntIds) {
      const ref = db.ref(`treasureHunts/${huntId}/messages`)
      const snapshot = await ref.limitToLast(limit).once('value')

      if (snapshot.exists()) {
        const messages: Record<string, any>[] = []
        snapshot.forEach((child) => {
          messages.push({
            id: child.key,
            ...child.val(),
          })
        })

        // Trier les messages par timestamp
        const sortedMessages = messages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        // Récupérer le dernier message après tri
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
