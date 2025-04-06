import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      password: 'password',
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      isPartner: faker.datatype.boolean(),
      img: faker.image.avatar(),
      nickname: faker.internet.displayName(),
      phone: faker.phone.number(),
      checkMail: faker.datatype.boolean(),
      crowns: faker.number.int({ min: 0, max: 100 }),
      ranking: faker.number.int({ min: 0, max: 100 }),
      lang: 'en',
      provider: '',
    }
  })
  .build()
