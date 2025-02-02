/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const NotificationController = () => import('#controllers/notification_controller')
const HuntingsController = () => import('#controllers/huntings_controller')
const UsersController = () => import('#controllers/users_controller')

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/notifications/push', [NotificationController, 'sendPush'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.post('/checkIsLogin', [AuthController, 'checkIsLogin'])
    router.get('/huntings/:id', [HuntingsController, 'getHunting'])
    router.get('/UserConnected', [UsersController, 'UserConnected'])
    router.post('/huntings/create', [HuntingsController, 'createHunting'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])
