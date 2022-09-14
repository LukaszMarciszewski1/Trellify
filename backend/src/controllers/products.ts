import 'dotenv/config'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product'
import {config} from '../config/config'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ user: req.user?._id }).sort({ timestamp: -1 })
    res.status(200).json(products)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    res.status(200).json(product)
  } catch (error) {
    res.status(404).json({ error })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const { name, quantity, unit, price } = req.body
  const userId = (req as any).user._id
  try {
    const newProduct = await new Product({
      name,
      quantity,
      unit,
      price,
      user: req.user?._id
    }).save()
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(409).json({ error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No apiary with id: ${id}`)
    }
    await Product.findByIdAndRemove(id);
    return res.json({ message: "Apiary deleted successfully." })
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { apiaryName, apiaryNumber } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No apiary with id: ${id}`)
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true})
    return res.json(product);
}