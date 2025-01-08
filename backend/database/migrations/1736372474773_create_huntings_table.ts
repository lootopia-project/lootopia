import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'huntings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.decimal('price').notNullable()
      table.integer('min_user').notNullable()
      table.integer('max_user').notNullable()
      table.boolean('private').notNullable()
      table.dateTime('end_date').notNullable()
      table.time('search_delay').notNullable()
      table.boolean('status').notNullable()
      table.string('background').notNullable()
      table.string('text_color').notNullable()
      table.string('header_img').notNullable()
      table.integer('organizer').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('world').unsigned().references('id').inTable('worlds').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
