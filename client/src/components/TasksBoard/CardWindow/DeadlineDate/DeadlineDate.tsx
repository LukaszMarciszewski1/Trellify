import React from 'react'
import styles from './styles.module.scss'
import dayjs from 'dayjs'
import Container from '../Container/Container'

import { useUpdateBoardMutation } from 'store/api/boards'
import { useUpdateCardMutation } from "store/api/cards"

interface DisplayStyle {
  title: string,
  backgroundColor: string
  status: string
}

interface DateProps extends DisplayStyle {
  cardId: string
  boardId: string
  deadline: Date | null
  completed: boolean
  dateIsSameOrBefore: boolean
  deadlineIsSoon: boolean
  setDateTrigger: () => void
  setCompleted: (value: boolean) => void
}

const DeadlineDate: React.FC<DateProps> = ({
  cardId,
  boardId,
  deadline,
  completed,
  deadlineIsSoon,
  dateIsSameOrBefore,
  setDateTrigger,
  setCompleted,
  title,
  backgroundColor,
  status
}) => {
  
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const handleChangeCompleted = () => {
    setCompleted(!completed);
    updateCard({
      _id: cardId,
      completed: !completed
    })
    updateBoard({
      _id: boardId
    })
  };

  return (
    <Container data={deadline} title={'Termin'}>
      <>
        {
          deadline ? (
            <>
              <input
                type="checkbox"
                checked={completed}
                onChange={handleChangeCompleted} />
              <button onClick={setDateTrigger}
                className={styles.selectedDateBtn}>
                <span>{dayjs(deadline).format('DD-MM-YYYY HH:mm')}</span>
                {
                  dateIsSameOrBefore && !completed ? (
                    <span
                      title={title}
                      style={{ backgroundColor: backgroundColor }}
                      className={styles.notificationSpan}>
                      {status}
                    </span>
                  ) : null
                }
                {
                  deadlineIsSoon && !completed ? (
                    <span
                      title={title}
                      style={{ backgroundColor: backgroundColor }}
                      className={styles.notificationSpan}>
                      {status}
                    </span>
                  ) : null
                }
                {
                  completed ? (
                    <span
                      title={title}
                      style={{ backgroundColor: backgroundColor }}
                      className={styles.notificationSpan}>
                      {status}
                    </span>
                  ) : null
                }
              </button>
            </>
          ) : null
        }
      </>
    </Container>
  )
}

export default DeadlineDate