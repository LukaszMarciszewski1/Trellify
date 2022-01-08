import express from 'express'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import List from '../models/List.js'

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
  try {
  const listId = req.body.listId
  const list = await List.findOne({_id: listId})
  if(!list) return res.status(404).send()
  const newCard = new Card(req.body)
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

export const updateList = async (req, res) => {
  const {id} = req.params
  const list = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  const updateList = await List.findByIdAndUpdate(id, req.body, {new: true})
  res.json(updateList)
}

export const getUpdateCards = async (req, res) => {
  const { id, index, sourceIndex, destinationIndex } = req.params;
       // const newItems = [...items];
      // const [removed] = newItems.splice(source.index, 1);
      // newItems.splice(destination.index, 0, removed);
      // setItems(newItems)
  // const list = await List.get(id);
  try {
    const lists = await List.find()
    const updateList = await List.findById(id)
    // const newLists = [...lists]
    const newEl = [...lists]
    const [list] = newEl.splice(sourceIndex, 1)
    newEl.splice(destinationIndex, 0, list)

    const orderedLists = lists.map((l, index) => {
      return { id: l._id, sortOrder: index + 1 };
    });

    //TODO: Multi update implementation rather than separate queries
    orderedLists.forEach(async (l) => {
      await listService.update(l.id, {
        sortOrder: l.sortOrder,
      });
    });


    res.status(200).json(newEl)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export default router