import { Labels } from './labels'
export interface Card {
  _id: string
  createdAt: string | number | Date
  boardId: string
  listId?: string
  title: string
  description: string
  deadline: Date | null
  cover: string
  completed: boolean
  nameList: string
  files: any
  labels: Labels[]
}

