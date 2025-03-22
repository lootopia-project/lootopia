import Item from '#models/item'
import LogHistory from '#models/log_history'
import Order from '#models/order'
import OrdersItem from '#models/orders_item'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import i18nManager from '@adonisjs/i18n/services/main'
import UsersHuntingItem from '#models/users_huntings_item'
import User from '#models/user'

export default class ItemsController {
  async getListItem({ response, auth }: HttpContext) {
    const user = auth.user;
    if (!user) {
        return response.unauthorized({ message: 'Unauthorized' });
    }

    // 📌 Récupérer les items de base disponibles en magasin
    const items = await Item.query()
        .select('id', 'name', 'description', 'img', 'price', 'rarity_id')
        .whereNull('hunting_id')
        .preload('rarity', (query) => {
            query.select('name');
        });

    // 📌 Récupérer les items en vente par les utilisateurs (hors ceux appartenant à l'utilisateur actuel)
    const userItemsOnSale = await UsersHuntingItem.query()
        .where('shop', true) // ✅ Uniquement ceux mis en vente
        .where('history', false) // ✅ Exclure les items historiques
        .andWhereNot('user_id', user.id) // ❌ Exclure les items de l'utilisateur connecté
        .preload('item', (query) => {
            query.select('id', 'name', 'description', 'img', 'rarity_id')
            query.preload('rarity', (q) => q.select('name'));
        });

    // 📌 Récupérer le prix et la quantité des items en vente dans `OrdersItem`
    const orderItems = await OrdersItem.query()
        .whereIn(
            'item_id',
            userItemsOnSale.map((i) => i.itemId) // ✅ Récupérer seulement les items en vente
        )
        .select('item_id', 'price', 'order_id');

    // 🔥 Regrouper les items par ID et additionner leur quantité
    const groupedUserItems: { [key: number]: any } = {};

    userItemsOnSale.forEach((item) => {
        // const price = orderItems.find(o => o.item_id === item.item.id)?.price || item.item.price;
        const orderItemsMap = Object.fromEntries(orderItems.map((o) => [o.itemId, o.price]));

        if (groupedUserItems[item.item.id]) {
            groupedUserItems[item.item.id].quantity += 1; // 🔥 Additionne la quantité d'items identiques
        } else {
            groupedUserItems[item.item.id] = {
                id: item.item.id,
                name: item.item.name,
                description: item.item.description,
                img: item.item.img,
                rarity: item.item.rarity?.name || 'Unknown',
                price: orderItemsMap[item.item.id] || item.item.price, // ✅ Si mis en vente, afficher le prix de vente
                sellerId: item.userId, // ✅ L'ID du vendeur
                quantity: 1, // ✅ Ajoute la quantité
            };
        }
    });

    // 🔹 Formater les items de base (ceux du shop classique)
    const formattedItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        img: item.img,
        price: item.price,
        rarity: item.rarity?.name || 'Unknown',
        sellerId: null, // ✅ Pas de vendeur car c'est un item du shop normal
        quantity: null // ✅ Pas de quantité car c'est un item du shop normal
    }));

    // console.log(Object.values(groupedUserItems))

    return response.ok([...formattedItems, ...Object.values(groupedUserItems)]); // ✅ Fusionner les deux listes
}



async buyItem({ request, response, auth }: HttpContext) {
  const user = auth.user;
  if (!user) {
    return response.unauthorized({ message: 'Unauthorized' });
  }

  const i18n = i18nManager.locale(user.lang);
  const ListItem = request.input('ListItem');

  const itemIds = ListItem.map((item: { id: number }) => item.id);
  const itemPriceMap = Object.fromEntries(ListItem.map((i) => [i.id, i.price]));
  const itemQuantityMap = Object.fromEntries(ListItem.map((i) => [i.id, i.quantity || 1]));

  // 📌 Récupérer les items vendus par les utilisateurs
  const userItems = await UsersHuntingItem.query()
    .whereIn('item_id', itemIds)
    .where('shop', true)
    .preload('item', (query) => {
      query.select('id', 'price');
    });

  // 📌 Récupérer les items normaux du shop
  const shopItems = await Item.query()
    .whereIn('id', itemIds)
    .select('id', 'price');

  const shopItemIds = shopItems.map((item) => item.id);
  const userItemIds = userItems.map((item) => item.item.id);

  // 📌 Calcul du prix total
  const totalPrice = shopItems.reduce((acc, item) => acc + item.price, 0) +
    userItems.reduce((acc, item) => acc + (itemPriceMap[item.item.id] || item.item.price) * itemQuantityMap[item.item.id], 0);

  if (user.crowns < totalPrice) {
    return response.json({ message: i18n.t('_.Not enough crowns'), success: false });
  }

  user.crowns -= totalPrice;

  // 📌 Création de la commande pour l'acheteur
  const order = await Order.create({
    status: 'completed',
    createdAt: DateTime.now(),
    userId: user.id,
  });

  const orderItems = [];
  const itemsToDelete = [];

  for (const item of ListItem) {
    let quantityToBuy = itemQuantityMap[item.id];

    // 📌 Si c'est un item du shop normal
    if (shopItemIds.includes(item.id)) {
      const foundItem = shopItems.find((i) => i.id === item.id);
      if (foundItem) {
        for (let i = 0; i < quantityToBuy; i++) {
          orderItems.push({
            orderId: order.id,
            itemId: foundItem.id,
            price: foundItem.price,
          });

          // 📌 Ajouter l'item à l'inventaire de l'acheteur
          await UsersHuntingItem.create({
            userId: user.id,
            itemId: foundItem.id,
            shop: false,
            history: false,
          });
        }
      }
    }

    // 📌 Si c'est un item vendu par un joueur
    if (userItemIds.includes(item.id)) {
      let remainingToBuy = quantityToBuy;
      const foundItems = userItems.filter((i) => i.item.id === item.id);

      for (const foundItem of foundItems) {
        if (remainingToBuy <= 0) break;

        const seller = await User.find(foundItem.userId);

        // 📌 Vérifier les orders du vendeur
        const sellerOrders = await Order.query()
          .where('user_id', foundItem.userId)
          .andWhere('status', 'pending on sale');

        for (const sellerOrder of sellerOrders) {
          if (remainingToBuy <= 0) break;

          const matchingOrderItems = await OrdersItem.query()
            .where('order_id', sellerOrder.id)
            .andWhere('item_id', foundItem.item.id)
            .andWhere('price', itemPriceMap[foundItem.item.id])
            .limit(remainingToBuy); // Prendre le nombre exact d'items à acheter

          if (matchingOrderItems.length > 0) {
            for (const orderItem of matchingOrderItems) {
              if (remainingToBuy <= 0) break;

              orderItems.push({
                orderId: order.id,
                itemId: foundItem.item.id,
                price: itemPriceMap[foundItem.item.id],
              });

              // 📌 Créditer le vendeur
              if (seller) {
                seller.crowns += itemPriceMap[foundItem.item.id];
                await seller.save();
              }

              // 📌 Ajouter aux items à supprimer après la boucle
              itemsToDelete.push(foundItem.id);

              remainingToBuy -= 1;
            }

            // 📌 Vérifier si tous les items de l'order ont été vendus
            const remainingOrderItems = await OrdersItem.query()
              .where('order_id', sellerOrder.id)
              .whereNotIn('id', matchingOrderItems.map((o) => o.id));

            if (remainingOrderItems.length === 0) {
              await sellerOrder.merge({ status: 'sold' }).save();
            }

            // 📌 Ajouter un log de vente
            await LogHistory.create({
              userId: foundItem.userId,
              log: i18n.t('_.You have sold {itemName} for {price} crowns to {buyerName}', {
                itemName: foundItem.item.name,
                price: itemPriceMap[foundItem.item.id],
                buyerName: user.surname,
              }),
              orderId: order.id,
            });

            // 📌 Ajouter l'item à l'inventaire de l'acheteur
            await UsersHuntingItem.create({
              userId: user.id,
              itemId: foundItem.item.id,
              history: false,
              shop: false,
            });
          }
        }
      }
    }
  }

  await OrdersItem.createMany(orderItems);

  // 📌 Supprimer les items vendus en une seule requête
  if (itemsToDelete.length > 0) {
    await UsersHuntingItem.query().whereIn('id', itemsToDelete).delete();
  }

  await LogHistory.create({
    userId: auth.user.id,
    log: i18n.t('_.You have bought {numberItem} items for {price} crowns', {
      numberItem: orderItems.length,
      price: orderItems.reduce((acc, item) => acc + item.price, 0),
    }),
    orderId: order.id,
  });

  await user.save();

  return response.json({
    message: i18n.t('Items bought successfully'),
    success: true,
    orderId: order.id,
  });
}





  async putOnSale({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const i18n = i18nManager.locale(user.lang)
    const { id, price, quantity } = request.only(['id', 'price', 'quantity'])

    const items = await UsersHuntingItem.query()
      .where('user_id', user.id)
      .andWhere('item_id', id)
      .andWhere('shop', false)
      .limit(quantity)

    if (items.length === 0) {
      return response.json({ message: i18n.t('_.No items available for sale'), success: false })
    }

    await UsersHuntingItem.query()
      .whereIn(
        'id',
        items.map((item) => item.id)
      )
      .update({ shop: true })

    const order = await Order.create({
      status: 'pending on sale',
      createdAt: DateTime.now(),
      userId: user.id,
    })

    await OrdersItem.createMany(
      items.map((item) => ({
        orderId: order.id,
        itemId: item.itemId,
        price: price,
      }))
    )

    return response.json({ message: i18n.t('Item put on sale successfully'), success: true })
  }
}
