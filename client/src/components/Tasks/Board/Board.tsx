import React, { useEffect, useState, useCallback } from 'react'
import { isEmpty, cloneDeep } from 'lodash'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, Draggable, DropResult, resetServerContext } from 'react-beautiful-dnd'
import { renderToString } from 'react-dom/server';
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
import { setSourceMapRange } from 'typescript';

// import { initialData } from '../../../data';

const Board: React.FC = () => {
  const boardID = '6207b30f895b88b2e00473a8'
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


  const [car, setCar] = useState([])
  const [bar, setBar] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    if (board && lists && cards) {
      setBar(board)
      setColumns(board.lists)
      const newList = board.lists.map((list: any) => list.cards).flat(1)
      // lists.map(list => setCar(list.cards))
      setCar(newList)
    }
  }, [board]);
console.log(lists)
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
      if (type === 'list') {
        let newBoard = { ...board }
        // newBoard.listOrder = lists?.map(c => c._id === boardID)
        let newList = [...columns]

        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        setColumns(newList)
        updateBoard({
          id: boardID,
          lists: newList,
        })
      }
      if (cards && lists && columns) {
        if (type === 'card') {
          let newCards = [...car]
          let newBoard = { ...board }

          const [removed] = newCards.splice(source.index, 1)
          newCards.splice(destination.index, 0, removed)
 
          console.log(newCards)
          // const el = columns.find(li => li._id)
          setCar(newCards)
          // updateCard({
          //   id: draggableId,
          //   listId: destination.droppableId,
          // })
          updateList({
            id: destination.droppableId,
            cards: newCards
          })
          console.log(result)
          // updateBoard({
          //   id: boardID,
          //   cards: newCards,
          // })
          // setCar(newCards)
          // setBar(newBoard)
        }
      }
    }
  }

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
                  columns?.map((list: any, index: number) => (
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
                        car?.map((card: { listId: string; _id: string; title: string }, index: number) => (
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

