import ShopCrown from '#models/shop_crown'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    ShopCrown.createMany([
      {
        id: 1,
        price: 1,
        name: 'Some Crowns',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/some_crown.png',
        numberOfCrowns: 100,
      },
      {
        id: 2,
        price: 20,
        name: 'Bag of Crowns',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/crown_bag.png',
        numberOfCrowns: 500,
      },
      {
        id: 3,
        price: 100,
        name: 'Pile of Crowns',
        img: 'https://lootopia.blob.core.windows.net/lootopia-object/pile_crown.png',
        numberOfCrowns: 1000,
      },
    ])
  }
}
