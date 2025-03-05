import type { HttpContext } from '@adonisjs/core/http'

import Order from "#models/order"

export default class OrdersController {

    async getOrderDetailWithId({ response, auth,params }: HttpContext) {
        const orderId = params.id
        console.log(`Requête pour la commande ID: ${orderId}`)

        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        const order = await Order.query().where('id', orderId).preload('ordersItem', (ordersItemQuery) => {
            ordersItemQuery.select('price', 'itemId') // 🔥 Ajouter 'itemId' pour que Lucid puisse précharger 'item'
            .preload('item', (itemQuery) => {
                itemQuery.select('id', 'name', 'price', 'img', 'description')
            })
        }).first()
        if (order) {
            // Convertir en JSON pour éviter les erreurs de sérialisation
            const orderJson = order.toJSON()
          
            // Transformer la réponse pour ne garder que `item` et `price`
            orderJson.ordersItem = orderJson.ordersItem.map(({ item, price }) => ({ item, price }))
          
            return response.ok(orderJson)
          }
          
          return response.ok(order)
    }
}