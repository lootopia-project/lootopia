import {HttpContext} from "@adonisjs/core/http";

export default class UsersController {

    async UserConnected({ auth, response }: HttpContext) {
        console.log("UserConnected");
        const user ={
            id: auth.user?.id,
            nickname: auth.user?.nickname,
            email: auth.user?.email,
            img: auth.user?.img,
            ranking: auth.user?.ranking,
            crowns: auth.user?.crowns,
        }
        return response.ok(user)
    }
}
