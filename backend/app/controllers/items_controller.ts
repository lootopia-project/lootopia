import Item from '#models/item'
import LogHistory from '#models/log_history'
import Order from '#models/order'
import OrdersItem from '#models/orders_item'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import i18nManager from '@adonisjs/i18n/services/main'
import UsersHuntingItem from '#models/users_huntings_item'

export default class ItemsController {
  async getListItem({ response }: HttpContext) {
    // 📌 Récupérer les items de base disponibles en magasin
    const items = await Item.query()
      .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
      .whereNull('hunting_id')
      .preload('rarity', (query) => {
        query.select('name')
      })

    // 📌 Récupérer les items mis en vente par les joueurs
    const userItemsOnSale = await UsersHuntingItem.query()
      .where('shop', true) // ✅ Uniquement ceux mis en vente
      .preload('item', (query) => {
        query.select('id', 'name', 'description', 'img', 'rarity_id')
        query.preload('rarity', (q) => q.select('name'))
      })

    // 📌 Trouver le prix des items en vente dans OrdersItem
    const orderItems = await OrdersItem.query()
      .whereIn(
        'item_id',
        userItemsOnSale.map((i) => i.itemId)
      ) // ✅ Récupérer seulement les items en vente
      .select('item_id', 'price', 'order_id')

    // 🔥 Convertir les items mis en vente en un objet pour accès rapide
    const orderItemsMap = Object.fromEntries(orderItems.map((o) => [o.itemId, o.price]))

    // 🔹 Formater les items de base
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      img: item.img,
      price: item.price,
      rarity: item.rarity?.name || 'Unknown',
      sellerId: null, // ✅ Pas de vendeur car c'est un item du shop normal
    }))

    // 🔹 Ajouter les items en vente par les utilisateurs
    const formattedUserItems = userItemsOnSale.map((item) => ({
      id: item.item.id,
      name: item.item.name,
      description: item.item.description,
      img: item.item.img,
      rarity: item.item.rarity?.name || 'Unknown',
      price: orderItemsMap[item.item.id] || item.item.price, // ✅ Si mis en vente, afficher le prix de vente
      sellerId: item.userId, // ✅ L'ID du vendeur
    }))

    // 🔥 Retourner les deux listes fusionnées (Shop + Vente utilisateurs)
    return response.ok([...formattedItems, ...formattedUserItems])
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
      userId: user.id,
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
      await UsersHuntingItem.create({
        userId: user.id,
        itemId: item.id,
        shop: false,
      })
    }

    await user.save()
    return response.json({
      message: i18n.t('Items bought successfully'),
      success: true,
      orderId: order.id,
    })
  }

  async putOnSale({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const i18n = i18nManager.locale(user.lang)
    const { id, price, quantity } = request.only(['id', 'price', 'quantity'])

    const items = await UsersHuntingItem.query()
      .where('user_id', user.id)
      .andWhere('item_id', id)
      .andWhere('shop', false)
      .limit(quantity)

    if (items.length === 0) {
      return response.json({ message: i18n.t('_.No items available for sale'), success: false })
    }

    await UsersHuntingItem.query()
      .whereIn(
        'id',
        items.map((item) => item.id)
      )
      .update({ shop: true })

    const order = await Order.create({
      status: 'pending on sale',
      createdAt: DateTime.now(),
      userId: user.id,
    })

    await OrdersItem.createMany(
      items.map((item) => ({
        orderId: order.id,
        itemId: item.itemId,
        price: price,
      }))
    )

    return response.json({ message: i18n.t('Item put on sale successfully'), success: true })
  }
}
