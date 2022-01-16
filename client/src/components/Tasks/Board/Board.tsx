import React, { useEffect, useState, useCallback } from 'react'
import { isEmpty, cloneDeep } from 'lodash'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/api/boardsReducer'
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetTaskQuery,
  useGetCardsQuery,
} from "../../../store/api/listsReducer";
import {
  useGetAllCardsQuery,
  // useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useDeleteAllMutation,
} from "../../../store/api/cardsReducer";

import TasksList from '../TasksList/TasksList'
import TaskButton from '../TaskButton/TaskButton'
import TaskForm from '../TaskForm/TaskForm'
import TaskCard from '../TaskCard/TaskCard';

// import { initialData } from '../../../data';

const Board: React.FC = () => {
  const boardID = '61e458c95b6b39b805ae2dcd'
  const { data: board, error, isLoading } = useGetBoardQuery(boardID);
  const { data: lists } = useGetAllTasksQuery();
  const { data: cards } = useGetAllCardsQuery();

  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateList] = useUpdateTaskMutation()
  const [updateCard] = useUpdateCardMutation()

  const [updateBoard] = useUpdateBoardMutation()

  const [listTitle, setListTitle] = useState<string>('');
  const [toogleForm, setToogleForm] = useState<boolean>(false)
  // const [taskValue, setTaskValue] = useState<string>('')

  const handleToogleTaskForm = () => {
    setToogleForm(form => !form)
  }

  const handleChangeTaskValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'task-title') setListTitle(e.target.value)
  }

  const handleSubmitTaskForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (lists === undefined) return
    if (listTitle.length > 0) {
      addTask({
        title: listTitle,
        boardId: boardID,
      })
      updateBoard({
        id: boardID,
        lists: lists,
      })
      setListTitle('')
    }
  }


  if (isEmpty(board)) return <div>no data</div>
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (board && lists) {
      let newBoard = { ...board }
      newBoard.listOrder = lists?.map(c => c._id === boardID)
      let newList = [...board.lists]

      const [removed] = newList.splice(source.index, 1)
      newList.splice(destination.index, 0, removed)

      if (type === 'list') {
        updateBoard({
          id: boardID,
          lists: newList,
        })
      }
      if (cards && lists) {
        // const newCards = [...board.lists]
        const sourcetList = lists.find(l => l._id === source.droppableId)
        const destinationtList = lists.find(l => l._id === destination.droppableId)
        // const currentCards = [...currentList.cards]

        // const [removed] = currentCards.splice(source.index, 1)
        // currentCards.splice(destination.index, 0, removed)

        // console.log(currentCards)

        // const currentCards = [...currentList.cards]
        // console.log(sourcetList)
        // const newCards = newList.find(list => list._id)

        const currentCards = [...board.cards]

        const [removed] = currentCards.splice(source.index, 1)
        currentCards.splice(destination.index, 0, removed)

        if (type === 'card') {
          console.log(source.droppableId)
          updateCard({
            id: draggableId,
            listId: destination.droppableId,
          })
          updateBoard({
            id: boardID,
            cards: currentCards,
          })
          // updateList({
          //   id: source.droppableId,
          //   cards: currentCards,
          // })

          // if (destination.droppableId === source.droppableId) {
          // }
          // if (destination.droppableId !== source.droppableId) {

          // }
          // else {
          // }
        }
      }
    }
  }
  console.log(board.lists)
  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>
  //  const sortedByCreationDate = lists?.slice().sort( (a, b) => (b.index) - (a.index) );
  return (
    <div>
      {/* <h2>{board.title}</h2> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.container}>
          <Droppable droppableId="all-list" direction="horizontal" type="list">
            {provided => (
              <div className={styles.listContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  board.lists?.map((list: any, index: number) => (
                    <TasksList
                      index={index}
                      boardId={list.boardId}
                      key={list._id}
                      id={list._id}
                      title={list.title}
                      onClickDelete={() => {
                        deleteTask(list._id)
                      }}
                    >
                      {
                        board.cards?.map((card: { listId: string; _id: string; title: string }, index: number) => (
                          card.listId === list._id ? (
                            <TaskCard index={index} key={card._id} id={card._id} title={card.title} listId={list._id} onClickDelete={() => deleteCard(card._id)} />) : null
                        ))
                      }
                    </TasksList>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div>
            {toogleForm ?
              <TaskForm
                handleChange={handleChangeTaskValue}
                handleSubmit={handleSubmitTaskForm}
                titleValue={listTitle}
                placeholder={'dodaj listę zadań'}
              />
              : null}
            <TaskButton onClick={handleToogleTaskForm} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default Board

