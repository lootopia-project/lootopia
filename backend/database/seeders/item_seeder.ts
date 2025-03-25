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
      {
        id: 4,
        name: 'Book of Knowledge',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/worldroot_grimoire.png',
        description: 'A book that contains all the knowledge of the world',
        price: 100,
        rarityId: 4,
      },
      {
        id: 5,
        name: 'Eyes of Onyxis',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/eyes_of_onyxis.png',
        description: 'A pair of eyes that can see the unseen',
        price: 50,
        rarityId: 3,
      },
      {
        id: 6,
        name: 'Mirror of Duality',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/mirror_of_duality.png',
        description: 'A mirror that can show the true self',
        price: 20,
        rarityId: 4,
      },
      {
        id: 7,
        name: 'Lantern of Echoes',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/lantern_of_echoes.png',
        description: 'A lantern that can show the past',
        price: 10,
        rarityId: 1,
      },
      {
        id: 8,
        name: 'Thorned Ring',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/thorned_ring.png',
        description: 'A ring that can protect the wearer',
        price: 5,
        rarityId: 2,
      },
      {
        id: 9,
        name: 'Whispering Coin',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/whispering_coin.png',
        description: 'A coin that can whisper the future',
        price: 1,
        rarityId: 3,
      },
    ])
  }
}