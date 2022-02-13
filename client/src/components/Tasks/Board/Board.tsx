import React, { useEffect, useState, useCallback, useMemo, } from 'react'
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
  useAddCardMutation,
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
  const boardID = '6208d6bf1bb693481233f6fb'
  const { data: board, error, isLoading } = useGetBoardQuery(boardID);
  const { data: lists } = useGetAllTasksQuery();
  const { data: cards } = useGetAllCardsQuery();

  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateList] = useUpdateTaskMutation()
  const [updateCard] = useUpdateCardMutation()
  const [addCard] = useAddCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [listTitle, setListTitle] = useState<string>('');
  const [toogleForm, setToogleForm] = useState<boolean>(false)
  // const [taskValue, setTaskValue] = useState<string>('')


  const [car, setCar] = useState([] as any)
  const [bar, setBar] = useState({} as any)
  const [columns, setColumns] = useState([] as any)
  const [activeColumn, setActiveColumn] = useState({} as any)

  useEffect(() => {
    if (board) {
      setBar(board)
      setColumns(board.lists)
      const newList = board.lists.map((list: any) => list.cards).flat(1)
      // setActiveColumn(board.lists[0].cards)
      // lists.map(list => setCar(list.cards))
      // setCar(newList)
      setCar(board.cards)
      setCar(newList)
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
        lists: columns,
      })
      setListTitle('')
    }
  }


  // if (isEmpty(board)) return <div>no data</div>

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (board && lists) {
      if (type === 'list') {
        // newBoard.listOrder = lists?.map(c => c._id === boardID)
        let newList = [...columns]
        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        updateBoard({
          id: boardID,
          lists: newList,
        })
        setColumns(newList)
      }

      if (type === 'card') {
        let newColumns = [...columns]
        if (source.droppableId === destination.droppableId) {
          const currentColumn = newColumns.find((list: { _id: string; }) => list._id === source.droppableId)
          const column = [...currentColumn.cards]

          console.log(currentColumn._id)
          const [removed] = column.splice(source.index, 1)
          column.splice(destination.index, 0, removed)

          setCar(column)
          updateList({
            id: currentColumn._id,
            cards: column
          })
          updateBoard({
            id: boardID,
          })
        }
        if (source.droppableId !== destination.droppableId) {
          const startColumn = newColumns.find((list: { _id: string; }) => list._id === source.droppableId)
          const endColumn = newColumns.find((list: { _id: string; }) => list._id === destination.droppableId)
          const newStartColumn = [...startColumn.cards]
          const newEndColumn = [...endColumn.cards]
          const currentCard = newStartColumn.find(card => card._id === draggableId)

          const [removed] = newStartColumn.splice(source.index, 1)
          // setCar(newStartColumn)
          deleteCard(draggableId)
          newEndColumn.splice(destination.index, 0, removed)
          // setCar(newEndColumn)
          addCard({
            title: currentCard.title,
            listId: endColumn._id
          })
          
          updateBoard({
            id: boardID,
            lists: columns
          })
          // updateCard({
          //   id: draggableId,
          //   listId: endColumn._id,
          // })

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
                      cards={car}
                      onClickDelete={() => {
                        deleteTask(list._id)
                      }}
                    >
                      {/* {
                        list.cards?.map((card: { listId: string; _id: string; title: string }, index: number) => (
                          card.listId === list._id ? (
                            <TaskCard index={index} key={card._id} id={card._id} title={card.title} listId={list._id} onClickDelete={() => deleteCard(card._id)} />) : null
                        ))
                      } */}
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

