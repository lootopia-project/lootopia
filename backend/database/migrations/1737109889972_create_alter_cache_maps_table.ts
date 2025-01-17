import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNameMaps = 'maps'
  protected tableNameCaches = 'caches'

  async up() {
    this.schema.alterTable(this.tableNameMaps, (table) => {
      table.integer('cache_id').unsigned().references('id').inTable('caches').onDelete('CASCADE')
    })

    this.schema.alterTable(this.tableNameCaches, (table) => {
      table.integer('map_id').unsigned().references('id').inTable('maps').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableNameMaps, (table) => {
      table.dropColumn('cache_id')
    })

    this.schema.alterTable(this.tableNameCaches, (table) => {
      table.dropColumn('map_id')
    })
  }
}
