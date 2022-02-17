import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
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

import List from '../List/List'
import TaskButton from '../TaskButton/TaskButton'
import TaskForm from '../TaskForm/TaskForm'
import TaskCard from '../Card/Card';
import { setSourceMapRange } from 'typescript';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

const Board: React.FC = () => {

  const boardId = '620b88e199b7a598ce7b7187'
  const { data, error, isLoading } = useGetBoardQuery(boardId);
  // const { data: lists } = useGetAllTasksQuery();
  // const { data: cards } = useGetAllCardsQuery();
  const [addList] = useAddTaskMutation()
  const [deleteList] = useDeleteTaskMutation()
  const [updateList] = useUpdateTaskMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [listTitle, setListTitle] = useState<string>('');
  const [toggleForm, setToggleForm] = useState<boolean>(false)

  const [board, setBoard] = useState({} as any)
  const [lists, setLists] = useState([] as any)

  const ref = useRef(null)
  const handleClickOutside = () => { setToggleForm(false); setListTitle('') }
  useOnClickOutside(ref, handleClickOutside)

  useEffect(() => {
    if (data) {
      const newBoard = { ...data }
      setBoard(newBoard)
      setLists(newBoard.lists)
    }
  }, [data]);

  const handleToggleTaskForm = () => {
    setToggleForm(form => !form)
  }

  const handleChangeListValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'list') setListTitle(e.target.value)
  }

  const handleAddList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (listTitle.length === 0) return
    addList({
      title: listTitle,
      boardId: boardId,
    })
    updateBoard({
      id: boardId,
    })
    setListTitle('')
    setToggleForm(false)
  }


  if (isEmpty(board)) return <div>no data</div>

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (board) {
      if (type === 'list') {
        let newLists = [...lists]

        const [removed] = newLists.splice(source.index, 1)
        newLists.splice(destination.index, 0, removed)
        // newBoard.listOrder = newList.map(c => c._id)
        // newBoard.columns = newList
        setLists(newLists)
        updateBoard({
          id: boardId,
          lists: newLists
        })
      }

      if (type === 'card' && data) {
        const newLists = [...lists]
        const sourceList = newLists.find((list: { _id: string; }) => list._id === source.droppableId)
        const destinationList = newLists.find((list: { _id: string; }) => list._id === destination.droppableId)

        if (source.droppableId === destination.droppableId) {
          const newCards = [...sourceList.cards]
          const [removed] = newCards.splice(source.index, 1)
          newCards.splice(destination.index, 0, removed)

          const updateCards = {
            ...sourceList,
            cards: newCards
          }
          //replace the contents of the list
          const newState = newLists.map(obj => [updateCards].find(o => o._id === obj._id) || obj);

          setLists(newState)
          updateList({
            id: source.droppableId,
            cards: newCards
          })

        }
        if (source.droppableId !== destination.droppableId) {

          const startCards = [...sourceList.cards]
          const finishCards = [...destinationList.cards]

          const [removed] = startCards.splice(source.index, 1)
          const startState = {
            ...sourceList,
            cards: startCards
          }

          finishCards.splice(destination.index, 0, removed)
          const finishState = {
            ...destinationList,
            cards: finishCards
          }

          //new letters converted to array
          const updateCards = [startState, finishState]

          //replace the contents of the lists
          const newState = newLists.map(obj => updateCards.find(o => o._id === obj._id) || obj);

          setLists(newState)

          // updateCard({
          //   id: draggableId,
          //   listId: destination.droppableId
          // })
          updateList({
            id: source.droppableId,
            cards: startCards
          })
          updateList({
            id: destination.droppableId,
            cards: finishCards
          })
        }
      }
    }
  }

  const handleBlur = () => {

    // setToggleForm(false)
    // setListTitle('')
  }

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}
        style={{
          backgroundImage: `url("https://s1.1zoom.me/big0/590/Germany_Morning_Mountains_Lake_Bavaria_Alps_597796_1280x650.jpg")`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}>
        <Droppable droppableId="all-list" direction="horizontal" type="list">
          {provided => (
            <div className={styles.listContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                lists?.map((list: any, index: number) => (
                  <List
                    index={index}
                    boardId={list.boardId}
                    key={list._id}
                    listId={list._id}
                    title={list.title}
                    cards={list.cards}
                  />
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div >
          {toggleForm ?
            <div className={styles.formContainer} ref={ref}>
              <TaskForm
                id='list'
                handleChange={handleChangeListValue}
                handleSubmit={handleAddList}
                toggleState={() => setToggleForm(false)}
                onBlur={handleBlur}
                title={listTitle}
              />
            </div>
            : <TaskButton id={'list'} onClick={handleToggleTaskForm} />
          }
        </div>
      </div>
    </DragDropContext>

  )
}

export default Board


