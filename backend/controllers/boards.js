import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'
import { Container } from 'typedi'
import BoardService from '../services/board.js'

const router = express.Router()
// .sort({sortIndex:0})
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find()
      .populate({
        path: 'lists',
      })
      .exec()
      .sort('sortIndex')
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
      })
      .exec()
    res.status(200).json(board)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createBoard = async (req, res) => {
  const board = req.body
  const newBoard = new Board(board)
  try {
    await newBoard.save()
    res.status(201).json(newBoard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updateBoardLists = async (req, res) => {
  const { id } = req.params
  const { sourceIndex, destinationIndex, sortIndex } = req.body
  const updates = Object.keys(req.body)

  try {
    const board = await Board.findById(id)
    const lists = await List.find()
    const [removed] = lists.splice(sourceIndex, 1)
    lists.splice(destinationIndex, 0, removed)

    const orderedLists = lists.map((l, index) => {
      return { id: l._id, sortIndex: index + 1 }
    })
console.log(board.lists)
    //TODO: Multi update implementation rather than separate queries
    orderedLists.forEach(async (l) => {
      await List.findByIdAndUpdate(l.id, {
        sortIndex: l.sortIndex,
      })
    })
    const updateBoard = await Board.findOneAndUpdate(id, req.body, {new: true})

    res.json(updateBoard)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// export default router

// const { id } = req.params
// const { sortIndex, sourceIndex, destinationIndex } = req.body

// try {
//   const board = await Board.findById('61d81621515521bcb506ab88')
//   const listsDB = await List.find()

//   const lists = [...listsDB]
//   const [removed] = lists.splice(source.index, 1)
//   lists.splice(destination.index, 0, removed)

//   await Board.findByIdAndUpdate(
//     id,
//     { sortIndex, sourceIndex, destinationIndex },
//     { new: true }
//   )

//   return res.status(200).json(lists)
// } catch (error) {
//   res.status(404).json({ message: error.message })
// }
