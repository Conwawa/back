import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

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
  account: {
    type: String,
    required: [true, '缺少帳號'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '帳號信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '缺少密碼']
  },
  tokens: {
    type: [String],
    default: []
  },
  phoneNumber: {
    type: String,
    required: [true, '缺少手機號碼'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isMobilePhone(value, 'zh-TW')
      },
      message: '手機號碼錯誤'
    }
  },
  cart: {
    type: [cartSchema],
    default: []
  },
  role: {
    type: Number,
    default: UserRole.USER
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 6) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼至少需六個字' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼最多二十個字' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length < 6) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼至少需六個字' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼最多二十個字' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default mongoose.model('users', schema)
