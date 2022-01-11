import express from 'express'
import mongoose from 'mongoose'
import List from '../models/List.js'
import Card from '../models/Card.js'
import Board from '../models/Board.js'

const router = express.Router()
// .sort({sortIndex:0})
export const getLists = async (req, res) => {
  try {
    const lists = await List.find()
    let parentBoard = await Board.find().populate({
      path: 'lists',
    })
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
  const {title, boardId} = req.body
  // const boardId = '61dddb69911985a8b66dbefe'
  const newList = new List({title, boardId})
  let parentBoard = await Board.findById(boardId).populate({
    path: 'lists',
  })
  try {
    parentBoard.lists = [...parentBoard.lists, newList]
    await parentBoard.save()
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
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
  const updateList = await List.findByIdAndUpdate(id, req.body, {new: true})
  res.json(updateList)
}

export const getUpdateList = async (req, res) => {
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
      return { id: l._id, sortIndex: index + 1 };
    });

    //TODO: Multi update implementation rather than separate queries
    orderedLists.forEach(async (l) => {
      await lists.update(l.id, {
        sortIndex: l.sortIndex,
      });
    });


    res.status(200).json(newEl)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
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

export default router
