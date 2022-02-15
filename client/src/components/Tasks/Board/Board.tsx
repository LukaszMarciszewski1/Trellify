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

const store = {
  _id: "620b88e199b7a598ce7b7187",
  user: [],
  createdAt: "2022-02-15T10:35:24.286Z",
  listOrder: [
    "620b8a1d99b7a598ce7b719b",
    "620b8c4c99b7a598ce7b71b8"
  ],
  lists: [
    {
      _id: "620b8a1d99b7a598ce7b719b",
      title: "1",
      boardId: "620b88e199b7a598ce7b7187",
      cards: [
        {
          _id: "620b927799b7a598ce7b71f8",
          title: "2",
          listId: "620b8a1d99b7a598ce7b719b",
          boardId: "620b88e199b7a598ce7b7187",
          completed: 0,
          createdAt: "2022-02-15T10:35:24.281Z",
          updateDate: null,
          updatedAt: "2022-02-15T10:35:24.281Z",
        },
        {
          _id: "620b92fa99b7a598ce7b7214",
          title: "1",
          listId: "620b8a1d99b7a598ce7b719b",
          boardId: "620b88e199b7a598ce7b7187",
          completed: 0,
          createdAt: "2022-02-15T10:35:24.281Z",
          updateDate: null,
          updatedAt: "2022-02-15T10:35:24.281Z",
        }
      ],
      createdAt: "2022-02-15T10:35:24.264Z",
      updateddAt: null,
      updatedAt: "2022-02-15T10:35:24.264Z",
    },
    {
      _id: "620b8c4c99b7a598ce7b71b8",
      title: "2",
      boardId: "620b88e199b7a598ce7b7187",
      cards: [],
      createdAt: "2022-02-15T10:35:24.264Z",
      updateddAt: null,
      updatedAt: "2022-02-15T10:35:24.264Z",
    }
  ],
  cards: [],
}

const Board: React.FC = () => {
  const boardID = '620b88e199b7a598ce7b7187'
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
  const [activeCard, setActiveCard] = useState({})

  const [data, setData] = useState(store)

  useEffect(() => {
    if (board && lists) {
      const newBoard = { ...board }
      setBar(newBoard)
      setColumns(newBoard.lists)
      const newList = board.lists.map((list: any) => list.cards).flat(1)
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
        let newBoard = { ...bar }
        let newList = [...columns]

        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        newBoard.listOrder = newList.map(c => c._id)
        newBoard.columns = newList

        setColumns(newList)
        setBar(newBoard)
      }

      if (type === 'card' && data) {
        // let newColumns = [...columns]
        let newList = [...columns]
        const dataBar = { ...bar }

        const sourceColumn = dataBar.lists.find((list: { _id: string; }) => list._id === source.droppableId)
        const destinationColumn = dataBar.lists.find((list: { _id: string; }) => list._id === destination.droppableId)

        const start = newList.find(c => c._id === source.droppableId)
        const finish = newList.find(c => c._id === destination.droppableId)

        const startCards = [...start.cards]
        const finishCards = [...finish.cards]

        const [removed] = startCards.splice(source.index, 1)
        const newStart = {
          ...start,
          cards: startCards
        }
        finishCards.splice(destination.index, 0, removed)
        const newFinish = {
          ...finish,
          cards: finishCards
        }
        const updateDate = [newStart, newFinish]

        const newDate = newList.map(obj => updateDate.find(o => o._id === obj._id) || obj);

        setColumns(newDate)
        console.log(startCards)

        updateList({
          id: source.droppableId,
          cards: startCards
        })
        updateList({
          id: destination.droppableId,
          cards: finishCards
        })


        if (source.droppableId === destination.droppableId) {

          // const newCards = [...car]
          // const startColumn = [...sourceColumn.cards]
          // const finishColumn = [...destinationColumn.cards]

          // const currentCard = sourceColumn.cards.find((card: { _id: string; }) => card._id === draggableId)

          // const [removed] = startColumn.splice(source.index, 1)
          // finishColumn.splice(destination.index, 0, removed)

        }
        if (source.droppableId !== destination.droppableId) {
          // const newCards = [...car]
          // const startColumn = newCards.find((card: { listId: string; }) => card.listId === source.droppableId)
          // const endColumn = newCards.find((card: { listId: string; }) => card.listId === destination.droppableId)
          // const start = columns.find((list: { _id: string; }) => list._id === source.droppableId)
          // const finish = columns.find((list: { _id: string; }) => list._id === destination.droppableId)

          // let currentCard = newCards.find((card: { _id: string; }) => card._id === draggableId)
          // const [removed] = newCards.splice(source.index, 1)
          // newCards.splice(destination.index, 0, removed)

          // const newState = {
          //   ...board,
          //   cards: newCards
          // }
          // setCar(newCards)
          // setBar(newState)
          // updateList({
          //   cards: newCards
          // })
        }
      }
    }
  }
  const show = () => {

    data.listOrder.map((listId: any, index: any) => {
      const list = data.lists[listId];
      // return <div list={list} key={listId} index={index} />;
    })
  }

  show()

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
                      cards={list.cards}
                      onClickDelete={() => {
                        deleteTask(list._id)
                      }}
                    />
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

