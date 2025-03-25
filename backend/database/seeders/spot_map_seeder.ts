import { BaseSeeder } from '@adonisjs/lucid/seeders'
import SpotMap from '#models/spot_map'
export default class extends BaseSeeder {
  async run() {
    await SpotMap.createMany([
      {
        mapId: 1,
        spotId: 1,
      },
      {
        mapId: 1,
        spotId: 2,
      },
      {
        mapId: 1,
        spotId: 3,
      },
      {
        mapId: 1,
        spotId: 4,
      },
      {
        mapId: 1,
        spotId: 5,
      },
      {
        mapId: 1,
        spotId: 6,
      },
    ])
  }
}
