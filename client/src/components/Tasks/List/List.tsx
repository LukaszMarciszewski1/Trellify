import React, { useState, useRef } from 'react'
import styles from './styles.module.scss'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import {
  useDeleteListMutation,
  useUpdateListMutation,
  useDeleteAllCardsOfListMutation,
} from "store/api/lists";
import { useUpdateBoardMutation } from 'store/api/boards'
import { useAddCardMutation } from "store/api/cards"

import useOnClickOutside from 'hooks/useOnClickOutside'
import { List as ListInterface } from 'models/list'

import TextareaAutosize from 'react-textarea-autosize'
import Card from '../Card/Card'
import TaskForm from '../TaskForm/TaskForm'
import TaskButton from 'components/Details/TaskButton/TaskButton'
import IconButton from 'components/Details/IconButton/IconButton'
import Popup from 'components/Details/Popup/Popup'
import { BsThreeDots } from "react-icons/bs"
import { GoPlus } from "react-icons/go"

interface PropsList extends ListInterface {
  index: number
}

const List: React.FC<PropsList> = ({ _id, boardId, title, cards, index }) => {
  const [addCard] = useAddCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateListMutation()
  const [deleteList] = useDeleteListMutation()
  const [deleteAllCardsOfList] = useDeleteAllCardsOfListMutation()

  const [listTitle, setListTitle] = useState<string>(title)
  const [cardTitle, setCardTitle] = useState<string>('')
  const [isCardFormOpen, setIsCardFormOpen] = useState(false)
  const [isTitleFormOpen, setIsTitleFormOpen] = useState(false)
  const [isDragDisabled, setIsDragDisabled] = useState(false)
  const [popupTrigger, setPopupTrigger] = useState(false)
  const ref = useRef(null)

  // console.log(cards)

  const handleChangeListTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'list') setListTitle(e.target.value)
    updateList({
      _id: _id,
      title: e.target.value
    })
  }

  const handleAddCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card') setCardTitle(e.target.value)
  }

  const handleOnKeyDownListTitle = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.code === "NumpadEnter") {
      e.stopPropagation();
      setIsTitleFormOpen(false)
    }
  }

  const handleAddCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    e.stopPropagation()
    if (cardTitle.length === 0) return
    addCard({
      listId: _id,
      title: cardTitle
    })
    updateBoard({ _id: boardId })
    setIsCardFormOpen(false)
    setCardTitle('')
  }

  const handleDeleteAllCardsOfList = () => {
    deleteAllCardsOfList({ _id })
    updateBoard({ _id: boardId })
    setPopupTrigger(false)
  }

  const handleDeleteList = () => {
    deleteList(_id)
    updateBoard({ _id: boardId })
  }

  const handleSortCardsByDate = (props: string) => {
    const newCards = [...cards]
    if (props === 'sort-from-oldest') newCards.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    if (props === 'sort-from-newest') newCards.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    updateList({
      _id,
      cards: newCards
    })
    updateBoard({
      _id: boardId
    })
    setPopupTrigger(false)
    setIsDragDisabled(false)
  }

  const handleCloseForm = () => { setIsCardFormOpen(false); setCardTitle('') }
  useOnClickOutside(ref, handleCloseForm)

  return (
    <div className={styles.listWrapper}>
      <Draggable draggableId={String(_id)} index={index} isDragDisabled={isDragDisabled}>
        {provided => (
          <div className={styles.list} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <div className={styles.listHeader}>
              <div onClick={() => setIsTitleFormOpen(true)} ref={ref}>
                {
                  isTitleFormOpen ?
                    <div className={styles.textareaWrapper}>
                      <TextareaAutosize
                        id='list'
                        autoFocus={true}
                        value={listTitle}
                        className={styles.textarea}
                        onChange={handleChangeListTitle}
                        onFocus={(e) => e.target.select()}
                        onBlur={() => setIsTitleFormOpen(false)}
                        onKeyDown={handleOnKeyDownListTitle}
                        required
                      />
                    </div>
                    : <div className={styles.textareaWrapper}><h2>{listTitle}</h2></div>
                }
              </div>
              <IconButton onClick={() => {
                setPopupTrigger(true)
                setIsDragDisabled(true)
              }}>
                <BsThreeDots style={{ fontSize: "1.3em" }} />
              </IconButton>
              <Popup
                title={'Akcje listy'}
                trigger={popupTrigger}
                closePopup={() => {
                  setPopupTrigger(false)
                  setIsDragDisabled(false)
                }}
                top={'30px'}
                right={'-30px'}
              >
                <div className={styles.popupContent}>
                  {
                    cards.length > 1 ? (
                      <>
                        <TaskButton
                          onClick={() => handleSortCardsByDate('sort-from-newest')}
                          name={'Sortuj karty od najnowszych'}
                        />
                        <TaskButton
                          onClick={() => handleSortCardsByDate('sort-from-oldest')}
                          name={'Sortuj karty od najstarszych'}
                        />
                      </>
                    ) : null
                  }
                  {
                    cards.length ? (
                      <>
                        <div className={styles.divider}></div>
                        <TaskButton
                          onClick={handleDeleteAllCardsOfList}
                          name={'Usuń wszystkie karty'}
                        />
                      </>
                    ) : null
                  }
                  <TaskButton
                    onClick={handleDeleteList}
                    name={'Usuń listę'}
                  />
                </div>
              </Popup>
            </div>
            <Droppable droppableId={String(_id)} type="card">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={styles.cards}>
                  <div className={styles.cardsContainer}>
                    {
                      cards?.map((card, index: number) => (
                        <Card
                          _id={card._id}
                          index={index}
                          key={card._id}
                          boardId={boardId}
                          title={card.title}
                          deadline={card.deadline}
                          completed={card.completed}
                          description={card.description}
                          labels={card.labels}
                          files={card.files}
                          cover={card.cover}
                          usedMaterials={card.usedMaterials}
                          nameList={listTitle}
                          createdAt={card.createdAt}
                          setIsDragDisabled={setIsDragDisabled}
                        />
                      ))
                    }
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <div className={styles.addCardForm}>
              {isCardFormOpen ?
                <div ref={ref}>
                  <TaskForm
                    id={'card'}
                    handleChange={handleAddCardTitle}
                    handleSubmit={handleAddCard}
                    closeForm={() => { setIsCardFormOpen(false); setCardTitle('') }}
                    value={cardTitle}
                    titleBtn={'Dodaj Kartę'}
                  />
                </div>
                : <TaskButton onClick={() => setIsCardFormOpen(true)} name={'Dodaj kartę'} icon={<GoPlus />} />
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