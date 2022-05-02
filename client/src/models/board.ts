import { List } from './list'

export interface Board {
  _id: string
  title: string
  background: string
  lists: List[]
  labels: {}[]
}