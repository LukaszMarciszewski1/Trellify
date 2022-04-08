import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import File from '../models/File.js'
import List from '../models/List.js'
import fs from 'fs'

const router = express.Router()
export const getCards = async (req, res) => {
  try {
    const card = await Card.find().sort({ timestamp: -1 })
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
  const { title, labels, listId } = req.body
  const newCard = new Card(req.body)
  let parentList = await List.findById(listId)
  try {
    parentList.cards = [...parentList.cards, newCard]
    parentList.save()
    newCard.save()
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updateCard = async (req, res) => {
  const { id } = req.params
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
  const { boardId } = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)

  await Card.findByIdAndRemove(id)
  res.json({ message: 'Card deleted successfully.' })
}

export const deleteAllCardsOfList = async (req, res) => {
  await Card.remove({})
  res.status(201).json('Card deleted successfully.')
}

export const updateAllCards = async (req, res) => {
  const { id } = req.params
  const card = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)

  res.json(updateCard)
}

export const uploadFiles = async (req, res, next) => {
  const { id } = req.params
  try {
    let parentCard = await Card.findById(id)
    req.files.map(async (element) => {
      const file = new File({
        cardId: id,
        fileName: element.originalname,
        filePath: element.path,
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2),
      })
      parentCard.files.push(file)
      await file.save()
    })

    await parentCard.save()
    res.status(201).send('Files Uploaded Successfully')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getFiles = async (req, res, next) => {
  const { id } = req.params
  try {
    let files = await Card.findById(id)
      .populate({
        path: 'files',
      })
      .exec()
    res.status(200).send(files)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const deleteFile = async (req, res, next) => {
  const { id } = req.params
  try {
    const files = await File.find()
    const currentFile = files.find(
      (file) => mongoose.Types.ObjectId(file.cardId).toString() === id
    )
    await File.findByIdAndRemove(currentFile)

    const path = currentFile.filePath
    if (path) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }

    res.status(200).send(files)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const dm = decimal || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
  const index = Math.floor(Math.log(bytes) / Math.log(1000))
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]
  )
}

export default router
