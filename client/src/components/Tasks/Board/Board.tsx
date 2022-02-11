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

// import { initialData } from '../../../data';

const Board: React.FC = () => {
  const boardID = '6202bd1aad30336094afc17f'
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
    if (board) {
      setCar(board.cards)
      setBar(board)
      setColumns(board.lists)
    }
  }, [board]);

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
      if (cards && lists && board) {
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
        const newBoard = { ...board }
        const newCards = [...car]
        const [removed] = newCards.splice(source.index, 1)
        newCards.splice(destination.index, 0, removed)

        // const el = newCards.map(li => li.listId)
        if (type === 'card') {
          // console.log(newCards)
          // updateCard({
          //   id: draggableId,
          //   listId: destination.droppableId,
          // })
          setCar(newCards)
          updateBoard({
            id: boardID,
            cards: newCards,
          })
          // setCar(newCards)
          // setBar(newBoard)
        }
      }
    }
  }

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>
  //  const sortedByCreationDate = lists?.slice().sort( (a, b) => (b.index) - (a.index) );
  // console.log(car)
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

