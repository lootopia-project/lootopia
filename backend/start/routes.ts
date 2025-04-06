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
//frontend controllers
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

//backend controllers
const AdminAuthsController = () => import('#controllers/admin/auth_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')
const AdminItemsController = () => import('#controllers/admin/items_controller')
const AdminHuntingsController = () => import('#controllers/admin/huntings_controller')
const I18NsController = () => import('#controllers/admin/i_18_ns_controller')
const AdminShopCrownsController = () => import('#controllers/admin/shop_crowns_controller')
const AdminTypeItemsController = () => import('#controllers/admin/type_items_controller')

//frontend routes
router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/users/checkDoubleAuth', [DoubleAuthsController, 'checkDoubleAuth'])
router.post('/users/checkRecoveryCode', [DoubleAuthsController, 'checkRecoveryCode'])
router.post('/users/CheckMailToken', [UsersController, 'CheckMailToken'])
router.post('/users/loginOrRegisterGoogle', [AuthController, 'loginOrRegisterGoogle'])
router.post('/forgot-password', [AuthController, 'forgotPassword'])
router.post('/reset-password', [AuthController, 'resetPassword'])
router.post('/csrf-token', async ({ request, response }) => {
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
    router.get('users/searchUsers', [UsersController, 'searchUsers'])
    router.post('/users/exchangeItemUsers', [ItemsController, 'exchangeItemUsers'])
    router.get('items/getAllItem', [ItemsController, 'getAllItem'])
    router.post('/items/verifyReceiverItems', [ItemsController, 'verifyReceiverItems'])
    router.get('/items/getItemsMessageUser', [ItemsController, 'getItemsMessageUser'])
  })
  .use([
    middleware.auth({
      guards: ['api'],
    }),
  ])

//backend routes
router.get('/', async ({ view, auth, response }) => {
  const check = await auth.check()
  if (check) {
    return response.redirect('/home')
  }
  return view.render('pages/login')
})
router.post('/admin/login', [AdminAuthsController, 'login'])
router.get('/admin/logout', [AdminAuthsController, 'logout'])
router.post('i18n',[I18NsController, 'index'])
router
  .group(() => {
    router.get('/home', async ({ view, auth }) => {
      return view.render('pages/index', {
        auth: auth,
      })
    })
    router.resource('/users', AdminUsersController)
    router.resource('/items', AdminItemsController)
    router.resource('/huntings', AdminHuntingsController)
    router.resource('/shopCrowns', AdminShopCrownsController)
    router.resource('/typeItems', AdminTypeItemsController)
    router.post('/huntings/:id/items', [AdminHuntingsController, 'addItem'])
    router.delete('/huntings/:huntingId/items/:itemId', [AdminHuntingsController, 'removeItem'])
    router.post('/huntings/:id/users', [AdminHuntingsController, 'addUser'])
    router.delete('/huntings/:huntingId/users/:userId', [AdminHuntingsController, 'removeUser'])
  })
  .use([
    middleware.auth({
      guards: ['web'],
    }),
  ])
