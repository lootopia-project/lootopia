import Item from '#models/item'
import LogHistory from '#models/log_history'
import Order from '#models/order'
import OrdersItem from '#models/orders_item'
import UsersOrder from '#models/users_order'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import i18nManager from '@adonisjs/i18n/services/main'
import UsersItem from '#models/users_item'

export default class ItemsController {
  async getListItem({ response, auth }: HttpContext) {
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

  async buyItem({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const i18n = i18nManager.locale(user.lang)
    const ListItem = request.input('ListItem')

    const itemIds = ListItem.map((item: { id: number }) => item.id)

    const items = await Item.query().whereIn('id', itemIds).select('id', 'price')

    const totalPrice = items.reduce((acc, item) => acc + item.price, 0)

    if (user.crowns < totalPrice) {
      return response.badRequest({ message: i18n.t('_.Not enough crowns') })
    }

    user.crowns -= totalPrice

    const order = await Order.create({
      status: 'completed',
      createdAt: DateTime.now(),
    })

    await UsersOrder.create({
      orderId: order.id,
      userId: auth.user.id,
    })

    const orderItems = []

    for (const item of ListItem) {
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

    const log = await LogHistory.create({
      userId: auth.user.id,
      log: i18n.t('_.You have bought {numberItem} items for {price} crowns', {
        numberItem: orderItems.length,
        price: orderItems.reduce((acc, item) => acc + item.price, 0),
      }),
      orderId: order.id,
    })

    console.log(log)

    for (const item of ListItem) {
      const existingItem = await UsersItem.query()
        .where('user_id', user.id)
        .where('item_id', item.id)
        .first()

      if (existingItem) {
        existingItem.quantity += 1
        await existingItem.save()
      } else {
        await UsersItem.create({
          userId: user.id,
          itemId: item.id,
          quantity: 1,
        })
      }
    }

    await user.save()
    return response.json({ message: i18n.t('Items bought successfully') })
  }
}
