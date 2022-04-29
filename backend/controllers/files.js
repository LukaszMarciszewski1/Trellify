import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import File from '../models/File.js'
import fs from 'fs'
import dotenv from 'dotenv'
import { deleteFileS3 } from '../helpers/filehelper.js'
dotenv.config()
const router = express.Router()

export const uploadFiles = async (req, res, next) => {
  const { cardId } = req.body
  try {
    let parentCard = await Card.findById(cardId)
    req.files.map(async (element) => {
      const file = new File({
        cardId: cardId,
        fileUrl: element.location,
        fileName: element.originalname,
        fileType: element.mimetype,
        fileKey: element.key,
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
      // .populate({
      //   path: 'files',
      // })
      // .exec()
    res.status(200).send(files)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const downloadFiles = async (req, res, next) => {
  const { id } = req.params
  try {
    const files = await File.find()
    const currentFile = files.find(
      (file) => mongoose.Types.ObjectId(file.cardId).toString() === id
    )
    await File.findByIdAndRemove(currentFile)
    console.log(currentFile)

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
      (file) => mongoose.Types.ObjectId(file._id).toString() === id
    )
    await File.findByIdAndRemove(id)
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: currentFile.fileKey,
    }
    deleteFileS3(params)
    
    res.status(200).send('Files Delete Successfully')
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
