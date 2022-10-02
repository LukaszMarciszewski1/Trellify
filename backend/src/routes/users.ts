import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware'
import { registerUser, loginUser, getMe } from '../controllers/users'

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

export default router
