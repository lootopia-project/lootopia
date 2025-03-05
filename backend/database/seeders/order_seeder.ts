import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Order from '#models/order'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    Order.create({
      status: 'pending',
      createdAt: DateTime.now(),
    })
  }
}
