import 'dotenv/config'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import List from '../models/List'
import Card from '../models/Card'
import Board from '../models/Board'
import {File} from '../models/File'
import { deleteFileS3 } from '../helpers/filehelper.js'
import {config} from '../config/config'

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await List.find().sort({ timestamp: -1 })
    res.status(200).json(lists)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const getList = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const list = await List.findById(id)
    res.status(200).json(list)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const createList = async (req: Request, res: Response) => {
  const { title, boardId } = req.body
  try {
    const newList = new List({ title, boardId })
    let parentBoard = await Board.findById(boardId)
    parentBoard.lists = [...parentBoard.lists, newList]
    await parentBoard.save()
    await newList.save()
    res.status(201).json(newList)
  } catch (error) {
    res.status(409).json({ error })
  }
}

export const updateList = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No list with id: ${id}`)
  const updateList = await List.findByIdAndUpdate(id, req.body, { new: true })
  res.json(updateList)
}

export const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
   const cards = await Card.find()
   const files = await File.find()
   const listCards = cards.filter(card => new mongoose.Types.ObjectId(card.listId).toString() === id)

  await Card.deleteMany({ listId: id })
  await List.findByIdAndRemove(id)

   const allCardsWithFiles = listCards.map(card => {
     return files.filter(file => new mongoose.Types.ObjectId(file.cardId).toString() === new mongoose.Types.ObjectId(card._id).toString())
   })

   allCardsWithFiles.map(files => files.map(async (file) => {
     const params = {
       Bucket: config.s3.bucket_name,
       Key: file.fileKey,
      }
      deleteFileS3(params)
      await File.deleteMany({ cardId: file.cardId})
    }))

    res.json({ message: 'List deleted successfully.' })
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const deleteAllCardsOfList = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await Card.deleteMany({ listId: id })
    res.json({ message: 'Cards deleted successfully.' })
  } catch (error) {
    res.status(404).json({ error })
  }
}
