import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import Tasks from '../models/Tasks.js'

const router = express.Router()

export const getCards = async (req, res) => {
  try {
    const card = await Card.find()
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getCard = async (req, res) => {
  const { id } = req.params;
  try{
    const card = await Card.findById(id)
    res.status(200).json(card)
  } catch (error){
    res.status(404).json({message: error.message})
  }
}

export const createCard = async (req, res) => {
  // const {id} = req.params
  const card = req.body
  const newCard = new Card(card)
  try {
    await newCard.save()
    // await Tasks.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({message: error.message})
  }

  // const {id} = req.params
  // const card = req.body
  // const newCard = new Card(card)
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
  // const addCard = await Tasks.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
}

export const updateCard = async (req, res) => {
  const {id} = req.params
  const card = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No card with id: ${id}`);
  const updateCard = await Card.findByIdAndUpdate(id, req.body, {new: true})
  
  res.json(updateCard)
}

export const deleteCard = async (req, res) => {
  const {id}  = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No card with id: ${id}`);

  await Card.findByIdAndRemove(id)
  res.json({ message: "Card deleted successfully." });
}

export const deleteAllCardsOfList = async (req, res) => {
    await Card.remove({})
    res.status(201).json("Card deleted successfully.")
}

export default router