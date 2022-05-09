import { List } from './list'
import { Labels } from './labels'

export interface Board {
  _id: string
  title: string
  background: string
  lists: List[]
  labels: Labels[]
}