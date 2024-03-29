import React from 'react'
import styles from './styles.module.scss'
import { useDebouncedCallback } from 'use-debounce';
import TextareaAutosize from 'react-textarea-autosize'
import { useUpdateBoardMutation } from 'store/api/boards'
import { useUpdateCardMutation } from "store/api/cards"

interface TitleProps {
  cardId: string
  boardId: string
  cardTitle: string
  listTitle: string
  setCardTitle: (value: string) => void
}

const Title: React.FC<TitleProps> = ({
  cardId,
  boardId,
  cardTitle,
  listTitle,
  setCardTitle
}) => {
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const debouncedCardTitle = useDebouncedCallback(
    (value) => {
      updateCard({
        _id: cardId,
        title: value
      })
      updateBoard({ _id: boardId })
    },
    300
  )

  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-title') {
      setCardTitle(e.target.value)
      debouncedCardTitle(e.target.value)
    }
  }

  return (
    <div className={styles.cardTitle}>
      <div className={styles.cardTitleContainer}>
        <TextareaAutosize
          id='card-title'
          autoFocus={false}
          value={cardTitle}
          className={styles.cardTitleTextarea}
          onChange={handleEditCardTitle}
          onFocus={(e) => e.target.select()}
          rows={20}
          maxRows={4}
          required
        />
        <p>Na liscie: <strong>{listTitle}</strong></p>
      </div>
    </div>
  )
}

export default Title