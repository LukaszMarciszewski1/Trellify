import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.scss'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import {useGetBoardQuery, useUpdateBoardMutation} from '../../../store/api/boards'
import {useAddListMutation, useUpdateListMutation} from "../../../store/api/lists";
import {useUpdateCardMutation} from "../../../store/api/cards";
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { GoPlus } from "react-icons/go";
import { defaultBackground } from '../localData';
import { Board as BoardResponse } from '../../../models/board'
import { List as ListResponse } from '../../../models/list'
import BoardHeader from '../BoardHeader/BoardHeader';
import List from '../List/List'
import TaskButton from '../TaskButton/TaskButton'
import TaskForm from '../TaskForm/TaskForm'
import SideMenu from '../SideMenu/SideMenu';
import { useParams } from 'react-router-dom';

const Board: React.FC = () => {
  const boardId = '624f02f011fa05ce01907c07'
  const {_id} = useParams()
  console.log(_id)
  const { data: boardApi, error, isLoading } = useGetBoardQuery(boardId);
  const [addList] = useAddListMutation()
  const [updateList] = useUpdateListMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [listTitle, setListTitle] = useState('');
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false)
  const [board, setBoard] = useState<BoardResponse>({} as BoardResponse)
  const [lists, setLists] = useState<ListResponse[]>([] as ListResponse[])
  const formRef = useRef(null)
  
  const closeForm = () => { setIsOpenForm(false); setListTitle('') }
  useOnClickOutside(formRef, closeForm)

  useEffect(() => {
    if (boardApi) {
      const boardBG = boardApi.background === '' ? defaultBackground : boardApi.background
      setBoard(boardApi)
      setLists(boardApi.lists)
      setBackgroundUrl(boardBG)
    }
  }, [boardApi])

  const handleChangeListTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
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
      _id: boardId,
    })
    setListTitle('')
    setIsOpenForm(false)
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type, draggableId } = result
    const newLists = [...lists]
    if (!board) return
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'list') {
      const [removed] = newLists.splice(source.index, 1)
      newLists.splice(destination.index, 0, removed)

      setLists(newLists)
      updateBoard({
        _id: boardId,
        lists: newLists
      })
    }

    if (type === 'card') {
      const sourceList = newLists.find((list: { _id: string }) => list._id === source.droppableId)
      const destinationList = newLists.find((list: { _id: string; }) => list._id === destination.droppableId)

      if (source.droppableId === destination.droppableId && sourceList) {
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
          _id: source.droppableId,
          cards: newCards
        })

      }

      if (source.droppableId !== destination.droppableId && sourceList && destinationList) {
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
          _id: draggableId,
          listId: destination.droppableId
        })
        // update source list
        updateList({
          _id: source.droppableId,
          cards: startCards
        })
        //update destination list
        updateList({
          _id: destination.droppableId,
          cards: finishCards
        })
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
      <div className={styles.container}>
        <BoardHeader
          name={'Zmień tło'}
          onClick={() => setIsOpenSideMenu(true)}
        />
        {
          isOpenSideMenu ?
            <SideMenu
              boardId={boardId}
              setBackgroundUrl={setBackgroundUrl}
              handleCloseMenu={() => setIsOpenSideMenu(false)}
            /> : null
        }
        <DragDropContext onDragEnd={onDragEnd} >
          <Droppable droppableId="all-list" direction="horizontal" type="list">
            {provided => (
              <div className={styles.listContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  lists?.map((list, index: number) => (
                    <List
                      _id={list._id}
                      index={index}
                      boardId={list.boardId}
                      key={list._id}
                      title={list.title}
                      cards={list.cards}
                    />
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className={styles.formContainer}>
            {isOpenForm ?
              <div className={styles.addListForm} ref={formRef}>
                <TaskForm
                  id='list'
                  handleChange={handleChangeListTitle}
                  handleSubmit={handleAddList}
                  closeForm={() => { setIsOpenForm(false); setListTitle('') }}
                  value={listTitle}
                  titleBtn={'Dodaj Listę'}
                />
              </div>
              : <TaskButton onClick={() => setIsOpenForm(true)} name={'Dodaj listę zadań'} icon={<GoPlus style={{ margin: '.3rem 0' }} />} />
            }
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

export default Board