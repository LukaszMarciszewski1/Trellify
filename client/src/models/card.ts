export interface Card {
  _id: string
  boardId: string
  cover: string
  listId: string
  title: string
  description: string
  deadline: Date | null
  completed: boolean
  createdAt: Date
  updateDate: Date
  files: {}[]
  labels: {}[]
}