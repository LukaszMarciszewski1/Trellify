import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import User from '../models/User'
import generateToken from '../utils/generateToken'
import Board from '../models/Board'

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid Email or Password')
  }
})

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(404)
      throw new Error('User already exists')
    }
    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
      await new Board({ user: user._id }).save()
    } else {
      res.status(400)
      throw new Error('User not found')
    }
  }
)

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(req.user)
})
