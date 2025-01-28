// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from "@adonisjs/core/http";
import mail from '@adonisjs/mail/services/main'

export default class NotificationsController {
    async sendMail({}: HttpContext) {
        // Récupérer l'utilisateur authentifié
        // const user = auth.use('api').user
        //
        // if (!user) {
        //     return {
        //         message: 'Utilisateur non authentifié.',
        //         status: 'error'
        //     }
        // }

        // Récupérer le message depuis la requête
        // const { message } = request.all()

        // Envoyer l'email
        await mail.send((mail) => {
            mail
                .from('noreply.lootopia@gmail.com') // Remplacez par votre adresse email d'envoi
                .to("kevinmetri.pro@gmail.com") // Adresse email de l'utilisateur
                .subject('Une notification de Lootopia')
                .htmlView('emails/notification', {  message:"" }) // Vue HTML pour l'email
        })

        return {
            message: 'Email envoyé avec succès à ' ,
            status: 'success',
        }
    }
}
