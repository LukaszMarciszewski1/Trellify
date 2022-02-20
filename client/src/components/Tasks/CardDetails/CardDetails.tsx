import React, { useState, useRef } from 'react'
import styles from './styles.module.scss'

import TextareaAutosize from 'react-textarea-autosize';

import TaskForm from '../TaskForm/TaskForm'
import Button from '../../Details/Button/Button';
import IconButton from '../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { BsXLg } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';

import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'

import {
  // useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";
import { GrAdd } from 'react-icons/gr';
import TaskButton from '../TaskButton/TaskButton';

type Props = {
  cardId: string
  title: string
  description: string
  boardId: string
  nameList: string | undefined
  setOpenCardDetails: () => void
}

const CardDetails: React.FC<Props> = ({ cardId, title, setOpenCardDetails, boardId, nameList, description }) => {
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const ref = useRef(null)
  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [formIsOpen, setFormIsOpen] = useState(false)

  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card') setCardTitle(e.target.value)
    updateCard({
      id: cardId,
      title: e.target.value
    })
    updateBoard({
      id: boardId
    })
  }

  const handleEditCardDescription = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-description')
      setCardDescription(e.target.value)
  }

  const handleUpdateCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      id: cardId,
      description: cardDescription
    })
    updateBoard({
      id: boardId
    })
    setFormIsOpen(false)
  }

  useOnClickOutside(ref, setOpenCardDetails)
  console.log(cardDescription)

  return (
    <>
      <div className={styles.overlay} onClick={setOpenCardDetails}></div>
      <div ref={ref} className={styles.cardWindow} >
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderText}>
            <TextareaAutosize
              id='card'
              autoFocus={false}
              value={cardTitle}
              className={styles.textareaTitle}
              onChange={handleEditCardTitle}
              onFocus={(e) => e.target.select()}
              rows={20}
              // onBlur={() => console.log('close')}
              required
            />
            <p>Na liscie: <strong>{nameList}</strong></p>
          </div>
          <IconButton onClick={setOpenCardDetails}><BsXLg /></IconButton>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.cardMain}>
            <div className={styles.cardDescription}>
              <div className={styles.cardDescriptionHeader}>
                <h4>Opis</h4>
                <div style={{ maxWidth: '100px', marginLeft: '1rem' }}>
                  {
                    !formIsOpen && cardDescription !== '' ? (
                      <TaskButton openForm={() => setFormIsOpen(true)} name={'Edytuj'} icon={<BsXLg />} />
                    ) : null
                  }
                </div>
              </div>
              {
                !formIsOpen && cardDescription === '' ? (
                  <TaskButton openForm={() => setFormIsOpen(true)} name={'Dodaj opis...'} icon={<BsXLg />} />
                ) : null
              }
              {
                formIsOpen ?
                  <TaskForm
                    id={'card-description'}
                    handleChange={handleEditCardDescription}
                    handleSubmit={handleUpdateCard}
                    closeForm={() => { setFormIsOpen(false); setCardDescription(description) }}
                    value={cardDescription}
                    onFocus={(e) => e.target.select()}
                  // onBlur={() => setFormIsOpen(false)}
                  /> : <div className={styles.formContainer} onClick={() => setFormIsOpen(true)}>
                    {description !== '' ? <p>{description}</p> : 'Dodaj opis...'}
                  </div>
                //  <TaskButton openForm={() => setFormIsOpen(true)} name={cardDescription !== '' ? cardDescription : 'Dodaj opis...'}  />

              }
            </div>
          </div>
          <div className={styles.cardSidebar}>
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Etykiety'} icon={<BsPencil />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Data'} icon={<BsXLg />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Załącznik'} icon={<BsXLg />} />
          </div>
        </div>
      </div>
    </>

  )
}

export default CardDetails