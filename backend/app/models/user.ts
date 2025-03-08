import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Notification from '#models/notification'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UsersHunting from '#models/users_hunting'
import Whitelist from '#models/whitelist'
import Item from '#models/item'
import Hunting from '#models/hunting'
import encryption from '@adonisjs/core/services/encryption'
import AuthAccessToken from '#models/auth_access_token'
import UsersOrder from '#models/users_order'
import LogHistory from '#models/log_history'
import UsersItem from '#models/users_item'

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

  @column({
    serializeAs: null,
    prepare: (value: string[]) => encryption.encrypt(JSON.stringify(value)),
    consume: (value: string) => JSON.parse(encryption.decrypt(value) as string),
  })
  declare twoFactorRecoveryCodes: string[]

  @column()
  declare isTwoFactorEnabled: boolean

  @column()
  declare phone: string

  @column()
  declare crowns: number

  @column()
  declare ranking: number

  @column()
  declare lang: string

  @column()
  declare checkMail: boolean

  @column()
  declare provider: string

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => UsersHunting)
  declare usersHunting: HasMany<typeof UsersHunting>

  @hasMany(() => Whitelist)
  declare whitelist: HasMany<typeof Whitelist>

  @hasMany(() => Hunting)
  declare hunting: HasMany<typeof Hunting>

  @hasMany(() => AuthAccessToken)
  declare accessTokens: HasMany<typeof AuthAccessToken>

  @hasMany(() => UsersOrder)
  declare usersOrder: HasMany<typeof UsersOrder>

  @hasMany(() => LogHistory)
  declare logHistory: HasMany<typeof LogHistory>

  @hasMany(() => UsersItem)
  declare usersItem: HasMany<typeof UsersItem>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
