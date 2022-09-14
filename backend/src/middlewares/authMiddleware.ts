import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import asyncHandler from 'express-async-handler'
import { config } from '../config/config';

interface JwtPayload {
  id: string
}
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})
