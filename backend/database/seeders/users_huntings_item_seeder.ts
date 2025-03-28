import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UsersHuntingItem from '#models/users_huntings_item'
import Item from '#models/item'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  public async run() {
    const items = await Item.all()

    const records = Array.from({ length: 20 }, () => {
      const item = faker.helpers.arrayElement(items)
      return {
        history: false,
        huntingId: null,
        itemId: item.id,
        userId: faker.number.int({ min: 1, max: 3 }),
        shop: false,
        price: item.price,
      }
    })

    await UsersHuntingItem.createMany(records)
  }
}
