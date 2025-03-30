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
const PaymentsController = () => import('#controllers/payments_controller')
const ShopCrownsController = () => import('#controllers/shop_crowns_controller')
const ItemsController = () => import('#controllers/items_controller')
const LogHistoriesController = () => import('#controllers/log_histories_controller')
const OrdersController = () => import('#controllers/orders_controller')
const SpotsController = () => import('#controllers/spots_controller')
const AdminAuthsController = () => import('#controllers/admin_auths_controller')



router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/users/checkDoubleAuth', [DoubleAuthsController, 'checkDoubleAuth'])
router.post('/users/checkRecoveryCode', [DoubleAuthsController, 'checkRecoveryCode'])
router.post('/users/CheckMailToken', [UsersController, 'CheckMailToken'])
router.post('/users/loginOrRegisterGoogle', [AuthController, 'loginOrRegisterGoogle'])
router.post('/forgot-password', [AuthController, 'forgotPassword'])
router.post('/reset-password', [AuthController, 'resetPassword'])
router.post('/csrf-token', async ({request, response}) => { 
  return response.json({
    csrfToken: request.csrfToken,
  })
})
router
  .post('stripe/webhook', [PaymentsController, 'handleWebhook'])
  .use(middleware.verifyStripeWebhook())
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/huntings/getAllForMessage', [
      HuntingsController,
      'getHuntingsParticpatedOrOrganized',
    ])
    router.get('/huntings/getAllHuntings', [HuntingsController, 'getAllHuntings'])
    router.get('/huntings/getPublicHuntings', [HuntingsController, 'getPublicHuntings'])
    router.post('/checkIsLogin', [AuthController, 'checkIsLogin'])
    router.get('/users/getInfoUser', [UsersController, 'getInfoUser'])
    router.post('/users/updateInfoUser', [UsersController, 'updateInfoUser'])
    router.post('/users/updatePassword', [UsersController, 'updatePassword'])
    router.post('/users/toggleDoubleAuth', [DoubleAuthsController, 'toggleTwoFactorAuth'])
    router.get('/users/isTwoFactorEnabled', [DoubleAuthsController, 'isTwoFactorEnabled'])
    router.post('/users/validateTwoFactorCode', [DoubleAuthsController, 'validateTwoFactorCode'])
    router.get('/users/recoveryCode', [DoubleAuthsController, 'recoveryCode'])
    router.post('/users/CheckMail', [UsersController, 'CheckMail'])
    router.post('/stripe/initPayment', [PaymentsController, 'initPayment'])
    router.post('/stripe/addCrowns', [PaymentsController, 'addCrowns'])
    router.get('/shop/getShopCrowns', [ShopCrownsController, 'getShopCrowns'])
    router.post('/shop/buyItem', [ItemsController, 'buyItem'])
    router.get('/shop/getListItem', [ItemsController, 'getListItem'])
    router.get('shop/getLogHistories', [LogHistoriesController, 'getLogHistories'])
    router.get('/shop/getOrderDetailWithId/:id', [OrdersController, 'getOrderDetailWithId'])
    router.post('/getSpot', [SpotsController, 'getSpot'])
    router.post('/pushSpot', [SpotsController, 'pushSpotInMap'])
    router.get('/shop/getListItemUser', [ItemsController, 'getListItemUser'])
    router.post('/shop/addItemToShop', [ItemsController, 'addItemToShop'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])


router.get('/', async ({ view, auth, response }) => {
  const check = await auth.check()
  if (check) {
    return response.redirect('/home')
  }
  return view.render('pages/login')
})
router.post('/admin/login', [AdminAuthsController, "login"])
router.get('/admin/logout', [AdminAuthsController, "logout"])
router.group(() => {
  router.get('/home', async ({ view, auth }) => {
    return view.render('pages/index',{
      auth: auth,
    })
  })
})
.use([
  middleware.auth({
    guards: ['web'],
  }),
])