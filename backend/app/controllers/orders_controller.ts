import type { HttpContext } from '@adonisjs/core/http'

import Order from '#models/order'

export default class OrdersController {
  async getOrderDetailWithId({ response, auth, params }: HttpContext) {
    const orderId = params.id
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const order = await Order.query()
      .where('id', orderId)
      .preload('ordersItem', (ordersItemQuery) => {
        ordersItemQuery.select('price', 'itemId').preload('item', (itemQuery) => {
          itemQuery.select('id', 'name', 'price', 'img', 'description')
        })
      })
      .first()
    if (order) {
      const orderJson = order.toJSON()
      orderJson.ordersItem = orderJson.ordersItem.map(({ item, price }) => ({ item, price }))
      return response.ok(orderJson)
    }

    return response.ok(order)
  }
}
