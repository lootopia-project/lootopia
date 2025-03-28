import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('img').notNullable()
      table.integer('price').notNullable()
      table.string('description').notNullable()
      table.integer('rarity_id').unsigned().references('id').inTable('rarities').onDelete('CASCADE')
      table.integer('type_id').unsigned().references('id').inTable('type_items').onDelete('CASCADE')
      table.boolean('shop').defaultTo(false)
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
