import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/pl';
import {
  useUpdateBoardMutation,
} from 'store/api/boards'
import {
  useUpdateCardMutation,
} from "store/api/cards";
import defaultBg from 'assets/img/defaultBackground.jpg'
import useHover from 'hooks/useHover'
import { isFileImage } from 'hooks/useIsFileImage'
import { Card as CardModel } from 'models/card'
import Box from 'components/Details/Box/Box'
import CardModal from './CardModal/CardModal';
import { GrTextAlignFull } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { ImCheckboxChecked } from 'react-icons/im';
import { GrAttachment } from 'react-icons/gr';

export interface CardProps extends CardModel {
  index: number
  setIsDragDisabled: (value: boolean) => void
}

const TaskCard: React.FC<CardProps> = ({
  _id,
  boardId,
  title,
  index,
  nameList,
  description,
  completed,
  labels,
  deadline,
  cover,
  files,
  usedMaterials,
  createdAt,
  setIsDragDisabled,
}) => {
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false)
  const [cardCompleted, setCardCompleted] = useState(completed)
  const [nowDate, setNowDate] = useState(Date.now())
  const [cardCover, setCardCover] = useState<string>(cover)
  const [cardFileIndex, setCardFileIndex] = useState(0)
  const [cardFiles, setCardFiles] = useState(files)

  dayjs.locale('pl');
  dayjs.extend(isSameOrBefore)
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)

  useEffect(() => {
    const intervalIsSameOrBefore = setInterval(() => setNowDate(Date.now()), 100000)
    return () => clearInterval(intervalIsSameOrBefore)
  }, [])

  useEffect(() => {
    if (files) {
      setCardFiles(files)
    }
  }, [files])

  useEffect(() => {
    displayCover()
  }, [cardFiles])

  useEffect(() => {
    updateCard({ _id, cover: cardCover })
    updateBoard({ _id: boardId })
  }, [cardCover])

  const displayCover = () => {
    if (cardFiles) {
      const newFiles = [...cardFiles]
      const filesOnlyImages = newFiles.filter(file => isFileImage(file.fileUrl))
      const selectedCover = filesOnlyImages.find((file: { fileUrl: string }) => file.fileUrl === cover)
      let activeIndex = filesOnlyImages.indexOf(selectedCover);
      const indexOnlyImages = newFiles.findIndex(el => isFileImage(el.fileUrl))
      if (filesOnlyImages.length) {
        if (activeIndex < 0) {
          setCardCover(filesOnlyImages[0].fileUrl)
          setCardFileIndex(indexOnlyImages)
        } else {
          setCardCover(filesOnlyImages[activeIndex].fileUrl)
          setCardFileIndex(activeIndex)
        }
      }
      else {
        setCardCover('')
      }
    }
  }

  const handleOpenCardModal = () => {
    setIsCardModalOpen(true)
    setIsDragDisabled(true)
  }

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false)
    setIsDragDisabled(false)
  }

  const handleChangeCompleted = () => {
    setCardCompleted(!cardCompleted);
    updateCard({
      _id: _id,
      completed: !cardCompleted
    })
    updateBoard({
      _id: boardId
    })
  };

  const fiveHours = 300 //minutes
  const dateIsSameOrBefore = dayjs(deadline).isSameOrBefore(nowDate, 'minute')
  const timeToDeadline = dayjs(deadline).diff(dayjs(nowDate), 'minute', true)
  const deadlineIsSoon = (timeToDeadline < fiveHours && timeToDeadline > 0) ? true : false

  const cardDateDisplay = {
    style: {
      color: (cardCompleted || dateIsSameOrBefore || deadlineIsSoon) ? 'white' : 'black',
      backgroundColor: cardCompleted ? 'green' : dateIsSameOrBefore ? 'red' : deadlineIsSoon ? 'orange' : 'transparent'
    },
    title: cardCompleted ? 'Ta karta została ukończona' :
      dateIsSameOrBefore ? 'Ta karta jest przeterminowana' :
        deadlineIsSoon ? `Deadline ${dayjs(deadline).fromNow()}` : 'Karta jest na później',
    name: cardCompleted ? 'zrealizowany' :
      dateIsSameOrBefore ? 'termin przekroczony' :
        deadlineIsSoon ? `wkrótce` : '',
    iconStyle: {
      marginRight: '5px',
      fontSize: '14px',
    }
  }

  return (
    <div>
      {
        isCardModalOpen ?
          <CardModal
            _id={_id}
            nameList={nameList}
            title={title}
            description={description}
            boardId={boardId}
            deadline={deadline}
            labels={labels}
            files={cardFiles}
            usedMaterials={usedMaterials}
            cover={cardCover}
            completed={cardCompleted}
            cardFileIndex={cardFileIndex}
            dateIsSameOrBefore={dateIsSameOrBefore}
            deadlineIsSoon={deadlineIsSoon}
            cardDateDisplay={cardDateDisplay}
            createdAt={createdAt}
            setCardCompleted={setCardCompleted}
            setIsCardWindowOpen={handleCloseCardModal}
            setCardFileIndex={setCardFileIndex}
            setCardCover={setCardCover}
          /> : null
      }
      <div className={styles.container}>
        <Draggable draggableId={_id} index={index} >
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
              <Box onClick={handleOpenCardModal}>
                {
                  cardFiles.length ? (
                    <div className={styles.cardCover} style={
                      {
                        backgroundColor: cardCover,
                        backgroundImage: `url(${cardCover})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                      }
                    }>
                    </div>
                  ) : null
                }
                <div className={styles.cardDetails}>
                  {
                    labels.length ? (
                      <div className={styles.cardLabels} onClick={handleOpenCardModal}>
                        {
                          labels.map((label: { active: any; color: any; _id: string; title: string }) => (
                            <div title={`${label.title}`} key={label._id} className={styles.cardLabel} style={{ backgroundColor: `${label.color}` }}></div>
                          ))
                        }
                      </div>
                    ) : null
                  }
                  <p >{title}</p>
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
                    {description ? <div className={styles.icons} title="Ta karta ma opis."><GrTextAlignFull onClick={handleOpenCardModal} /></div> : null}
                    {cardFiles.length ? <div className={styles.icons} title="Załączniki"><GrAttachment /><span>{cardFiles.length}</span></div> : null}
                  </div>
                </div>
              </Box>
            </div>
          )}
        </Draggable>
      </div>
    </div>
  )
}

export default TaskCard