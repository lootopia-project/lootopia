import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UsersHuntingsItemFactory } from '#database/factories/users_huntings_item_factory'
export default class extends BaseSeeder {
  async run() {
    await UsersHuntingsItemFactory.createMany(15)
  }
}