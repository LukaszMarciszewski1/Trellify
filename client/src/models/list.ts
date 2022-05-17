import { Card } from './card' 
export interface List {
  _id: string
  boardId: string
  title: string
  cards: Card[]
}