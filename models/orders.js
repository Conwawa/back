import mongoose from 'mongoose'
import OrderStatus from '../enums/OrderStatus.js'

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  date: {
    type: Date,
    default: Date.now
  },
  cart: {
    type: [cartSchema],
    default: [],
    validate: {
      validator (value) {
        // Array.isArray(value) JS內建的方法，用來檢查是否為“陣列”
        return Array.isArray(value) && value.length > 0
      },
      message: '購物車不得為空'
    }
  },
  // 訂單狀態
  orderStatus: {
    type: Number,
    default: OrderStatus.PREPARING
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
