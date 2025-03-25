import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }
  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/world_seeder'))
    await this.seed(await import('#database/seeders/hunting_seeder'))
    await this.seed(await import('#database/seeders/order_seeder'))
    await this.seed(await import('#database/seeders/shop_crown_seeder'))
    await this.seed(await import('#database/seeders/rarity_seeder'))
    await this.seed(await import('#database/seeders/type_item_seeder'))
    await this.seed(await import('#database/seeders/item_seeder'))
    await this.seed(await import('#database/seeders/type_spot_seeder'))
    await this.seed(await import('#database/seeders/spot_seeder'))
    await this.seed(await import('#database/seeders/map_seeder'))
    await this.seed(await import('#database/seeders/spot_map_seeder'))
    await this.seed(await import('#database/seeders/users_huntings_item_seeder'))
  }
}
