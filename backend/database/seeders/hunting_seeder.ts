import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hunting from '#models/hunting'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { DateTime } from 'luxon'
import World from '#models/world'
import UsersHunting from '#models/users_hunting'
import { adminDatabase } from '#services/firebase_admin'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    const kevin: User = await db.from('users').where('nickname', 'kevin').first()
    const anthony: User = await db.from('users').where('nickname', 'anthony').first()
    const yassine: User = await db.from('users').where('nickname', 'yassine').first()
    const nameNoeud=env.get('NAME_NOEUD_FIREBASE')

    if (!kevin || !anthony || !yassine) {
      console.error('Un ou plusieurs utilisateurs sont introuvables.')
      return
    }

    let worldId: number
    const world = await World.first()
    if (!world) {
      const newWorld = await World.create({ name: 'Monde Par Défaut' })
      worldId = newWorld.id
    } else {
      worldId = world.id
    }

    const huntings = await Hunting.createMany([
      {
        title: 'Chasse au trésor mystique',
        description: 'Explorez les ruines antiques pour dénicher un trésor oublié.',
        price: 55,
        minUser: 2,
        maxUser: 5,
        private: false,
        endDate: DateTime.now().plus({ days: 7 }),
        searchDelay: '02:00:00',
        status: true,
        background: 'https://example.com/bg1.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: kevin.id,
        worldId,
      },
      {
        title: 'Chasse du coffre doré',
        description: "Trouvez le coffre légendaire rempli d'or et de mystères.",
        price: 60,
        minUser: 3,
        maxUser: 6,
        private: false,
        endDate: DateTime.now().plus({ days: 8 }),
        searchDelay: '01:30:00',
        status: true,
        background: 'https://example.com/bg2.jpg',
        textColor: '#FFD700',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: anthony.id,
        worldId,
      },
      {
        title: 'Expédition dans la jungle perdue',
        description: 'Pénétrez au cœur de la jungle pour retrouver des trésors cachés.',
        price: 50,
        minUser: 2,
        maxUser: 5,
        private: false,
        endDate: DateTime.now().plus({ days: 9 }),
        searchDelay: '02:15:00',
        status: true,
        background: 'https://example.com/bg3.jpg',
        textColor: '#228B22',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: yassine.id,
        worldId,
      },
      {
        title: 'Aventure sous-marine',
        description: 'Plongez dans les abysses pour découvrir des trésors engloutis.',
        price: 65,
        minUser: 2,
        maxUser: 4,
        private: false,
        endDate: DateTime.now().plus({ days: 6 }),
        searchDelay: '02:30:00',
        status: true,
        background: 'https://example.com/bg4.jpg',
        textColor: '#00BFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: kevin.id,
        worldId,
      },
      {
        title: 'Mystère du désert brûlant',
        description: 'Traversez un désert aride pour révéler des secrets enfouis sous le sable.',
        price: 70,
        minUser: 3,
        maxUser: 6,
        private: false,
        endDate: DateTime.now().plus({ days: 10 }),
        searchDelay: '02:00:00',
        status: true,
        background: 'https://example.com/bg5.jpg',
        textColor: '#FFA500',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: anthony.id,
        worldId,
      },
      {
        title: 'Expédition polaire',
        description: 'Affrontez le froid glacial et découvrez des trésors dans les terres gelées.',
        price: 80,
        minUser: 2,
        maxUser: 5,
        private: false,
        endDate: DateTime.now().plus({ days: 5 }),
        searchDelay: '01:45:00',
        status: true,
        background: 'https://example.com/bg6.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: yassine.id,
        worldId,
      },
      {
        title: 'Aventure en haute montagne',
        description:
          'Gravissez les sommets pour trouver des trésors cachés dans la neige éternelle.',
        price: 75,
        minUser: 3,
        maxUser: 7,
        private: false,
        endDate: DateTime.now().plus({ days: 8 }),
        searchDelay: '02:00:00',
        status: true,
        background: 'https://example.com/bg7.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: kevin.id,
        worldId,
      },
      {
        title: 'Chasse dans la cité oubliée',
        description: 'Parcourez les ruines d’une cité ancienne pour redécouvrir ses secrets.',
        price: 60,
        minUser: 2,
        maxUser: 6,
        private: false,
        endDate: DateTime.now().plus({ days: 7 }),
        searchDelay: '01:30:00',
        status: true,
        background: 'https://example.com/bg8.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: anthony.id,
        worldId,
      },
      {
        title: 'Légende du coffre maudit',
        description: 'Trouvez le coffre maudit et brisez la malédiction qui pèse sur lui.',
        price: 55,
        minUser: 2,
        maxUser: 5,
        private: false,
        endDate: DateTime.now().plus({ days: 9 }),
        searchDelay: '02:15:00',
        status: true,
        background: 'https://example.com/bg9.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: yassine.id,
        worldId,
      },
      {
        title: 'Aventure des cavernes oubliées',
        description: 'Explorez des cavernes secrètes pour découvrir des trésors mystérieux.',
        price: 65,
        minUser: 3,
        maxUser: 5,
        private: false,
        endDate: DateTime.now().plus({ days: 10 }),
        searchDelay: '02:00:00',
        status: true,
        background: 'https://example.com/bg10.jpg',
        textColor: '#FFFFFF',
        headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        userId: kevin.id,
        worldId,
      },
    ])

    const hunting2 = huntings[1]

    await UsersHunting.createMany([
      {
        userId: kevin.id,
        huntingId: hunting2.id,
        score: 0,
        opinion: 'Aucune opinion',
      },
      {
        userId: yassine.id,
        huntingId: hunting2.id,
        score: 0,
        opinion: 'Aucune opinion',
      },
    ])

    // ✅ Synchro des chasses vers Firebase Realtime Database
    const treasureHuntsRef = adminDatabase.ref(nameNoeud)
    await treasureHuntsRef.remove(); // 🧹 Vide tout le contenu du noeud `nameNoeud`


    for (const hunt of huntings) {
      const organizer =
        hunt.userId === kevin.id ? 'kevin' :
        hunt.userId === anthony.id ? 'anthony' :
        hunt.userId === yassine.id ? 'yassine' : 'unknown'

        await treasureHuntsRef
        .child(`hunting_chat/${hunt.id}`)
        .set({
          id: hunt.id,
          title: hunt.title,
          description: hunt.description,
          organizer,
          messages: {
            '0': {
              sender: organizer,
              text: 'Bienvenue dans la chasse au trésor !',
              timestamp: new Date().toISOString(),
            },
          },
          type: 'group',
        })
      
    }
  }
}
