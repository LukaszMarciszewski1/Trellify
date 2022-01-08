import Board from '../models/Board.js'

export default class BoardService {
  constructor() {}
  async getBoards(data) {
    const boards = await Board.find(data)
    return boards
  }

  async getBoardById(id) {
    const board = await Board.findById(id).exec()
    return board
  }

  async createBoard(data) {
    const board = await Board.create(data)
    return board
  }

  async updateBoard(id, data) {
    const board = await Board.findByIdAndUpdate(id, data)
    return await board.save()
  }

  async deleteBoard(id) {
    const board = await Board.findByIdAndDelete(id)
    return board
  }
}
