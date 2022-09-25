import express from 'express'
import { protect } from '../middlewares/authMiddleware'
const router = express.Router()

import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from '../controllers/products'

router.get('/', protect, getProducts)
router.get('/:id', protect, getProduct)
router.post('/', protect, createProduct)
router.patch('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

export default router