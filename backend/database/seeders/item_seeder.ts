import Item from '#models/item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Item.createMany([
      {
        id: 1,
        name: 'Key of the Abyss',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/key.png',
        description:"A key that can open the door to the abyss",
        price: 1000,
        rarityId: 1,
      },
      {
        id: 2,
        name: 'Shield',
        img: 'shield.png',
        description:"A shield that can protect you from any attack",
        price: 500,
        rarityId: 2,
      },
      {
        id: 3,
        name: 'Potion',
        img: 'potion.png',
        description:"A potion that can heal you", 
        price: 200,
        rarityId: 3,
      },
    ])
  }
}