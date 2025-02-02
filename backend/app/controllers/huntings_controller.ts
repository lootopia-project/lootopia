import {HttpContext} from "@adonisjs/core/http";
import Hunting from "#models/hunting";
import db from "@adonisjs/lucid/services/db";
import {DateTime} from "luxon";
import {adminDatabase} from "#services/firebaseAdmin";

export default class HuntingsController {
    /**
     * Récupère les détails d'une chasse au trésor
     */
    async getHunting({ params, response, auth }: HttpContext) {
        try {

            // ID de la chasse à récupérer
            const huntingId = params.id;

            // Récupération des données de la chasse avec ses relations
            const hunting: Hunting = await Hunting.query()
                .preload("usersHunting", (query) => {
                    query.preload("user"); // Charge les détails des utilisateurs participants
                })
                .where("id", huntingId)
                .firstOrFail();

            // Récupération des informations de l'organisateur
            const organizer = await db.from("users").where("id", hunting.userId).first();
            if (!organizer) {
                return response.notFound({ message: "Organisateur introuvable" });
            }

            // Structure des participants
            const participants = hunting.usersHunting.map((userHunting) => ({
                id: userHunting.user.id,
                name: userHunting.user.name,
                score: userHunting.score,
                opinion: userHunting.opinion,
            }));

            // Résultat formaté
            const result = {
                id: hunting.id,
                title: hunting.title,
                description: hunting.description,
                organizer: {
                    id: organizer.id,
                    name: organizer.name,
                },
                participants: participants,
            };

            return response.ok(result);
        } catch (error) {
            console.error("Erreur lors de la récupération de la chasse :", error);
            return response.internalServerError({ message: "Erreur lors de la récupération de la chasse." });
        }
    }

    /**
     * Crée une nouvelle chasse au trésor
     */
    async createHunting({ auth, response }: HttpContext) {

        const user = auth.user;
        if (!user) {
            return response.unauthorized({ message: "Utilisateur non authentifié" });
        }

        // Créer une nouvelle chasse dans votre base locale
        const hunting = await Hunting.create({
            title: "Chasse au trésor épique pour les débutants et pour les noobs",
            description: "Une aventure unique pour découvrir des trésors cachés au cœur de la forêt.",
            price: 50,
            minUser: 2,
            maxUser: 5,
            private: false,
            endDate: DateTime.now().plus({ days: 7 }),
            searchDelay: "02:00:00", // Format HH:mm:ss
            status: true,
            background: "https://example.com/bg.jpg",
            textColor: "#FFFFFF",
            headerImg: "https://example.com/header.jpg",
            userId: user.id,
            worldId: 1, // À ajuster selon votre logique
        });

        // Préparer les données pour Firebase
        const newHuntData = {
            id: hunting.id,
            title: hunting.title,
            description: hunting.description,
            organizer: user.nickname,
            participants: [],
            messages:
                [
                    {
                        message: "Bienvenue dans la chasse au trésor !",
                        date: DateTime.now().toISO(),
                        sender  : user.nickname,
                    },
                    ]
        };

        try {
            const huntRef = adminDatabase.ref(`treasureHunts/${hunting.id}`);

            await huntRef.set(newHuntData);


            return response.created({
                message: "Chasse au trésor créée avec succès",
                huntId: hunting.id,
            });
        } catch (error) {
            console.error("Erreur lors de la création de la chasse dans Firebase :", error);
            return response.internalServerError({ message: "Erreur interne lors de la création de la chasse." });
        }
    }
}
