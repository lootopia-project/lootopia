import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rewards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('rarity_id').unsigned().references('id').inTable('rarities').onDelete('CASCADE')
      table
        .integer('type_id')
        .unsigned()
        .references('id')
        .inTable('type_rewards')
        .onDelete('CASCADE')
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
