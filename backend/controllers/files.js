import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import File from '../models/File.js'

const router = express.Router()

export const getFiles = async (req, res) => {
  try {
    const file = await File.find()
    res.status(200).json(file)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getFile = async (req, res) => {
  const { id } = req.params
  try {
    const file = await File.findById(id)
    res.status(200).json(file)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const addFile = async (req, res) => {
  const { cardId } = req.body
  const newFile = new File(req.body)
  let parentCard = await Card.findById(cardId)
  try {
    parentCard.files = [...parentCard.files, newFile]
    parentCard.save()
    newFile.save()
    res.status(201).json(newFile)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const deleteFile = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)

  await File.findByIdAndRemove(id)
  res.json({ message: 'Card deleted successfully.' })
}

export const deleteAllCardsOfList = async (req, res) => {
  await File.remove({})
  res.status(201).json('Card deleted successfully.')
}

export default router