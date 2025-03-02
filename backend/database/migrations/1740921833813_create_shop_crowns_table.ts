import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shop_crowns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('price').notNullable()
      table.string('name').notNullable()
      table.string('img').notNullable()
      table.integer('number_of_crowns').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}