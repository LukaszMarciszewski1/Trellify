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
  useGetCardQuery,
  // useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

import { BsPencil } from 'react-icons/bs';
import { GrTextAlignFull } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { ImCheckboxChecked } from 'react-icons/im';
import { GrAttachment } from 'react-icons/gr';
// import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton';
import TaskButton from '../TaskButton/TaskButton';
import Button from '../../Details/Button/Button';

import useHover from '../../../hooks/useHover'
import { isFileImage } from '../../../hooks/isFileImage'

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
  cover: string
  labels: []
  files: []
  nameList: string | undefined
  onClickDelete?: () => void
  dragDisabled: (value: boolean) => void
}

const Card: React.FC<Props> = ({
  cardId,
  boardId,
  title,
  index,
  nameList,
  description,
  completed,
  labels,
  deadline,
  cover,
  dragDisabled,
}) => {
  const { data: card, error, isLoading } = useGetCardQuery(cardId);
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [isCardWindowOpen, setIsCardWindowOpen] = useState<boolean>(false)
  const [showText, setShowText] = useState<boolean>(false)
  const [cardLabels, setCardLabels] = useState(labels)
  const [cardCompleted, setCardCompleted] = useState<boolean>(completed)
  const [deadlineCard, setDeadlineCard] = useState<Date | null>(deadline)
  const [nowDate, setNowDate] = useState(Date.now())
  const [files, setFiles] = useState([] as any)
  const [cardCover, setCover] = useState<string | undefined>(cover)
  const [cardFileIndex, setFileIndex] = useState<number>(0)

  dayjs.locale('pl');
  dayjs.extend(isSameOrBefore)
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  useEffect(() => {
    const intervalIsSameOrBefore = setInterval(() => setNowDate(Date.now()), 100000)
    return () => clearInterval(intervalIsSameOrBefore)
  }, [])

  useEffect(() => {
    if (card) {
      setFiles(card.files)
    }
  }, [card])

  useEffect(() => {
    const filesOnlyImages = [...files]?.filter(file => isFileImage(file.fileUrl))
    const selectedCover = filesOnlyImages.find((file: { fileUrl: string }) => file.fileUrl === cover)
    let activeIndex = filesOnlyImages.indexOf(selectedCover);
    
    if (filesOnlyImages.length) {
      if (activeIndex < 0) {
        setCover(filesOnlyImages[0].fileUrl)
        setFileIndex(0)
      } else {
        setCover(filesOnlyImages[activeIndex].fileUrl)
        setFileIndex(activeIndex)
      }
    }
    else {
      setCover('')
    }
  }, [files])

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


  const cardCoverStyle = {
    backgroundColor: cardCover,
    backgroundImage: `url(${cardCover})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }

  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)

  if (isLoading) return <p>...</p>
  if (error) return <p>Brak połączenia</p>

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
            cardFiles={files}
            cardCover={cardCover}
            setFileIndex={setFileIndex}
            cardFileIndex={cardFileIndex}
            setCover={setCover}
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
                  files.length ? (
                    <div className={styles.cardCover} style={cardCoverStyle}>
                    </div>
                  ) : null
                }
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
                  <div ref={hoverRef}>
                    {
                      deadline ? (
                        <button
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
                  </div>
                  {description ? <div className={styles.icons} title="Ta karta ma opis."><GrTextAlignFull onClick={handleOpenCardWindow} /></div> : null}
                  {files.length ? <div className={styles.icons} title="Załączniki"><GrAttachment /><span>{files.length}</span></div> : null}
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
