import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'spot_caches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('spot_id').unsigned().references('id').inTable('spots').onDelete('CASCADE')
      table.integer('cache_id').unsigned().references('id').inTable('caches').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
