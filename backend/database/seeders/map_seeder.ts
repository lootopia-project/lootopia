import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Map from '#models/map'
export default class extends BaseSeeder {
  async run() {
    await Map.createMany([
      {
        huntingId: 1,
        name: 'Map 1',
        skin: 'default',
        zone: 'zone 1',
        scale_min: 1,
        scale_max: 10,
      },
    ])
  }
}
