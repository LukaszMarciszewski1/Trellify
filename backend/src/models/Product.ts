import mongoose, { Schema, Types } from 'mongoose'

const ProductSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    category: String,
    quantity: Number,
    unit: String,
    price: Number,
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', ProductSchema)

export default Product
