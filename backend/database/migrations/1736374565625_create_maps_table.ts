import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('skin').notNullable()
      table.string('zone').notNullable()
      table.integer('scale_min').notNullable()
      table.integer('scale_max').notNullable()
      table.integer('hunting').unsigned().references('id').inTable('huntings').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
