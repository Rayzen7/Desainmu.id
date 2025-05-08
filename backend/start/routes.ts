/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
const RoomChatsController = () => import('#controllers/room_chats_controller')
const ChatsController = () => import('#controllers/chats_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const CommentsController = () => import('#controllers/comments_controller')
const ProductsController = () => import('#controllers/products_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const FeedbacksController = () => import('#controllers/feedbacks_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth
router.group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [AuthController, 'register'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.token())
}).prefix('/auth')

// All Image
router.get('/account/user/:file', async ({ params, response }) => {
  const filePath = app.makePath(`public/user/${params.file}`)
  return response.download(filePath)
})

router.get('/image/product/:file', async ({ params, response }) => {
  const filePath = app.makePath(`public/product/${params.file}`)
  return response.download(filePath)
})

router.get('/chat/:id/:file', async ({ params, response }) => {
  const filePath = app.makePath(`public/chat/${params.id}/${params.file}`)
  return response.download(filePath)
})

// Product
router.get('/product', [ProductsController, 'index'])
router.get('/product/:id', [ProductsController, 'show'])

// Category
router.get('/category/product', [CategoriesController, 'index'])

// Comment
router.get('/comment', [CommentsController, 'index'])
router.get('/comment/:id', [CommentsController, 'show'])

// Middleware Auth
router.group(() => {
    // All User
    router.get('/me', [AuthController, 'me'])
    router.get('/getuser/:id', [UsersController, 'show'])
    router.put('/getuser/:id', [UsersController, 'update'])

    // Chat
    router.resource('/chat', ChatsController)
    router.resource('/room/chat', RoomChatsController)
    router.get('/room/admin/chat', [RoomChatsController, 'indexAdmin'])

    // Super Admin
    router.group(() => {
        // User
        router.get('/getuser', [UsersController, 'user'])
        router.get('/getadmin', [UsersController, 'admin'])
        router.get('/getuser/:id', [UsersController, 'show'])
        router.delete('/getuser/:id', [UsersController, 'destroy'])

        // Feedback
        router.get('/feedback', [FeedbacksController, 'index'])

        // Category
        router.resource('/category', CategoriesController)
    }).prefix('/super').use(middleware.role(1))

    // Admin
    router.group(() => {
      // Product
      router.resource('/product', ProductsController)

      // Transaction
      router.get('/transaction', [TransactionsController, 'indexAdmin'])
      router.get('/transaction/:id', [TransactionsController, 'show'])
      router.put('/transaction/:id', [TransactionsController, 'update'])

      // Comment
      router.get('/comment/:id', [CommentsController, 'show'])
      router.delete('/comment/:id', [CommentsController, 'destroy'])
    }).prefix('/admin').use(middleware.role(2))

    // User
    router.group(() => {
      // Comment
      router.resource('/comment', CommentsController)

      // product
      router.put('/product/:id', [ProductsController, 'updateQuantity'])

      // Transaction
      router.get('/transaction', [TransactionsController, 'index'])
      router.get('/transaction/:id', [TransactionsController, 'show'])
      router.post('/transaction', [TransactionsController, 'store'])
    }).prefix('/user').use(middleware.role(3))    
}).use(middleware.token())

// Feedback
router.post('/feedback', [FeedbacksController, 'store'])
