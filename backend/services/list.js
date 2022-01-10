import List from "../models/List"
const errorCatch = (err) => console.log("error in create-data-service", err);

const createList = async (listTitle, boardId) => {
  console.log("createList", listTitle, boardId);
  const newList = await new List({listTitle}).save().catch(errorCatch);
  let parentBoard = await models.Board.findById(boardId).catch(errorCatch);
  parentBoard.lists = [...parentBoard.lists, newList._id];
  await parentBoard.save().catch(errorCatch);
  return newList;
}