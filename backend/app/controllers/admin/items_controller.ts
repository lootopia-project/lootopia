import Item from '#models/item'
import Rarity from '#models/rarity'
import TypeItem from '#models/type_item'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
export default class ItemsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const limit = 8
    const items = await db
      .from('items')
      .whereRaw('LOWER(name) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(description) like ?', [`%${search}%`])
      .paginate(page, limit)
    items.baseUrl('/items')
    return view.render('pages/item/index', {
      items: items,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const rarities = await Rarity.all()
    const types = await TypeItem.all()
    return view.render('pages/item/create', {
      rarities: rarities,
      types: types,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'price', 'rarityId', 'typeItemId', 'shop'])
    if (data.price < 0 || data.price.isNaN) {
      return response.redirect('back')
    }
    const item = new Item()
    item.name = data.name
    item.description = data.description
    item.price = data.price
    item.rarityId = data.rarityId
    item.typeItemId = data.typeItemId
    item.shop = data.shop
    item.img = ''
    await item.save()
    return response.redirect('/items/' + item.id)
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const item = await Item.query().preload('rarity').preload('type').where('id', params.id).first()

    const rarities = await Rarity.all()
    const types = await TypeItem.all()
    return view.render('pages/item/show', {
      item: item,
      rarities: rarities,
      types: types,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    const data = request.only(['name', 'description', 'price', 'rarityId', 'typeItemId', 'shop'])
    if (data.price < 0 || data.price.isNaN) {
      return response.redirect('back')
    }
    item.name = data.name
    item.description = data.description
    item.price = data.price
    item.rarityId = data.rarityId
    item.typeItemId = data.typeItemId
    item.shop = data.shop
    await item.save()
    return response.redirect('/items/' + item.id)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    await item.delete()
    return response.redirect('/items')
  }
}
