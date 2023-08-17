import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import routeUsers from './routes/users.js'
import routeProducts from './routes/products.js'
import routeOrders from './routes/orders.js'
import './passport/passport.js'

const app = express()

app.use(rateLimit({
  // 設定一個 ip 在 15 分鐘以內，最多請求 80 次
  windowMs: 15 * 60 * 1000,
  max: 80,
  // 設定回應 headers
  standardHeaders: true,
  legacyHeaders: false,
  // 超出流量時回應的狀態碼
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: '超出流量，太多請求',
  // 超出流量時回應的 function
  handler (req, res, next, options) {
    res.status(options.statusCode).json({
      success: false,
      message: options.message
    })
  }
}))

app.use(cors({
  // origin 請求來源
  // calllback 是否允許請求通過
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      // callback(錯誤 , 是否允許通過)
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use(mongoSanitize())

app.use('/users', routeUsers)
app.use('/products', routeProducts)
app.use('/orders', routeOrders)

//  * 代表所有路徑的所有請求
// 上面所有請求跑完後，用 app.call('*',()=>{})去擋沒有擋到的請求
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到該頁面'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  // mongoose.set('sanitizeFilter', true) 防止別人攻擊資料庫
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
