import LogHistory from '#models/log_history'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogHistoriesController {


    async getLogHistories({ response,auth }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        // const logHistories = await LogHistory.query()
        // .where("user_id", 2)
        // .select("id", "user_id", "log", "created_at", "order_id")
        // .preload("order", (orderQuery) => {
        //     orderQuery.preload("ordersItem", (ordersItemQuery) => {
        //         ordersItemQuery.preload("item", (itemQuery) => {
        //             itemQuery.select("id", "name", "price", "img");
        //         });
        //     });
        // });     
        const logHistories = await LogHistory.query()
        .where("user_id", user.id)
        .select("id", "log", "created_at", "order_id")

           return response.ok(logHistories)
    }
}