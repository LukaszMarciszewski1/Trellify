import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'

const router = express.Router()
// .sort({sortIndex:0})
export const getLists = async (req, res) => {
  try {
    const lists = await List.find().sort( { timestamp : -1 } )
    // .populate({
    //   path: 'cards',
    // })
    res.status(200).json(lists)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getList = async (req, res) => {
  const { id } = req.params
  try {
    const list = await List.findById(id)
    res.status(200).json(list)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createList = async (req, res) => {
  const { title, boardId } = req.body
  // const boardId = '61e458c95b6b39b805ae2dcd'
  try {
    const newList = new List({ title, boardId })
    let parentBoard = await Board.findById(boardId)
    parentBoard.lists = [...parentBoard.lists, newList]
    // parentBoard.listOrder = [...parentBoard.listOrder, newList._id]
    await parentBoard.save()
    await newList.save()
    res.status(201).json(newList)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const deleteList = async (req, res) => {
  const { id } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No list with id: ${id}`)
    await List.findByIdAndRemove(id)
    const cards = await Card.find({ listId: id })
    cards.forEach(async (card) => await Card.deleteOne({ id: card.id }))
    res.json({ message: 'List deleted successfully.' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const updateList = async (req, res) => {
  const { id } = req.params
  const { sourceIndex, destinationIndex } = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No list with id: ${id}`)
  const updateList = await List.findByIdAndUpdate(id, req.body, { new: true })
  // const updateList = await List.findById(id)
  //  .then(() => )

  res.json(updateList)
}

export const getUpdateList = async (req, res) => {
  const { id } = req.params
  const { sourceIndex, destinationIndex, sortIndex, title, lists } = req.body
  const updates = Object.keys(req.body)

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)
  const updateList = await List.findByIdAndUpdate(id, req.body, { new: false })
  res.json(updateList)
}

export const getUpdateCards = async (req, res) => {
  const { id, index, sourceIndex, destinationIndex } = req.params
  try {
    const lists = await List.find()
    const updateList = await List.findById(id)
    const newEl = [...lists]
    const [list] = newEl.splice(sourceIndex, 1)
    newEl.splice(destinationIndex, 0, list)

    const orderedLists = lists.map((l, index) => {
      return { id: l._id, sortIndex: index + 1 }
    })

    //TODO: Multi update implementation rather than separate queries
    orderedLists.forEach(async (l) => {
      await lists.update(l.id, {
        sortIndex: l.sortIndex,
      })
    })

    res.status(200).json(newEl)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const addCard = async (req, res) => {
  const { id } = req.params
  const card = req.body
  const newCard = new Card(card)
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
  // const addCard = await Tasks.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No task with id: ${id}`)
    await List.findByIdAndUpdate(id, { $push: { cards: { newCard } } })
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export default router
