import express from 'express'
import mongoose from 'mongoose'
import Tasks from '../models/Tasks.js'

const router = express.Router()

export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find()
    res.status(200).json(tasks)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getTask = async (req, res) => {
  const { id } = req.params;
  try{
    const task = await Tasks.findById(id)
    res.status(200).json(task)
  } catch (error){
    res.status(404).json({message: error.message})
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
  const {id}  = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);

  await Tasks.findByIdAndRemove(id)
  res.json({ message: "Task deleted successfully." });
}

export const updateTask = async (req, res) => {
  const {id} = req.params
  const task = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);
  const updateTask = await Tasks.findByIdAndUpdate(id, req.body, {new: true})

  res.json(updateTask)
}

export const completedTask = async (req, res) => {
  const {id} = req.params
  const task = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No task with id: ${id}`);

  // const task = await Tasks.findById(id)
  const updateTask = await Tasks.findByIdAndUpdate(id, req.body, {new: true})
  res.json(updateTask);
  // try {
  //   const task = await Tasks.findById(id)
  //   const updateTask = await Tasks.findByIdAndUpdate(id, {completed: task.completed + 1}, {new: true})
  //   res.json(updateTask);
  // } catch (error) {
  //   res.status(409).json({message: error.message})
  // }
}

export default router
