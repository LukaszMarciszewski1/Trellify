import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.scss'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../TaskForm/TaskForm';
import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton'
import { BsThreeDots } from "react-icons/bs";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../../store/reducers/listsReducer";
import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  useAddCardMutation,
} from "../../../store/reducers/cardsReducer";
import Card from '../Card/Card';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { GoPlus } from "react-icons/go";
import Popup from '../../Details/Popup/Popup';
import { MdOutlineLabel } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Card as CardResponse } from '../../../models/card'
import { List as ListInterface } from '../../../models/list'
import { CardProps } from '../Card/Card'
interface PropsList extends ListInterface{
  // listId: string
  // boardId: string
  // title: string
  index: number
  // cards: []
}

const List: React.FC<PropsList> = ({ _id, boardId, title, cards, index }) => {
  const ref = useRef(null)
  const [addCard] = useAddCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateTaskMutation()
  const [deleteList] = useDeleteTaskMutation()

  const [listTitle, setListTitle] = useState(title)
  const [cardTitle, setCardTitle] = useState<string>('')
  const [openCardForm, setOpenCardForm] = useState<boolean>(false)
  const [openTitleForm, setOpenTitleForm] = useState<boolean>(false)
  const [dragDisabled, setDragDisabled] = useState<boolean>(false)
  const [actionTrigger, setActionTrigger] = useState<boolean>(false)

  // const [cardList, setCardList] = useState<CardResponse[]>([] as CardResponse)

  const handleChangeCardValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card') setCardTitle(e.target.value)
  }

  const handleEditListTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'list') setListTitle(e.target.value)
    updateList({
      _id: _id,
      title: e.target.value
    })
  }

  const handleAddCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    if (cardTitle.length === 0) return
    addCard({
      listId: _id,
      title: cardTitle,
    })
    updateBoard({
      _id: boardId,
    })
    setOpenCardForm(false)
    setCardTitle('')
  }

  const handleDeleteAllCards = () => {
    updateList({
      _id: _id,
      cards: []
    })
    updateBoard({
      _id: boardId
    })
    setActionTrigger(false)
  }

  const handleDeleteList = () => {
    deleteList(_id);
    updateBoard({ _id: boardId })
  }

  const handleSortCardsDateOfAdding = (cards: any[]) => {
    const newCards = [...cards]
    const sortedCards = newCards.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    updateList({
      _id: _id,
      cards: sortedCards
    })
    updateBoard({
      _id: boardId
    })
    setActionTrigger(false)
  }

  const handleSortCardsDateOfDeadline = (cards: any[]) => {
    const newCards = [...cards]
    const sortedCards = newCards.sort((a, b) => +new Date(b.deadline) - +new Date(a.deadline))
    updateList({
      _id: _id,
      cards: sortedCards
    })
    updateBoard({
      _id: boardId
    })
    setActionTrigger(false)
    console.log(sortedCards)
  }

  const handleCloseForm = () => { setOpenCardForm(false); setCardTitle(''); }
  useOnClickOutside(ref, handleCloseForm)

  return (
    <div >
      <Draggable draggableId={String(_id)} index={index} isDragDisabled={dragDisabled}>
        {provided => (
          <div className={styles.list} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <div className={styles.listHeader} onClick={() => setOpenTitleForm(true)} ref={ref}>
              {
                openTitleForm ?
                  <div className={styles.textWrapper}>
                    <TextareaAutosize
                      id='list'
                      autoFocus={true}
                      value={listTitle}
                      className={styles.textarea}
                      onChange={handleEditListTitle}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setOpenTitleForm(false)}
                      required
                    />
                  </div>
                  : <div className={styles.textWrapper}><h2>{listTitle}</h2></div>
              }
              <IconButton onClick={() => {
                setActionTrigger(true)
              }}><BsThreeDots style={{ fontSize: "1.3em" }} /></IconButton>
              {/* <div className={styles.actionsPopup}> */}
              <Popup
                title={'Akcje listy'}
                trigger={actionTrigger}
                closePopup={() => {
                  setActionTrigger(false)
                }}
              >
                <div className={styles.actionsPopupContent}>
                  <TaskButton
                    onClick={handleDeleteAllCards}
                    name={'Usuń wszystkie karty'}
                    icon={<MdOutlineLabel />}
                  />
                  <TaskButton
                    onClick={handleDeleteList}
                    name={'Usuń listę'}
                    icon={<RiDeleteBinLine />}
                  />
                  <TaskButton
                    onClick={() => handleSortCardsDateOfAdding(cards)}
                    name={'Sortuj karty po dacie dodania'}
                    icon={<RiDeleteBinLine />}
                  />
                  <TaskButton
                    onClick={() => handleSortCardsDateOfDeadline(cards)}
                    name={'Sortuj karty po terminie'}
                    icon={<RiDeleteBinLine />}
                  />
                </div>
              </Popup>
              {/* </div> */}
            </div>
            <Droppable droppableId={String(_id)} type="card">
              {provided => (
                <div className={styles.cardsContainer}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {
                    cards?.map((card, index: number) => (
                      <Card
                        _id={card._id}
                        index={index}
                        key={card._id}
                        // cardId={card._id}
                        boardId={boardId}
                        title={card.title}
                        deadline={card.deadline}
                        completed={card.completed}
                        description={card.description}
                        labels={card.labels}
                        files={card.files}
                        cover={card.cover}
                        nameList={listTitle}
                        setDragDisabled={setDragDisabled}
                      />
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className={styles.actionsList}>
              {openCardForm ?
                <div ref={ref}>
                  <TaskForm
                    id={'card'}
                    handleChange={handleChangeCardValue}
                    handleSubmit={handleAddCard}
                    closeForm={() => { setOpenCardForm(false); setCardTitle('') }}
                    value={cardTitle}
                    titleBtn={'Dodaj Kartę'}
                  />
                </div>
                : <TaskButton onClick={() => setOpenCardForm(true)} name={'Dodaj kartę'} icon={<GoPlus />} />
              }
            </div>
          </div>
        )
        }
      </Draggable>
    </div>
  )
}

export default List

