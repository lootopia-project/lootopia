import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_huntings_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('item_id').unsigned().notNullable().references('items.id').onDelete('CASCADE')
      table.integer('hunting_id').unsigned().notNullable().references('huntings.id').onDelete('CASCADE')
      table.integer('quantity').notNullable().defaultTo(1)
      table.boolean('history').defaultTo(false)
      table.boolean('shop')
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
