import TypeItem from '#models/type_item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await TypeItem.createMany([
      {
        id: 1,
        name: 'Weapon',
      },
      {
        id: 2,
        name: 'Armor',
      },
      {
        id: 3,
        name: 'Consumable',
      },
    ])
  }
}