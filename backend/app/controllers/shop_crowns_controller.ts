// import type { HttpContext } from '@adonisjs/core/http'

import ShopCrown from '#models/shop_crown'
import { HttpContext } from '@adonisjs/core/http'

export default class ShopCrownsController {
  async getShopCrowns({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.json({ message: 'User not found' })
    }

    const shopCrowns = await ShopCrown.all()

    return response.json(shopCrowns)
  }
}
