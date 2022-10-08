import React, { useState } from 'react'
import styles from './styles.module.scss'
import TaskButton from 'components/common/TaskButton/TaskButton'
import TaskForm from 'components/TasksBoard/TaskForm/TaskForm'
import { BsPencil } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'

import {
  useUpdateBoardMutation,

} from 'store/api/boards'
import {
  useUpdateCardMutation,
} from "store/api/cards"

interface DescriptionProps {
  boardId: string
  cardId: string
  cardDescription: string
  apiDescription: string
  setCardDescription: (value: string) => void
}

const Description: React.FC<DescriptionProps> = ({
  boardId,
  cardId,
  cardDescription,
  apiDescription,
  setCardDescription
}) => {
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [isDescriptionFormOpen, setIsDescriptionFormOpen] = useState(false)

  const handleEditCardDescription = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-description')
      setCardDescription(e.target.value)
  }

  const handleSaveCardDescription = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      _id: cardId,
      description: cardDescription
    })
    updateBoard({
      _id: boardId
    })
    setIsDescriptionFormOpen(false)
  }

  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.descriptionHeader}>
        <h4>Opis</h4>
        <div style={{ maxWidth: '100px', marginLeft: '1rem' }}>
          {
            !isDescriptionFormOpen && cardDescription !== undefined && cardDescription !== '' ? (
              <TaskButton
                onClick={() => setIsDescriptionFormOpen(true)}
                name={'Edytuj'} icon={<BsPencil />}
                style={{ height: '30px' }} />
            ) : null
          }
        </div>
      </div>
      {
        isDescriptionFormOpen ?
          <TaskForm
            id={'card-description'}
            handleChange={handleEditCardDescription}
            handleSubmit={handleSaveCardDescription}
            closeForm={() => { setIsDescriptionFormOpen(false); setCardDescription(apiDescription) }}
            value={cardDescription}
            onFocus={(e) => e.target.select()}
            titleBtn={'Zapisz'}
          /> :
          <div>
            {cardDescription !== '' && cardDescription !== undefined ? (
              <p onClick={() => setIsDescriptionFormOpen(true)}>{cardDescription}</p>
            ) : <TaskButton onClick={() => setIsDescriptionFormOpen(true)} name={'Dodaj opis...'} icon={<IoMdAdd />} />
            }
          </div>
      }
    </div>
  )
}

export default Description
