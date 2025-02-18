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
const DoubleAuthsController = () => import('#controllers/double_auths_controller')
const AuthController = () => import('#controllers/auth_controller')
const HuntingsController = () => import('#controllers/huntings_controller')
const UsersController = () => import('#controllers/users_controller')

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/users/checkDoubleAuth', [DoubleAuthsController, 'checkDoubleAuth'])
router.post('/users/checkRecoveryCode', [DoubleAuthsController, 'checkRecoveryCode'])
router.post('/users/CheckMailToken', [UsersController, 'CheckMailToken'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/huntings/getAllForMessage', [
      HuntingsController,
      'getHuntingsParticpatedOrOrganized',
    ])
    router.post('/checkIsLogin', [AuthController, 'checkIsLogin'])
    router.get('/users/getInfoUser', [UsersController, 'getInfoUser'])
    router.post('/users/updateInfoUser', [UsersController, 'updateInfoUser'])
    router.post('/users/updatePassword', [UsersController, 'updatePassword'])
    router.post('/users/toggleDoubleAuth', [DoubleAuthsController, 'toggleTwoFactorAuth'])
    router.get('/users/isTwoFactorEnabled', [DoubleAuthsController, 'isTwoFactorEnabled'])
    router.post('/users/validateTwoFactorCode', [DoubleAuthsController, 'validateTwoFactorCode'])
    router.get('/users/recoveryCode', [DoubleAuthsController, 'recoveryCode'])
    router.post('/users/CheckMail', [UsersController, 'CheckMail'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])
