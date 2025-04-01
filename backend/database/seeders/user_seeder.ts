import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { UserFactory } from '#database/factories/user_factory'
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
        crowns: 1000000,
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
        crowns: 100000,
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
      {
        email: 'john.doe@example.com',
        password: 'fakePass123',
        nickname: 'johndoe',
        name: 'John',
        surname: 'Doe',
        isPartner: false,
        crowns: 500,
        phone: '5551234567',
        img: 'https://example.com/default-user.png',
        ranking: 2,
      },
      {
        email: 'jane.smith@example.com',
        password: 'fakePass456',
        nickname: 'janesmith',
        name: 'Jane',
        surname: 'Smith',
        isPartner: false,
        crowns: 750,
        phone: '5557654321',
        img: 'https://example.com/default-user.png',
        ranking: 3,
      },
    ])
    await UserFactory.createMany(100)
  }
}
