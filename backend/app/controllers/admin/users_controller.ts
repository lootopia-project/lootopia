import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const limit = 8
    const users = await db
      .from('users')
      .whereRaw('LOWER(name) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(surname) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(nickname) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(email) like ?', [`%${search}%`])
      .orWhereRaw('LOWER(phone) like ?', [`%${search}%`])
      .paginate(page, limit)
    users.baseUrl('/users')
    return view.render('pages/user/index', {
      users: users,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('pages/user/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const user = new User()
    user.email = request.input('email')
    user.name = request.input('name')
    user.surname = request.input('surname')
    user.nickname = request.input('nickname')
    user.phone = request.input('phone')
    user.checkMail = request.input('checkMail')
    user.crowns = request.input('crowns')
    user.ranking = request.input('ranking')
    user.isPartner = request.input('isPartner')
    user.lang = request.input('lang')
    user.password = '12345678'
    try {
      await user.save()
    } catch (error) {
      console.log(error)
      return response.redirect('/users/create')
    }
    return response.redirect('/users/' + user.id)
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return view.render('errors/404')
    }
    return view.render('pages/user/show', {
      user: user,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.redirect('/users/' + params.id)
    }
    user.email = request.input('email')
    user.name = request.input('name')
    user.surname = request.input('surname')
    user.nickname = request.input('nickname')
    user.phone = request.input('phone')
    user.checkMail = request.input('checkMail')
    user.crowns = request.input('crowns')
    user.ranking = request.input('ranking')
    user.isPartner = request.input('isPartner')
    user.lang = request.input('lang')
    await user.save()
    return response.redirect('/users/' + params.id)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return
    }
    await user.delete()
    return response.redirect('/users')
  }
}
