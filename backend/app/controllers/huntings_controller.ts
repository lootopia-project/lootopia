// import type { HttpContext } from '@adonisjs/core/http'

import {HttpContext} from "@adonisjs/core/http";
import Hunting from "#models/hunting";
import db from "@adonisjs/lucid/services/db";

export default class HuntingsController {

    async getHunting({ params, response,auth }: HttpContext) {
        console.log('getHunting')
        const huntingId = params.id;
        const hunting = await Hunting.query().preload('usersHunting', (query) => {
            query.preload('user') // Charge les détails des utilisateurs participants
        }).where('id', huntingId).firstOrFail()
        const organizer=await db.from('users').where('id', hunting.userId).first()
        const participants = hunting.usersHunting.map((userHunting) => ({
            id: userHunting.user.id,
            name: userHunting.user.name, // Supposez que la colonne 'name' existe dans la table 'users'
            score: userHunting.score,
            opinion: userHunting.opinion,
        }))

        const result = {
            id: hunting.id,
            title: hunting.title,
            description: hunting.description,
            organizer: {
                id: organizer.id,
                name: organizer.name, // Supposez que la colonne 'name' existe dans la table 'users'
            },
            participants: participants,
        }
        // users.put('organizer', organizedHunting)
        console.log(result)
        return response.ok(result)
    }
}
