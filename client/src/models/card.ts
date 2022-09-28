import { Labels } from './labels'
import { Product } from './product'

interface UsedProducts extends Product {
  used: number
}
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
  usedMaterials?: Product[]
  labels: Labels[]
}
