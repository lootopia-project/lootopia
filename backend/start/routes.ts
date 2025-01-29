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

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.post('/checkIsLogin', [AuthController, 'checkIsLogin'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])
