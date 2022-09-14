import * as express from "express"
import mongoose, { Schema } from 'mongoose'
import { IFile } from '../models/File';
export {};
declare global {
  namespace Express {
    interface Request {
      user?: Record<Schema.Types.ObjectId>,
    }
  }
}