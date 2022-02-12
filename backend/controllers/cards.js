import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import List from '../models/List.js'
import Board from '../models/Board.js'

const router = express.Router()
// .sort('sortIndex')
export const getCards = async (req, res) => {
  try {
    const card = await Card.find().sort('sortIndex')
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getCard = async (req, res) => {
  const { id } = req.params
  try {
    const card = await Card.findById(id)
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createCard = async (req, res) => {
  // const {id} = req.params
  // try {
  // const listId = req.body.listId
  // const list = await List.findOne({_id: listId})
  // if(!list) return res.status(404).send()
  // const newCard = new Card(req.body)
  //   await newCard.save()
  //   // await Tasks.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
  //   res.status(201).json(newCard)
  // } catch (error) {
  //   res.status(409).json({message: error.message})
  // }

  const { title, listId, boardId } = req.body
  // const boardId = '61dddb69911985a8b66dbefe'
  const newCard = new Card({ title, listId, boardId })
  let parentBoard = await List.findById(listId)
  try {
    parentBoard.cards = [...parentBoard.cards, newCard]
    await parentBoard.save()
    await newCard.save()
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updateCard = async (req, res) => {
  const { id } = req.params
  const card = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)
   const updateCard = await Card.findByIdAndUpdate(id, req.body, { new: true })

  res.json(updateCard)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteCard = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)

  await Card.findByIdAndRemove(id)
  res.json({ message: 'Card deleted successfully.' })
}

export const deleteAllCardsOfList = async (req, res) => {
  await Card.remove({})
  res.status(201).json('Card deleted successfully.')
}

export const updateList = async (req, res) => {
  const { id } = req.params
  const list = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No list with id: ${id}`)
  const updateList = await List.findByIdAndUpdate(id, req.body, { new: true })
  res.json(updateList)
}

export const updateAllCards = async (req, res) => {
  const { id } = req.params
  const card = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)

  res.json(updateCard)
}

export default router
