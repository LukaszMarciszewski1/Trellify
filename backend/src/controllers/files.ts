import 'dotenv/config'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card'
import { File } from '../models/File'
import { deleteFileS3, downloadFileS3 } from '../helpers/filehelper.js'
import { config } from '../config/config'

export const uploadFiles = async (req: Request, res: Response) => {
  const { cardId } = req.body
  try {
    let parentCard = await Card.findById(cardId)
    const files = (req as any).files
    files.map(
      async (element: {
        location: string
        originalname: string
        mimetype: string
        key: string
        size: number
      }) => {
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
      }
    )
    await parentCard.save()
    res.status(201).send('Files Uploaded Successfully')
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const getFiles = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    let files = await Card.findById(id)
    res.status(200).send(files)
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const files = await File.find()
    const currentFile = files.find(
      (file) => new mongoose.Types.ObjectId(file._id).toString() === id
    )
    await File.findByIdAndRemove(id)
    const params = {
      Bucket: config.s3.bucket_name,
      Key: currentFile?.fileKey,
    }
    deleteFileS3(params)

    res.status(200).send('Files Delete Successfully')
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const downloadFile = async (req: Request, res: Response) => {
  const { id, fileUrl } = req.params
  try {
    const files = await File.find()
    const currentFile = files.find(
      (file) => new mongoose.Types.ObjectId(file._id).toString() === id
    )
    const params = {
      Bucket: config.s3.bucket_name,
      Key: currentFile?.fileKey,
    }
    downloadFileS3(params)
    console.log(`to jest param: ${fileUrl}`)

    res.status(200).send('File Download Successfully')
  } catch (error) {
    res.status(400).json({ error })
  }
}

const fileSizeFormatter = (bytes: number, decimal: number) => {
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
