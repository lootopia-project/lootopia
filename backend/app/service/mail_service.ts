import User from "#models/user";
import mail from "@adonisjs/mail/services/main";

export default class MailService {
    static async sendMail(type: string, user: User) {
        let subject = "";
        let view = "";
        let templateData: any = {};

        switch (type) {
            case "inscription":
                subject = "Bienvenue sur Lootopia !";
                view = "emails/notification";
                templateData = {
                    name: user.name,
                    message: "Merci de vous être inscrit sur Lootopia.",
                    objet: subject,
                };
                break;

            case "recompenses":
                subject = "Félicitations pour vos récompenses !";
                view = "emails/notification";
                templateData = {
                    name: user.name,
                    message: "Vous avez débloqué de nouvelles récompenses sur Lootopia !",
                    objet: subject,
                };
                break;

            case "paiement":
                subject = "Confirmation de paiement";
                view = "emails/notification";
                templateData = {
                    name: user.name,
                    message: "Votre paiement a été traité avec succès.",
                    objet: subject,
                };
                break;

            default:
                throw new Error(`Type d'email inconnu : ${type}`);
        }

        await mail.send((mail) => {
            mail
                .from("noreply.lootopia@gmail.com")
                .to(user.email)
                .subject(subject)
                .htmlView(view, templateData);
        });
    }
}
