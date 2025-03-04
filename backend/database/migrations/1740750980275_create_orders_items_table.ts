import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders_rewards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.integer('items_id').unsigned().references('id').inTable('items').onDelete('CASCADE')
      table.integer('price').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
