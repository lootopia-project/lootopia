import db from '@adonisjs/lucid/services/db'
import User from "#models/user";
import MailService from "../service/mail_service.js";

export default class NotificationsController {
    async sendMail() {
        // console.log("sendMail")
        // const users:User=await db.from('users').where('nickname', 'kevin').first()
        //
        // await MailService.sendMail("recompenses", users)

    }
}
