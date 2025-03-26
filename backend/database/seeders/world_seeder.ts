import { BaseSeeder } from '@adonisjs/lucid/seeders'
import World from '#models/world'
export default class extends BaseSeeder {
  async run() {
    await World.createMany([
      {
        id: 1,
        name: 'Cartography',
      },
      {
        id: 2,
        name: 'Real',
      },
    ])
  }
}
