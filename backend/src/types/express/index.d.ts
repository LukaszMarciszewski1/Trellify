import express from "express";
import { IFile } from '../models/File';

declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>,
      files?: Express.MulterS3.File,
    }
  }
}