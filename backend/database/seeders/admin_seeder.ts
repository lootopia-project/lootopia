import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
export default class extends BaseSeeder {
  async run() {
    await Admin.createMany([
      {
        email: 'anthonymathieu21@live.fr',
        password: 'azeAZE123&',
      },
      {
        email: 'kevinmetri.pro@gmail.com',
        password: 'azeAZE123&',
      },
      {
        email: 'yassine.haffoud.sio@gmail.com',
        password: 'azeAZE123&',
      },
    ])
  }
}