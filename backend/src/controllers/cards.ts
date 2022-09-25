import 'dotenv/config'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card'
import { File } from '../models/File'
import List from '../models/List'
import { deleteFileS3 } from '../helpers/filehelper.js'

export const getCards = async (req: Request, res: Response) => {
  try {
    const card = await Card.find().sort({ timestamp: -1 })
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const getCard = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const card = await Card.findById(id)
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const createCard = async (req: Request, res: Response) => {
  const { listId } = req.body
  const newCard = new Card(req.body)
  let parentList = await List.findById(listId)
  try {
    parentList.cards = [...parentList.cards, newCard]
    await parentList.save()
    await newCard.save()
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({ error })
  }
}

export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No card with id: ${id}`)
  const updateCard = await Card.findByIdAndUpdate(id, req.body, { new: true })
  res.json(updateCard)
}

export const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params
  const files = await File.find()
  const cardFiles = files.filter(
    (file) => new mongoose.Types.ObjectId(file.cardId).toString() === id
  )
  try {
    cardFiles.map((file) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.fileKey,
      }
      deleteFileS3(params)
    })
    await Card.findByIdAndRemove(id)
    await File.deleteMany({ cardId: id })
    res.json({ message: 'Card deleted successfully.' })
  } catch (error) {
    res.status(404).json({ error })
  }
}
