import Item from '#models/item'
import LogHistory from '#models/log_history'
import Order from '#models/order'
import OrdersItem from '#models/orders_item'
import UsersOrder from '#models/users_order'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import i18nManager from '@adonisjs/i18n/services/main'
import UsersItem from '#models/users_item'
import User from '#models/user'

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
      return response.json({ message: i18n.t('_.Not enough crowns'), success: false })
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

    await LogHistory.create({
      userId: auth.user.id,
      log: i18n.t('_.You have bought {numberItem} items for {price} crowns', {
        numberItem: orderItems.length,
        price: orderItems.reduce((acc, item) => acc + item.price, 0),
      }),
      orderId: order.id,
    })

    for (const item of ListItem) {
      await UsersItem.create({
        userId: auth.user.id,
        itemId: item.id,
      })
    }

    await user.save()
    return response.json({
      message: i18n.t('Items bought successfully'),
      success: true,
      orderId: order.id,
    })
  }

  async getItemsUser({ auth, response }: HttpContext) {
    const user = auth.user;
  
    if (!user) {
      return response.json({
        success: false,
        message: 'User not found',
      });
    }
  
    // On récupère tous les liens User <-> Item
    const usersItems = await user
      .related('usersItem')
      .query()
      .preload('item', (itemQuery) => {
        itemQuery.select(['id', 'name', 'description', 'img', 'price']);
      });
  
    const grouped = new Map<number, any>();
  
    for (const ui of usersItems) {
      const item = ui.item;
  
      if (grouped.has(item.id)) {
        grouped.get(item.id).quantity += 1;
      } else {
        grouped.set(item.id, { ...item.serialize(), quantity: 1 });
      }
    }
  
    const userItems = Array.from(grouped.values());
    return response.json({
      success: true,
      items: userItems,
    });
  }
  
   async exchangeItemUsers({ request, response }: HttpContext) {
    const exchange = request.body()
    console.log(exchange)

    const decodeEmail = (encoded: string) => {
      return encoded.replace(/-at-/g, '@').replace(/_at_/g, '@').replace(/_/g, '.').replace(/-dot-/g, '.')
    }

    const proposerEmail = decodeEmail(exchange.proposer)
    const receiverEmail = decodeEmail(exchange.receiver)

    const proposer = await User.findByOrFail('email', proposerEmail)
    const receiver = await User.findByOrFail('email', receiverEmail)

    const itemToGiveId = exchange.item.id
    const itemToGiveQty = exchange.item.quantity

    const itemWantedId = exchange.requestedItem.id
    const itemWantedQty = exchange.requestedItem.quantity

    // Récupération des items du proposer
    const proposerItems = await UsersItem.query()
      .where('user_id', proposer.id)
      .where('item_id', itemToGiveId)
      .limit(itemToGiveQty)

    if (proposerItems.length < itemToGiveQty) {
      return response.badRequest({ error: 'Le proposer ne possède pas assez d’objets.' })
    }

    // Récupération des items du receiver
    const receiverItems = await UsersItem.query()
      .where('user_id', receiver.id)
      .where('item_id', itemWantedId)
      .limit(itemWantedQty)

    if (receiverItems.length < itemWantedQty) {
      return response.badRequest({ error: 'Le receiver ne possède pas assez d’objets.' })
    }

    for (const item of proposerItems) {
      item.userId = receiver.id
      await item.save()
    }

    for (const item of receiverItems) {
      item.userId = proposer.id
      await item.save()
    }

    return response.ok({ message: 'Echange réussi !' })
  }
  
}
