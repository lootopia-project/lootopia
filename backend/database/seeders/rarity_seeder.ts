import Rarity from '#models/rarity'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Rarity.createMany([
      {
        id: 1,
        name: 'Common',
      },
      {
        id: 2,
        name: 'Rare',
      },
      {
        id: 3,
        name: 'Epic',
      },
      {
        id: 4,
        name: 'Legendary',
      },
    ])
  }
}
