import Board from '../models/Board.js'
const errorCatch = (err) => console.log("error in create-data-service", err);
const createBoard = async (boardTitle, userId) => {
  const newBoard = await new Board({
    boardTitle,
    lists: [],
    user: [userId]
  }).save().catch(errorCatch)
}
