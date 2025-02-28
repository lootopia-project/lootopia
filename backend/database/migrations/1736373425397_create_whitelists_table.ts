import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'whitelists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('hunting_id')
        .unsigned()
        .references('id')
        .inTable('huntings')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
