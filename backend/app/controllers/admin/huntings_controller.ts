import type { HttpContext } from '@adonisjs/core/http'
import Hunting from '#models/hunting'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import World from '#models/world'
import Item from '#models/item'
import UsersHuntingItem from '#models/users_huntings_item'
import UsersHunting from '#models/users_hunting'
export default class HuntingsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const limit = 8
    const huntings = await db
      .from('huntings')
      .whereRaw('LOWER(title) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(description) like ?', [`%${search}%`])
      .paginate(page, limit)
    huntings.baseUrl('/huntings')
    return view.render('pages/hunting/index', {
      huntings: huntings,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ response, view }: HttpContext) {
    const user = await User.all()
    const world = await World.all()
    const item = await Item.all()
    return view.render('pages/hunting/create', {
      users: user,
      worlds: world,
      items: item,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'description',
      'minUser',
      'maxUser',
      'endDate',
      'price',
      'private',
      'status',
      'worldId',
      'userId',
    ])
    if (data.price < 0 || data.price.isNaN) {
      return response.redirect('back')
    }
    const hunting = await Hunting.create({
      title: data.title,
      description: data.description,
      minUser: data.minUser,
      maxUser: data.maxUser,
      endDate: data.endDate,
      price: data.price,
      private: data.private,
      status: data.status,
      worldId: data.worldId,
      userId: data.userId,
      searchDelay: '00:00:00',
      background: 'https://example.com/bg10.jpg',
      textColor: '#FFFFFF',
      headerImg: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
    })
    response.redirect('/huntings/' + hunting.id + '/#hunting-form')
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const hunting = await Hunting.query()
      .preload('user')
      .preload('item', (query) => {
        query.preload('item').where('hunting_id', params.id)
      })
      .preload('world')
      .preload('usersHunting', (query) => {
        query.preload('user')
      })
      .where('id', params.id)
      .firstOrFail()

    const user = await User.all()
    const world = await World.all()
    const item = await Item.all()

    return view.render('pages/hunting/show', {
      hunting: hunting,
      users: user,
      worlds: world,
      items: item,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const hunting = await Hunting.findOrFail(params.id)
    const data = request.only([
      'title',
      'description',
      'minUser',
      'maxUser',
      'endDate',
      'price',
      'private',
      'status',
      'worldId',
      'userId',
    ])
    hunting.merge(data)
    await hunting.save()
    return response.redirect('/huntings/' + hunting.id + '/#hunting-form')
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const hunting = await Hunting.findOrFail(params.id)
    await hunting.delete()
    return response.redirect('/huntings')
  }

  /*
   * Add item to hunting
   */
  async addItem({ params, request, response }: HttpContext) {
    const { itemId } = request.only(['itemId'])
    const hunting = await Hunting.findOrFail(params.id)
    const item = await Item.findOrFail(itemId)
    await UsersHuntingItem.create({
      history: false,
      huntingId: hunting.id,
      itemId: item.id,
      userId: null,
      price: item.price,
      shop: false,
    })
    return response.redirect('/huntings/' + hunting.id + '/#hunting-item-form')
  }

  /*
   * Remove item from hunting
   */
  async removeItem({ params, response }: HttpContext) {
    const hunting = await Hunting.findOrFail(params.huntingId)
    const item = await UsersHuntingItem.findOrFail(params.itemId)
    await item.delete()
    return response.redirect('/huntings/' + hunting.id)
  }

  /*
   * Add user to hunting
   */
  async addUser({ params, request, response }: HttpContext) {
    const { userId } = request.only(['userId'])
    const hunting = await Hunting.findOrFail(params.id)
    const user = await User.findOrFail(userId)
    if (user.id === hunting.userId) {
      return response.redirect('/huntings/' + hunting.id + '/#hunting-user-form')
    }
    await UsersHunting.create({
      huntingId: hunting.id,
      userId: user.id,
      opinion: '',
      score: 0,
    })
    return response.redirect('/huntings/' + hunting.id + '/#hunting-user-form')
  }

  /*
   * Remove user from hunting
   */
  async removeUser({ params, response }: HttpContext) {
    const hunting = await Hunting.findOrFail(params.huntingId)
    const HUNTING_USER = await UsersHunting.findOrFail(params.userId)
    await HUNTING_USER.delete()
    return response.redirect('/huntings/' + hunting.id + '/#hunting-user-form')
  }
}
