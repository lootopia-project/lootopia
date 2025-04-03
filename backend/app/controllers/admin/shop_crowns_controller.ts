import type { HttpContext } from '@adonisjs/core/http'
import ShopCrown from '#models/shop_crown'
export default class ShopCrownsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    const shopCrowns = await ShopCrown.all()
    return view.render('pages/shop/index', {
      shopCrowns: shopCrowns,
    })
  }
  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
  }
  /**
   * Display form to create a new record
   */
  async create({view}: HttpContext) {
    return view.render('pages/shop/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,response }: HttpContext) {
    const data = request.only(['name', 'price', 'number_of_crown'])
    if (data.price < 0 || isNaN(data.price)) {
      return response.redirect('/shopCrowns/create')
    }
    const shopCrown = new ShopCrown()
    shopCrown.name = data.name
    shopCrown.price = data.price
    shopCrown.numberOfCrowns = data.number_of_crown
    shopCrown.img = ''
    await shopCrown.save()
    return response.redirect('/shopCrowns')
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const shopCrown = await ShopCrown.findOrFail(params.id)
    await shopCrown.delete()
    return response.redirect('/shopCrowns')
  }
}