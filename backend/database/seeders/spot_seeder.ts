import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Spot from '#models/spot'
export default class extends BaseSeeder {
  async run() {
    await Spot.createMany([
      {
        id: 1,
        typeId: 1,
        lat: 51.505,
        long: -0.09,
        description: "Marker 1"
      },
      {
        id: 2,
        typeId: 2,
        lat: 51.51,
        long: -0.1,
        description: "Top Left"
      },
      {
        id: 3,
        typeId: 3,
        lat: 51.51,
        long: -0.09,
        description: "Top Right"
      },
      {
        id: 4,
        typeId: 4,
        lat: 51.49,
        long: -0.1,
        description: "Bottom Left"
      },
      {
        id: 5,
        typeId: 5,
        lat: 51.49,
        long: -0.09,
        description: "Bottom Right"
      },
      {
        id: 6,
        typeId: 6,
        lat: 51.505,
        long: -0.09,
        description: "Center"
      }
    ])
  }
}