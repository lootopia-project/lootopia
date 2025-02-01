import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hunting from "#models/hunting";
import db from '@adonisjs/lucid/services/db'
import User from "#models/user";
import {DateTime} from "luxon";
import UsersHunting from "#models/users_hunting";
import World from "#models/world";

export default class extends BaseSeeder {
  async run() {
    const kevin :User=await db.from('users').where('nickname', 'kevin').first()
    const anthony :User= await db.from('users').where('nickname', 'anthony').first()
    const yassine :User= await db.from('users').where('nickname', 'yassine').first()

    if (!kevin || !anthony || !yassine) {
      console.error("Un ou plusieurs utilisateurs sont introuvables.")
      return
    }
    let worldId: number

    const world = await World.first() // Prend un monde existant

    if (!world) {
      console.log("Création d'un monde par défaut...")
      const newWorld = await World.create({ name: "Monde Par Défaut" }) // Ajoute un monde si vide
      worldId = newWorld.id
    } else {
      worldId = world.id
    }

    const hunting = await Hunting.create({
      title: 'Chasse au trésor épique',
      description: 'Une aventure unique pour découvrir des trésors cachés.',
      price: 50,
      minUser: 2,
      maxUser: 5,
      private: false,
      endDate: DateTime.now().plus({ days: 7 }),
      searchDelay: '02:00:00', // Format HH:mm:ss
      status: true,
      background: 'https://example.com/bg.jpg',
      textColor: '#FFFFFF',
      headerImg: 'https://example.com/header.jpg',
      userId: kevin.id, // Kevin est le créateur
      worldId: worldId, // Supposons un monde par défaut
    })

    console.log('Chasse au trésor créée:', hunting.id)

    await UsersHunting.createMany([
      {
        userId: anthony.id,
        huntingId: hunting.id,
        score: 0, // Ajout de la valeur par défaut
        opinion: "Aucune opinion", // Nouvelle valeur ajoutée
      },
      {
        userId: yassine.id,
        huntingId: hunting.id,
        score: 0, // Ajout de la valeur par défaut
        opinion: "Aucune opinion", // Nouvelle valeur ajoutée
      },
    ])

  }
}
