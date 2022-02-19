import React, { useState, useRef } from 'react'
import styles from './styles.module.scss'

import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { BsXLg } from 'react-icons/bs';

import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'

import {
  // useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

type Props = {
  cardId: string
  title: string
  boardId: string
  nameList: string | undefined
  setOpenCardDetails: () => void
}

const CardDetails: React.FC<Props> = ({ cardId, title, setOpenCardDetails, boardId, nameList }) => {
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const ref = useRef(null)
  const [cardTitle, setCardTitle] = useState<string | undefined>(title)

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

  useOnClickOutside(ref, setOpenCardDetails)

  return (
    <div className={styles.window}>
      <div className={styles.overlay} onClick={setOpenCardDetails}></div>
      <div ref={ref} className={styles.container} >
        <div className={styles.cardHeader}>
          <TextareaAutosize
            id='card'
            autoFocus={false}
            value={cardTitle}
            className={styles.textarea}
            onChange={handleEditCardTitle}
            onFocus={(e) => e.target.select()}
            // onBlur={() => console.log('close')}
            required
          />
          <IconButton onClick={setOpenCardDetails}><BsXLg /></IconButton>
        </div>
        <p>{`na liscie: ${nameList}`}</p>
      </div>
    </div>

  )
}

export default CardDetails