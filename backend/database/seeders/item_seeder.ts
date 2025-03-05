import Item from '#models/item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Item.createMany([
      {
        id: 1,
        name: 'Key of the Abyss',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/key.png',
        description: 'A key that can open the door to the abyss',
        price: 1000,
        rarityId: 1,
      },
      {
        id: 2,
        name: 'Hourglass of Time',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/hourglass.png',
        description: 'An hourglass that can control time',
        price: 500,
        rarityId: 2,
      },
      {
        id: 3,
        name: 'Compas of the Lost',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/compass.png',
        description: 'A compass that can show the way to the lost',
        price: 200,
        rarityId: 3,
      },
    ])
  }
}
