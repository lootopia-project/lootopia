import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemsController {


    async getListItem({ response,auth }: HttpContext) {
        // if(!auth.user){
        //     return response.unauthorized({message: 'Unauthorized'})
        // }
        const items = await Item.query()
  .select('id', 'name', 'description', 'img', 'price', 'rarity_id') 
  .whereNull('hunting_id')
  .preload('rarity', (query) => {
    query.select('name'); 
  });

  const formattedItems = items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    img: item.img,
    price: item.price,
    rarity: item.rarity?.name || "Unknown" 
  }));
      
      
        return response.ok(formattedItems)
    }
}