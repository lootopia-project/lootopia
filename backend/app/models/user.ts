import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Notification from '#models/notification'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UsersHunting from '#models/users_hunting'
import Whitelist from '#models/whitelist'
import Reward from '#models/reward'
import Hunting from '#models/hunting'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'nickname'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare name: string

  @column()
  declare surname: string

  @column()
  declare isPartner: boolean

  @column()
  declare img: string

  @column()
  declare nickname: string

  @column()
  declare twoFactorSecret: string

  @column()
  declare twoFactorRecoveryCodes: string

  @column()
  declare isTwoFactorEnabled: boolean

  @column()
  declare phone: number

  @column()
  declare crowns: number

  @column()
  declare ranking: number

  @column()
  declare lang: string

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => UsersHunting)
  declare usersHunting: HasMany<typeof UsersHunting>

  @hasMany(() => Whitelist)
  declare whitelist: HasMany<typeof Whitelist>

  @hasMany(() => Reward)
  declare reward: HasMany<typeof Reward>

  @hasMany(() => Hunting)
  declare hunting: HasMany<typeof Hunting>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
