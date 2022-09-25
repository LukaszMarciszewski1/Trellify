import 'dotenv/config'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Board from '../models/Board'
import asyncHandler from 'express-async-handler'

export const getBoards = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id
    const boards = await Board.find({ user: userId })
      .populate({
        path: 'lists',
        model: 'List',
        populate: {
          path: 'cards',
          model: 'Card',
          populate: {
            path: 'files',
            model: 'File',
          },
        },
      })
      .exec()
    res.status(200).json(boards)
  } catch (error) {
    res.status(404).json({ error })
  }
})

export const getBoard = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const board = await Board.findById(id)
    res.status(200).json(board)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const createBoard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id
    const newBoard = await new Board({ user: userId }).save()
    res.status(201).json(newBoard)
  } catch (error) {
    res.status(409).json({ error })
  }
}

export const updateBoard = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No card with id: ${id}`)
    const updateBoard = await Board.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.json(updateBoard)
  } catch (error) {
    res.status(404).json({ error })
  }
}
