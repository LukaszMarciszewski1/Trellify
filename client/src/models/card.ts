import { Labels } from './labels'
export interface Card {
  _id: string
  // cardId: string
  boardId: string
  listId?: string
  title: string
  description: string
  deadline: Date | null
  cover: string
  completed: boolean
  createdAt?: Date
  updateDate?: Date
  nameList: string
  files: any
  labels: Labels[]
}
