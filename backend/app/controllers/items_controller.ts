import Item from '#models/item'
import LogHistory from '#models/log_history'
import Order from '#models/order'
import OrdersItem from '#models/orders_item'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import i18nManager from '@adonisjs/i18n/services/main'
import UsersHuntingItem from '#models/users_huntings_item'
import User from '#models/user'

export default class ItemsController {
  async getAllItem({ response, auth }: HttpContext) {
    const items = await Item.query()
      .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
      .whereNull('hunting_id')
      .preload('rarity', (query) => {
        query.select('name')
      })

    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      img: item.img,
      price: item.price,
      rarity: item.rarity?.name || 'Unknown',
    }))

    return response.ok(formattedItems)
  }

  async getListItem({ response, auth }: HttpContext) {
    const items = await Item.query()
      .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
      .andWhere('shop', true)
      .andWhereNull('hunting_id')
      .preload('rarity', (query) => {
        query.select('name')
      })

    const formattedItemsShop = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      img: item.img,
      price: item.price,
      rarity: item.rarity?.name || 'Unknown',
      user: 'shop',
      fromShop: true,
    }))
    const itemsUser = await UsersHuntingItem.query()
      .andWhere('shop', true)
      .preload('user', (query) => {
        query.select('id', 'nickname')
      })
      .preload('item', (query) => {
        query
          .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
          .preload('rarity', () => {
            query.select('name')
          })
      })
    const formattedItemsUser = itemsUser.map((item) => ({
      id: item.id,
      name: item.item.name,
      description: item.item.description,
      img: item.item.img,
      price: item.price || item.item.price,
      rarity: item.item.rarity?.name || 'Unknown',
      user: item.user.nickname,
      fromShop: false,
    }))
    //fusion of items from shop and user
    formattedItemsShop.push(...formattedItemsUser)

    return response.ok(formattedItemsShop)
  }

  async buyItem({ request, response, auth }: HttpContext) {
    const user = auth.use('api').user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const i18n = i18nManager.locale(user.lang)
    const ListItem = request.input('ListItem')
    const shopItems = ListItem.filter((item: { fromShop: boolean }) => item.fromShop === true)
    const nonShopItems = ListItem.filter((item: { fromShop: boolean }) => !item.fromShop)

    const order = await Order.create({
      status: 'completed',
      createdAt: DateTime.now(),
      userId: user.id,
    })

    //buy items from shop
    if (shopItems.length > 0) {
      const shopItemIds = shopItems.map((item: { id: number }) => item.id)
      const items = await Item.query().whereIn('id', shopItemIds).select('id', 'price')

      const totalPrice = items.reduce((acc, item) => acc + item.price, 0)
      if (user.crowns < totalPrice) {
        return response.json({
          message: i18n.t('_.Not enough crowns'),
          success: false,
        })
      }
      user.crowns -= totalPrice

      const orderItems = []
      for (const item of shopItems) {
        const foundItem = items.find((i) => i.id === item.id)
        if (foundItem) {
          orderItems.push({
            orderId: order.id,
            itemId: foundItem.id,
            price: foundItem.price,
          })
        }
      }

      await OrdersItem.createMany(orderItems)

      await LogHistory.create({
        userId: user.id,
        log: i18n.t('_.You have bought {numberItem} items for {price} crowns', {
          numberItem: orderItems.length,
          price: orderItems.reduce((acc, item) => acc + item.price, 0),
        }),
        orderId: order.id,
      })

      for (const item of shopItems) {
        await UsersHuntingItem.create({
          userId: user.id,
          itemId: item.id,
          price: items.find((i) => i.id === item.id)?.price,
        })
      }
    }
    //buy items from other users
    if (nonShopItems.length > 0) {
      const nonShopItemIds = nonShopItems.map((item: { id: number }) => item.id)
      const items = await UsersHuntingItem.query()
        .preload('user')
        .preload('item')
        .whereIn('id', nonShopItemIds)
      const totalPrice = items.reduce((acc, item) => acc + item.price, 0)
      if (user.crowns < totalPrice) {
        return response.json({
          message: i18n.t('_.Not enough crowns'),
          success: false,
        })
      }
      user.crowns -= totalPrice

      const orderItems = []
      for (const item of items) {
        orderItems.push({
          orderId: order.id,
          itemId: item.item.id,
          price: item.price,
        })
      }

      await OrdersItem.createMany(orderItems)

      await LogHistory.create({
        userId: user.id,
        log: i18n.t('_.You have bought {numberItem} items for {price} crowns from user', {
          numberItem: orderItems.length,
          price: orderItems.reduce((acc, item) => acc + item.price, 0),
        }),
        orderId: order.id,
      })

      for (const item of nonShopItems) {
        await UsersHuntingItem.query().where('id', item.id).update({ shop: false, history: true })
      }
      for (const item of items) {
        await LogHistory.create({
          userId: item.user.id,
          log: i18n.t('_.You have sold an Item {item}', {
            item: item.item.name,
          }),
          orderId: order.id,
        })
        await UsersHuntingItem.create({
          userId: user.id,
          itemId: item.item.id,
          price: item.price,
        })
        //update crowns of the user who sold the item
        await User.query()
          .where('id', item.user.id)
          .update({ crowns: item.user.crowns + item.price })
      }
    }
    await user.save()

    return response.json({
      message: i18n.t('Items bought successfully'),
      success: true,
      orderId: order ? order.id : null,
    })
  }

  async getListItemUser({ response, auth }: HttpContext) {
    const user = auth.use('api').user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const items = await UsersHuntingItem.query()
      .where('user_id', user.id)
      .andWhere('shop', false)
      .andWhere('history', false)
      .preload('item', (query) => {
        query
          .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
          .preload('rarity', () => {
            query.select('name')
          })
      })
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.item.name,
      description: item.item.description,
      img: item.item.img,
      price: item.price,
      rarity: item.item.rarity?.name || 'Unknown',
      user: auth.user ? user.nickname : 'Unknown',
      fromShop: false,
    }))

    return response.ok(formattedItems)
  }
  async addItemToShop({ request, response, auth }: HttpContext) {
    const { item } = request.only(['item'])
    const user = auth.use('api').user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const i18n = i18nManager.locale(user.lang)
    const itemExist = await UsersHuntingItem.query().where('id', item.id).first()
    if (!itemExist) {
      return response.badRequest({ message: i18n.t('_.Item not found') })
    }
    if (itemExist.shop) {
      return response.badRequest({ message: i18n.t('_.Item already in shop') })
    }
    itemExist.shop = true
    itemExist.price = item.price
    await itemExist.save()
    return response.ok({ message: i18n.t('_.Item added to shop') })
  }

  async exchangeItemUsers({ auth, request, response }: HttpContext) {
    const user = auth.use('api').user

    if (!user) {
      return response.json({
        success: false,
        message: 'User not found',
      })
    }
    const i18n = i18nManager.locale(user.lang)

    const exchange = request.body()

    const proposerEmail = decodeEmail(exchange.proposer)
    const receiverEmail = decodeEmail(exchange.receiver)

    const proposer = await User.findByOrFail('email', proposerEmail)
    const receiver = await User.findByOrFail('email', receiverEmail)

    for (const item of exchange.itemsOffered) {
      const proposerItems = await UsersHuntingItem.query()
        .where('user_id', proposer.id)
        .where('item_id', item.id)
        .where('item_id', item.id)
        .where('shop', false)
        .where('history', false)
        .limit(item.quantity)

      if (proposerItems.length < item.quantity) {
        return response.json({
          message: i18n.t("_.The proposer doesn't have enough of the item") + item.name,
        })
      }

      for (const itemInstance of proposerItems) {
        itemInstance.userId = receiver.id
        await itemInstance.save()
      }
    }

    await LogHistory.create({
      userId: proposer.id,
      log: i18n.t('_.You have exchanged {numberItem} items with {receiver}', {
        numberItem: exchange.itemsOffered.length,
        receiver: receiver.nickname,
      }),
    })

    for (const item of exchange.itemsRequested) {
      const receiverItems = await UsersHuntingItem.query()
        .where('user_id', receiver.id)
        .where('item_id', item.id)
        .where('shop', false)
        .where('history', false)
        .limit(item.quantity)

      if (receiverItems.length < item.quantity) {
        return response.json({
          message: i18n.t("_.The receiver doesn't have enough of the item") + item.name,
        })
      }

      for (const itemInstance of receiverItems) {
        itemInstance.userId = proposer.id
        await itemInstance.save()
      }
    }

    await LogHistory.create({
      userId: receiver.id,
      log: i18n.t('_.You have exchanged {numberItem} items with {proposer}', {
        numberItem: exchange.itemsRequested.length,
        proposer: proposer.nickname,
      }),
    })

    return response.json({ message: i18n.t('_.Items exchanged successfully'), success: true })
  }

  async verifyReceiverItems({ request, response }: HttpContext) {
    const exchange = request.body()
    const i18n = i18nManager.locale(exchange.lang)

    const receiverEmail = decodeEmail(exchange.receiver)
    const receiver = await User.findByOrFail('email', receiverEmail)

    for (const item of exchange.itemsRequested) {
      const count = await UsersHuntingItem.query()
        .where('user_id', receiver.id)
        .where('item_id', item.id)
        .where('shop', false)
        .where('history', false)
        .limit(item.quantity)

      if (count.length < item.quantity) {
        return response.ok({
          success: false,
          message: i18n.t("_.The receiver doesn't have enough of the item") + item.name,
        })
      }
    }

    return response.ok({ success: true })
  }

  async getItemsMessageUser({ auth, response }: HttpContext) {
    const user = auth.use('api').user

    if (!user) {
      return response.json({
        success: false,
        message: 'User not found',
      })
    }

    const usersItems = await user
      .related('usersItem')
      .query()
      .preload('item', (itemQuery) => {
        itemQuery.select(['id', 'name', 'description', 'img', 'price'])
      })

    const grouped = new Map<number, any>()

    for (const ui of usersItems) {
      const item = ui.item

      if (grouped.has(item.id)) {
        grouped.get(item.id).quantity += 1
      } else {
        grouped.set(item.id, { ...item.serialize(), quantity: 1 })
      }
    }

    const userItems = Array.from(grouped.values())
    return response.json({
      success: true,
      items: userItems,
    })
  }
}

const decodeEmail = (encoded: string) => {
  return encoded
    .replace(/-at-/g, '@')
    .replace(/_at_/g, '@')
    .replace(/_/g, '.')
    .replace(/-dot-/g, '.')
}
