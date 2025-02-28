import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'spot_maps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('spot_id').unsigned().references('id').inTable('spots').onDelete('CASCADE')
      table.integer('map_id').unsigned().references('id').inTable('maps').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
