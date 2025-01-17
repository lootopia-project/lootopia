import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'spots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.decimal('lat').notNullable()
      table.decimal('long').notNullable()
      table.string('description').notNullable()
      table.integer('type_id').unsigned().references('id').inTable('type_spots').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
