import factory from '@adonisjs/lucid/factories'
import UsersHuntingsItem from '#models/users_huntings_item'

export const UsersHuntingsItemFactory = factory
  .define(UsersHuntingsItem, async ({ faker }) => {
    return {
      history: false,
      huntingId: null,
      itemId: faker.number.int({ min: 1, max: 9 }),
      userId: faker.number.int({ min: 1, max: 3 }),
      shop:false
    }
  })
  .build()