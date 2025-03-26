import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_hunting_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().nullable().references('users.id').onDelete('CASCADE')
      table.integer('item_id').unsigned().notNullable().references('items.id').onDelete('CASCADE')
      table
        .integer('hunting_id')
        .unsigned()
        .nullable()
        .references('huntings.id')
        .onDelete('CASCADE')
      table.boolean('history').defaultTo(false)
      table.boolean('shop').defaultTo(false)
      table.integer('price').nullable()
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
