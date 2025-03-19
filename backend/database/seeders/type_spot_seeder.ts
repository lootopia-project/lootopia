import { BaseSeeder } from '@adonisjs/lucid/seeders'
import typeSpot from '#models/type_spot'
export default class extends BaseSeeder {
  async run() {
    await typeSpot.createMany([
      {
        id: 1,
        name: 'marker',
      },
      {
        id: 2,
        name: 'topLeft',
      },
      {
        id: 3,
        name: 'topRight',
      },
      {
        id: 4,
        name: 'bottomLeft',
      },
      {
        id: 5,
        name: 'bottomRight',
      },
      {
        id:6,
        name: 'center'
      }
    ])
  }
}