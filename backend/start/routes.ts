/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import DoubleAuthsController from "#controllers/double_auths_controller";
const AuthController = () => import('#controllers/auth_controller')
const NotificationController = () => import('#controllers/notification_controller')
const HuntingsController = () => import('#controllers/huntings_controller')
const UsersController = () => import('#controllers/users_controller')

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.post('/checkIsLogin', [AuthController, 'checkIsLogin'])
    router.get('/huntings/getAllForMessage', [
      HuntingsController,
      'getHuntingsParticpatedOrOrganized',
    ])
    router.get('/users/getInfoUser', [UsersController, 'getInfoUser'])
    router.post('/users/updateInfoUser', [UsersController, 'updateInfoUser'])
    router.post('/users/updatePassword', [UsersController, 'updatePassword'])
      router.post('/users/toggleDoubleAuth', [DoubleAuthsController, 'toggleTwoFactorAuth'])
      router.get('/users/isTwoFactorEnabled', [DoubleAuthsController, 'isTwoFactorEnabled'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])
