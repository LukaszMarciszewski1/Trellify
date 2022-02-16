import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'
import { Container } from 'typedi'
const { Schema } = mongoose
const router = express.Router()
// .sort({sortIndex:0})
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find()
    // .exec()
    // .sort('sortIndex')
    res.status(200).json(boards)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getBoard = async (req, res) => {
  const { id } = req.params
  try {
    const board = await Board.findById(id)
      .populate({
        path: 'lists',
        populate: {
          path: 'cards',
        },
      })
      // .exec()
      // .populate({path: 'lists'})
      .populate({ path: 'cards' })
      .exec()
    res.status(200).json(board)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createBoard = async (req, res) => {
  const board = req.body
  const { id } = req.params
  try {
    const newBoard = await new Board(board).save()
    res.status(201).json(newBoard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updateBoard = async (req, res) => {
  const { id } = req.params
  const { sourceIndex, destinationIndex, sortIndex, title, lists } = req.body
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No card with id: ${id}`)
    const updateBoard = await Board.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.json(updateBoard)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  // const updateBoard = await Board.findByIdAndUpdate(id, req.body, {new: true})
}

export default router
