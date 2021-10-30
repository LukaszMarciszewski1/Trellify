import express from 'express'
import mongoose from 'mongoose'
import Tasks from '../models/Tasks.js'

const router = express.Router()

export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find()
    res.status(200).json(tasks)
    console.log(tasks)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createTask = async (req, res) => {
  const task = req.body
  const newTask = new Tasks(task)
  try {
    await newTask.save()
    res.status(201).json(newTask)
  } catch (error) {
    res.status(409).json({message: error.message})
  }
}

export const deleteTask = async (req, res) => {
  const id  = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await newTask.deleteOne({ _id: id });
  res.sendStatus(204).json({ message: "Post deleted successfully." });

  // res.json({ message: "Post deleted successfully." });
}

export default router
