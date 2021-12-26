import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'

const router = express.Router()

export const getLists = async (req, res) => {
  try {
    const lists = await List.find()
    res.status(200).json(lists)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getList = async (req, res) => {
  const { id } = req.params;
  try{
    const list = await List.findById(id)
    res.status(200).json(list)
  } catch (error){
    res.status(404).json({message: error.message})
  }
}

export const createList = async (req, res) => {
  const list = req.body
  const newList = new List(list)
  try {
    await newList.save()
    res.status(201).json(newList)
  } catch (error) {
    res.status(409).json({message: error.message})
  }
}

export const deleteList = async (req, res) => {
const {id}  = req.params;
try {
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  await List.findByIdAndRemove(id)
  const cards = await Card.find({listId: id})
  cards.forEach(async card => (
    await Card.deleteOne({id: card.id})
  ))
  res.json({ message: "List deleted successfully." });

} catch(error){
  res.status(404).json({message: error.message})
}
}

export const updateList = async (req, res) => {
  const {id} = req.params
  const list = req.body
  console.log(list)
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  const updateList = await List.findByIdAndUpdate(id, req.body, {new: true})

  res.json(updateList)
}

export const addCard = async (req, res) => {
  const {id} = req.params
  const card = req.body
  const newCard = new Card(card)
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
  // const addCard = await Tasks.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
    await List.findByIdAndUpdate(id ,{ $push: { "cards": {newCard} } })
    res.status(201).json(newCard)
  } catch (error) {
    res.status(409).json({message: error.message})
  }
}

export const getCards = async (req, res) => {
  // const { id } = req.params;
  // try{
  //   const task = await Tasks.findById(id)
  //   res.status(200).json(task)
  // } catch (error){
  //   res.status(404).json({message: error.message})
  // }
  try {
    const card = await Card.find()
    res.status(200).json(card)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export default router


// const {id}  = req.params;
// try {
//   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
//   const list = await Tasks.findByIdAndRemove(id)
//   if(!list) return res.status(405).send()
//   const cards = await Card.find({listId: id})
//   cards.forEach(async card => (
//     await Card.deleteOne({id: card.id})
//   ))
//   res.json({ message: "Task deleted successfully." });

// } catch(error){
//   res.status(404).json({message: error.message})
// }
