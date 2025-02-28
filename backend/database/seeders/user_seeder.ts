import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'anthonymathieu21@live.fr',
        password: 'azeAZE123&',
        nickname: 'anthony',
        name: 'anthony',
        surname: 'mathieu',
        isPartner: true,
        crowns: 100,
        phone: '1234567891',
        img: 'https://lootopia.blob.core.windows.net/lootopia-photos/user.png',
        ranking: 1,
      },
      {
        email: 'kevinmetri.pro@gmail.com',
        password: 'azeAZE123&',
        nickname: 'kevin',
        name: 'kevin',
        surname: 'metri',
        isPartner: true,
        crowns: 100,
        phone: '1234567891',
        img: 'https://lootopia.blob.core.windows.net/lootopia-photos/user.png',
        ranking: 1,
      },
      {
        email: 'yassine.haffoud.sio@gmail.com',
        password: 'azeAZE123&',
        nickname: 'yassine',
        name: 'yassine',
        surname: 'haffoud',
        isPartner: true,
        crowns: 100,
        phone: '1234567891',
        img: 'https://lootopia.blob.core.windows.net/lootopia-photos/user.png',
        ranking: 1,
      },
    ])
  }
}
