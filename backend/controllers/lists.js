import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'
import File from '../models/File.js'
import dotenv from 'dotenv'
import { deleteFileS3 } from '../helpers/filehelper.js'

dotenv.config()
const router = express.Router()

export const getLists = async (req, res) => {
  try {
    const lists = await List.find().sort({ timestamp: -1 })
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
  try {
    const newList = new List({ title, boardId })
    let parentBoard = await Board.findById(boardId)
    parentBoard.lists = [...parentBoard.lists, newList]
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
   const cards = await Card.find()
   const files = await File.find()
   const listCards = cards.filter(card => mongoose.Types.ObjectId(card.listId).toString() === id)

  await Card.deleteMany({ listId: id })
  await List.findByIdAndRemove(id)

   const allCardsWithFiles = listCards.map(card => {
     return files.filter(file => mongoose.Types.ObjectId(file.cardId).toString() === mongoose.Types.ObjectId(card._id).toString())
   })

   allCardsWithFiles.map(files => files.map(async (file) => {
     const params = {
       Bucket: process.env.S3_BUCKET_NAME,
       Key: file.fileKey,
      }
      deleteFileS3(params)
      await File.deleteMany({ cardId: file.cardId})
    }))

    res.json({ message: 'List deleted successfully.' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const updateList = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No list with id: ${id}`)
  const updateList = await List.findByIdAndUpdate(id, req.body, { new: true })
  res.json(updateList)
}

export const deleteAllCardsOfList = async (req, res) => {
  const { cardId } = req.body
  const { id } = req.params
  try {
    await Card.deleteMany({ listId: id })
    // await File.deleteMany({ cardId: cardId })
    res.json({ message: 'Cards deleted successfully.' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export default router
