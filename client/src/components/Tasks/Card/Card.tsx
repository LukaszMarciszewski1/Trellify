import React, { useState, useEffect, useRef, useCallback } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import minMax from 'dayjs/plugin/minMax';
import updateLocale from 'dayjs/plugin/updateLocale'
import duration from 'dayjs/plugin/duration'

import 'dayjs/locale/pl';
import CardWindow from '../CardWindow/CardWindow';
// import TextareaAutosize from 'react-textarea-autosize';
import {
  // useGetAllTasksQuery,
  // useAddTaskMutation,
  // useDeleteTaskMutation,
  // useUpdateTaskMutation,
  // useAddCardMutation,
} from "../../../store/reducers/listsReducer";
import {
  // useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  // useGetCardQuery,
  // useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

import { BsPencil } from 'react-icons/bs';
import { GrTextAlignFull } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { ImCheckboxChecked } from 'react-icons/im';
// import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton';
import TaskButton from '../TaskButton/TaskButton';
import Button from '../../Details/Button/Button';

import useHover from '../../../hooks/useHover'

type Props = {
  boardId: string
  title: string
  description: string
  listId?: string
  cardId: string
  index: number
  deadline: Date | null
  completed: boolean
  updateDate?: Date
  labels: []
  files: []
  onClickDelete?: () => void
  dragDisabled: (value: boolean) => void
  nameList: string | undefined
}

const Card: React.FC<Props> = ({
  cardId,
  boardId,
  title,
  index,
  dragDisabled,
  nameList,
  description,
  completed,
  labels,
  deadline,
  files
}) => {
  dayjs.locale('pl');
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [isCardWindowOpen, setIsCardWindowOpen] = useState<boolean>(false)
  const [showText, setShowText] = useState(false)
  const [cardLabels, setCardLabels] = useState(labels)
  const [cardCompleted, setCardCompleted] = useState(completed)
  const [deadlineCard, setDeadlineCard] = useState<Date | null>(deadline)
  const [isShowChecked, setShowChecked] = useState<boolean>(false)
  const [nowDate, setNowDate] = useState(Date.now())

  // const ref = useRef(null);

  dayjs.extend(isSameOrBefore)
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  useEffect(() => {
    const intervalIsSameOrBefore = setInterval(() => setNowDate(Date.now()), 10000)
    return () => clearInterval(intervalIsSameOrBefore)
  }, [])

  const handleMouseEnter = () => {
    setShowText(true)
  }

  const handleMouseLeave = () => {
    setShowText(false)
  }

  const handleOpenCardWindow = () => {
    setIsCardWindowOpen(true)
    dragDisabled(true)
  }

  const handleCloseCardWindow = () => {
    setIsCardWindowOpen(false)
    dragDisabled(false)
  }

  const handleChangeCompleted = () => {
    setCardCompleted(!cardCompleted);
    updateCard({
      id: cardId,
      completed: !cardCompleted
    })
    updateBoard({
      id: boardId
    })
  };

  const fiveHours = 300 //minutes
  const dateIsSameOrBefore = dayjs(deadlineCard).isSameOrBefore(nowDate, 'minute')
  const timeToDeadline = dayjs(deadlineCard).diff(dayjs(nowDate), 'minute', true)
  const deadlineIsSoon = (timeToDeadline < fiveHours && timeToDeadline > 0) ? true : false

  const cardDateDisplay = {
    style: {
      color: (cardCompleted || dateIsSameOrBefore || deadlineIsSoon) ? 'white' : 'black',
      backgroundColor: cardCompleted ? 'green' : dateIsSameOrBefore ? 'red' : deadlineIsSoon ? 'orange' : 'transparent'
    },
    title: cardCompleted ? 'Ta karta została ukończona' :
      dateIsSameOrBefore ? 'Ta karta jest przeterminowana' :
        deadlineIsSoon ? `Deadline ${dayjs(deadlineCard).fromNow()}` : 'Karta jest na później',
    name: cardCompleted ? 'zrealizowany' :
      dateIsSameOrBefore ? 'termin przekroczony' :
        deadlineIsSoon ? `wkrótce` : '',
    iconStyle: {
      marginRight: '5px',
      fontSize: '14px',
    }
  }

  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)

  return (
    <>
      {
        isCardWindowOpen ?
          <CardWindow
            nameList={nameList}
            cardId={cardId}
            title={title}
            description={description}
            boardId={boardId}
            deadlineCard={deadlineCard}
            cardLabels={cardLabels}
            cardCompleted={cardCompleted}
            setCardLabels={setCardLabels}
            setDeadlineCard={setDeadlineCard}
            setCardCompleted={setCardCompleted}
            setIsCardWindowOpen={handleCloseCardWindow}
            dateIsSameOrBefore={dateIsSameOrBefore}
            deadlineIsSoon={deadlineIsSoon}
            cardDateDisplay={cardDateDisplay}
          /> : null
      }
      <Draggable draggableId={String(cardId)} index={index} >
        {provided => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            <div className={styles.card}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.cardContainer} >
                <div className={styles.cardClickableArea} onClick={handleOpenCardWindow}></div>
                {
                  cardLabels.length ? (
                    <div className={styles.cardLabels} onClick={handleOpenCardWindow}>
                      {
                        cardLabels.map((label: { active: any; color: any; _id: string; title: string }) => (
                          <div title={`${label.title}`} key={label._id} className={styles.cardLabel} style={{ backgroundColor: `${label.color}` }}></div>
                        ))
                      }
                    </div>
                  ) : null
                }
                <span >{title}</span>
                <div className={styles.iconsContainer}>
                  {
                    deadline ? (
                      <button
                        ref={hoverRef}
                        className={styles.dateBtn}
                        onClick={handleChangeCompleted}
                        style={cardDateDisplay.style}
                        title={cardDateDisplay.title}

                      >
                        {isHover ? (cardCompleted ? <ImCheckboxChecked style={cardDateDisplay.iconStyle} /> : <ImCheckboxUnchecked style={cardDateDisplay.iconStyle} />) : <BsStopwatch style={cardDateDisplay.iconStyle} />}
                        {dayjs(deadline).format('DD MMM')}
                      </button>
                    ) : null
                  }
                  {description ? <GrTextAlignFull onClick={handleOpenCardWindow} style={{ fontSize: '.9rem', color: 'grey', zIndex: 2 }} title="Ta karta ma opis." /> : null}
                </div>
              </div>
              <div className={styles.btnContainer}>
                {
                  showText ? <IconButton onClick={() => {
                    deleteCard(cardId);
                    updateBoard({ id: boardId })
                  }}>
                    <BsPencil />
                  </IconButton> : null
                }
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  )
}

export default Card
