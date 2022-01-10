import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'
import { Container } from 'typedi'

const router = express.Router()
// .sort({sortIndex:0})
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find()
      .populate({
        path: 'lists',
      })
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
      })
    res.status(200).json(board)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createBoard = async (req, res) => {
  const board = req.body
  const {id} = req.params
  try {
    const newBoard = await new Board(board).save()
    res.status(201).json(newBoard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const createList = async (req, res) => {
  const list = req.body
  const {id} = req.params
  const newList = new List(list)
  try {
    await newList.save()
    let parentBoard = await Board.findById(id)
    parentBoard.lists = [...parentBoard.lists, newList]
    await parentBoard.save()
    res.status(201).json(newList)
  } catch (error) {
    res.status(409).json({message: error.message})
  }
}

export const updateBoardLists = async (req, res) => {
  const { id } = req.params
  const { sourceIndex, destinationIndex, sortIndex, title, lists } = req.body
  const updates = Object.keys(req.body)

  try {
    // const board = await Board.findById(id)
    // const lists = await List.find()

    // const newList = [...lists]
    // const [removed] = newList.splice(sourceIndex, 1)
    // newList.splice(destinationIndex, 0, removed)

    // const orderedLists = newList.map((l, index) => {
    //   return { id: l._id, sortIndex: index + 1 }
    // })

    // orderedLists.forEach(async (l) => {
    //   await List.findByIdAndUpdate(l.id, {
    //     sortIndex: l.sortIndex,

    //   })
    // })

    await Board.findByIdAndUpdate(id, req.body, {new: true})

    res.json(lists)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  // const updateBoard = await Board.findByIdAndUpdate(id, req.body, {new: true})
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
