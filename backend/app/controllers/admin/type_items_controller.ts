import type { HttpContext } from '@adonisjs/core/http'
import TypeItem from '#models/type_item'
import Item from '#models/item'
export default class TypeItemsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const typeItems = await TypeItem.all()

    return view.render('pages/item/type/index', {
      typeItems: typeItems,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('pages/item/type/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { name } = request.only(['name'])
    const typeItem = new TypeItem()
    typeItem.name = name
    await typeItem.save()
    return response.redirect('/typeItems/' + typeItem.id)
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const typeItem = await TypeItem.findOrFail(params.id)
    return view.render('pages/item/type/show', {
      typeItem: typeItem,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const typeItem = await TypeItem.findOrFail(params.id)
    typeItem.name = request.input('name')
    await typeItem.save()
    return response.redirect('/typeItems/' + typeItem.id)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const typeItem = await TypeItem.findOrFail(params.id)
    await Item.query().where('type_item_id', typeItem.id).update({
      type_item_id: null,
    })
    await typeItem.delete()
    return response.redirect('/typeItems')
  }
}
