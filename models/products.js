import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  price: {
    type: Number,
    required: [true, '缺少商品價格'],
    min: [0, '商品不得低於0元']
  },
  image: {
    type: String,
    required: [true, '缺少商品照']

  },
  description: {
    type: String,
    required: [true, '缺少商品說明']
  },
  category: {
    type: String,
    required: [true, '缺少商品分類'],
    enum: {
      values: ['鮮魚本舖', '鮮蝦螃蟹', '貝類軟體', '調理珍饌', '嚴選肉品', '其他鮮貨', '會員專區'],
      message: '分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少商品上架狀態']
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
