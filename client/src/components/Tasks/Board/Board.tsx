import React, { useEffect, useState, useRef } from 'react'
// import { isEmpty, cloneDeep } from 'lodash'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
// import { renderToString } from 'react-dom/server';
import {
  // useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  // useGetAllTasksQuery,
  useAddTaskMutation,
  // useDeleteTaskMutation,
  useUpdateTaskMutation,
  // useGetTaskQuery,
  // useGetCardsQuery,
} from "../../../store/reducers/listsReducer";
import {
  // useGetAllCardsQuery,
  // useAddCardMutation,
  // useDeleteCardMutation,
  useUpdateCardMutation,
  // useDeleteAllMutation,
} from "../../../store/reducers/cardsReducer";

import BoardHeader from '../BoardHeader/BoardHeader';
import List from '../List/List'
import TaskButton from '../TaskButton/TaskButton'
import TaskForm from '../TaskForm/TaskForm'
// import TaskCard from '../Card/Card';
import SideMenu from '../SideMenu/SideMenu';
// import CardDetails from '../CardDetails/CardDetails';
// import CardModal from '../CardDetails/CardModal/CardModal';

import { defaultBackground } from '../localData';

// import { setSourceMapRange } from 'typescript';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
// import { v4 as uuidv4 } from 'uuid';

// import { GrAdd } from "react-icons/gr";
import { GoPlus } from "react-icons/go";
// import { BsCardImage } from "react-icons/bs";

const Board: React.FC = () => {
  const boardId = '624f02f011fa05ce01907c07'
  const { data, error, isLoading } = useGetBoardQuery(boardId);

  const [addList] = useAddTaskMutation()
  // const [deleteList] = useDeleteTaskMutation()
  const [updateList] = useUpdateTaskMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const formRef = useRef(null)
  // const refCardModal = useRef(null)

  const [backgroundUrl, setBackgroundUrl] = useState<string>('')
  const [listTitle, setListTitle] = useState<string>('');
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false)

  const [board, setBoard] = useState({} as any)
  const [lists, setLists] = useState([] as any)

  const closeForm = () => { setOpenForm(false); setListTitle('') }
  useOnClickOutside(formRef, closeForm)

  useEffect(() => {
    if (data) {
      const newBoard = { ...data }
      const boardBG = newBoard.background === '' ? defaultBackground : newBoard.background
      setBoard(newBoard)
      setLists(newBoard.lists)
      setBackgroundUrl(boardBG)
    }
  }, [data]);


  const handleChangeListTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
    setOpenForm(false)
  }

  // if (isEmpty(board)) return <div>no data</div>
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newLists = [...lists]

    if (board) {
      if (type === 'list') {

        const [removed] = newLists.splice(source.index, 1)
        newLists.splice(destination.index, 0, removed)

        setLists(newLists)
        updateBoard({
          id: boardId,
          lists: newLists
        })
      }

      if (type === 'card') {
        // const newLists = [...lists]
        const sourceList = newLists.find((list: { _id: string; }) => list._id === source.droppableId)
        const destinationList = newLists.find((list: { _id: string; }) => list._id === destination.droppableId)

        if (source.droppableId === destination.droppableId) {
          const newCards = [...sourceList.cards]

          const [removed] = newCards.splice(source.index, 1)
          newCards.splice(destination.index, 0, removed)

          const updateState = {
            ...sourceList,
            cards: newCards
          }

          //replace the contents of the list
          const newState = newLists.map(obj => [updateState].find(o => o._id === obj._id) || obj);

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

          //converted to array
          const newCards = [startState, finishState]

          //replace the contents of the lists
          const newState = newLists.map(obj => newCards.find(o => o._id === obj._id) || obj);

          setLists(newState)

          updateCard({
            id: draggableId,
            listId: destination.droppableId
          })
          // update source list
          updateList({
            id: source.droppableId,
            cards: startCards
          })
          //update destination list
          updateList({
            id: destination.droppableId,
            cards: finishCards
          })
        }
      }
    }
  }

  const boardBackgroundStyle = {
    backgroundColor: backgroundUrl,
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>Brak połączenia</h2>

  return (
    <div className={styles.board}
      style={boardBackgroundStyle}
    >
      <BoardHeader
        name={'Zmień tło'}
        onClick={() => setOpenSideMenu(true)}
      />
      {
        openSideMenu ?
          <SideMenu
            boardId={boardId}
            setBackgroundUrl={setBackgroundUrl}
            closeMenu={() => setOpenSideMenu(false)}
          /> : null
      }
      <DragDropContext onDragEnd={onDragEnd} >
        <div className={styles.container}>
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
          <div className={styles.actionsForm}>
            {openForm ?
              <div className={styles.formContainer} ref={formRef}>
                <TaskForm
                  id='list'
                  handleChange={handleChangeListTitle}
                  handleSubmit={handleAddList}
                  closeForm={() => { setOpenForm(false); setListTitle('') }}
                  value={listTitle}
                  titleBtn={'Dodaj Listę'}
                />
              </div>
              : <TaskButton onClick={() => setOpenForm(true)} name={'Dodaj listę zadań'} icon={<GoPlus style={{ margin: '.3rem 0' }} />} />
            }
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default Board


