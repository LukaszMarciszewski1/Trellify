import { List } from './list'
import { Labels } from './labels'
export interface Board {
  _id: string
  background: string
  lists: List[]
  labels?: Labels[]
}
