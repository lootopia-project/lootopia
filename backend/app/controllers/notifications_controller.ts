import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class NotificationsController {
    async sendMail({view}: HttpContext) {
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
        // return view.render('emails/notification', { message: 'Hello world' })
        await mail.send((mail) => {
            mail
                .from('noreply.lootopia@gmail.com')
                .to("kevinmetri.pro@gmail.com") 
                .subject('Une notification de Lootopia')
                .htmlView('emails/notification', {  message:"" }) 
        })

        return {
            message: 'Email envoyé avec succès à ' ,
            status: 'success',
        }
    }
}
