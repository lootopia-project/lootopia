import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Spot from '#models/spot'
export default class extends BaseSeeder {
  async run() {
    await Spot.createMany([
      {
        typeId: 1,
        lat: 51.505,
        long: -0.09,
        description: 'Marker 1',
      },
      {
        typeId: 2,
        lat: 51.51,
        long: -0.1,
        description: 'Top Left',
      },
      {
        typeId: 3,
        lat: 51.51,
        long: -0.09,
        description: 'Top Right',
      },
      {
        typeId: 4,
        lat: 51.49,
        long: -0.1,
        description: 'Bottom Left',
      },
      {
        typeId: 5,
        lat: 51.49,
        long: -0.09,
        description: 'Bottom Right',
      },
      {
        typeId: 6,
        lat: 51.505,
        long: -0.09,
        description: 'Center',
      },
    ])
  }
}
