import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const messagesProvider = new SimpleMessagesProvider({
  'required': '{{ field }} field must be required',
  'string': '{{ field }} field must be string',
  'database.unique': '{{ field }} field already used',
})

export const registerValidate = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
    email: vine.string().unique({ table: 'users', column: 'email' }),
    role_id: vine.number(),
  })
)

export const userUpdateValidate = vine.compile(
  vine.object({
    username: vine.string(),
    email: vine.string(),
    no_hp: vine.number(),
    date_of_birth: vine.string(),
    address: vine.string(),
    gender: vine.string(),
    image: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png'],
        size: '10mb',
      })
      .optional(),
    role_id: vine.number(),
  })
)

export const loginValidate = vine.compile(
  vine.object({
    password: vine.string(),
    email: vine.string(),
  })
)

export const feedbackValidate = vine.compile(
  vine.object({
    name: vine.string(),
    comment: vine.string(),
  })
)

export const categoriesValidate = vine.compile(
  vine.object({
    name: vine.string(),
  })
)

export const productValidate = vine.compile(
  vine.object({
    name: vine.string(),
    image: vine.file({
      extnames: ['jpg', 'jpeg', 'png'],
      size: '10mb',
    }),
    description: vine.string(),
    quantity: vine.number(),
    price: vine.number(),
    category_id: vine.number(),
  })
)

export const commentValidate = vine.compile(
  vine.object({
    message: vine.string(),
    product_id: vine.number(),
  })
)

export const transactionValidate = vine.compile(
  vine.object({
    product_id: vine.number(),
    quantity: vine.number(),
    total: vine.number(),
    status: vine.enum(['packed', 'delivered', 'finished', 'canceled']),
  })
)

export const chatValidate = vine.compile(
  vine.object({
    receiver: vine.number(),
    message: vine.string(),
    room_id: vine.number(),
    image: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png'],
        size: '10mb',
      })
      .optional(),
  })
)

export const roomChatValidate = vine.compile(
  vine.object({
    sender: vine.number(),
    receiver: vine.number(),
  })
)
