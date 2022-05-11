import React, { useState, useEffect, useRef, useCallback } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration'

import 'dayjs/locale/pl';
import CardModal from './CardModal/CardModal';
import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

import { MdOutlineLabel } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { GrTextAlignFull } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { ImCheckboxChecked } from 'react-icons/im';
import { GrAttachment } from 'react-icons/gr';
import IconButton from '../../Details/IconButton/IconButton';
import TaskButton from '../TaskButton/TaskButton';
import useHover from '../../../hooks/useHover'
import { isFileImage } from '../../../hooks/isFileImage'
import Popup from '../../Details/Popup/Popup';
import { Card as CardModel } from '../../../models/card'

export interface CardProps extends CardModel {
  index: number
  setDragDisabled: (value: boolean) => void
}

const Card: React.FC<CardProps> = ({
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
  createdAt,
  setDragDisabled,
}) => {

  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [isOpenCardModal, setIsOpenCardModal] = useState<boolean>(false)
  const [isDisplayEditIcon, setIsDisplayEditIcon] = useState(false)
  const [cardLabels, setCardLabels] = useState(labels)
  const [cardCompleted, setCardCompleted] = useState(completed)
  const [cardDeadline, setCardDeadline] = useState(deadline)
  const [nowDate, setNowDate] = useState(Date.now())
  const [cardFiles, setCardFiles] = useState([] as any)
  const [cardCover, setCardCover] = useState(cover)
  const [cardFileIndex, setCardFileIndex] = useState(0)
  const [actionTrigger, setActionTrigger] = useState(false)

  dayjs.locale('pl');
  dayjs.extend(isSameOrBefore)
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

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

  const handleMouseEnter = () => {
    setIsDisplayEditIcon(true)
  }

  const handleMouseLeave = () => {
    setIsDisplayEditIcon(false)
  }

  const handleOpenCardModal = () => {
    setIsOpenCardModal(true)
    setDragDisabled(true)
  }

  const handleCloseCardModal = () => {
    setIsOpenCardModal(false)
    setDragDisabled(false)
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
  const dateIsSameOrBefore = dayjs(cardDeadline).isSameOrBefore(nowDate, 'minute')
  const timeToDeadline = dayjs(cardDeadline).diff(dayjs(nowDate), 'minute', true)
  const deadlineIsSoon = (timeToDeadline < fiveHours && timeToDeadline > 0) ? true : false

  const cardDateDisplay = {
    style: {
      color: (cardCompleted || dateIsSameOrBefore || deadlineIsSoon) ? 'white' : 'black',
      backgroundColor: cardCompleted ? 'green' : dateIsSameOrBefore ? 'red' : deadlineIsSoon ? 'orange' : 'transparent'
    },
    title: cardCompleted ? 'Ta karta została ukończona' :
      dateIsSameOrBefore ? 'Ta karta jest przeterminowana' :
        deadlineIsSoon ? `Deadline ${dayjs(cardDeadline).fromNow()}` : 'Karta jest na później',
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

  return (
    <div>
      {
        isOpenCardModal ?
          <CardModal
            _id={_id}
            nameList={nameList}
            title={title}
            description={description}
            boardId={boardId}
            deadline={cardDeadline}
            labels={cardLabels}
            files={cardFiles}
            cover={cardCover}
            completed={cardCompleted}
            cardFileIndex={cardFileIndex}
            dateIsSameOrBefore={dateIsSameOrBefore}
            deadlineIsSoon={deadlineIsSoon}
            cardDateDisplay={cardDateDisplay}
            createdAt={createdAt}
            setCardLabels={setCardLabels}
            setCardDeadline={setCardDeadline}
            setCardCompleted={setCardCompleted}
            setIsCardWindowOpen={handleCloseCardModal}
            setCardFileIndex={setCardFileIndex}
            setCardCover={setCardCover}
          /> : null
      }
      <div>
        <Draggable draggableId={_id} index={index} >
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
              <div className={styles.card}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.cardContainer} >
                  <div className={styles.cardClickableArea} onClick={handleOpenCardModal}></div>
                  {
                    cardFiles.length ? (
                      <div className={styles.cardCover} style={cardCoverStyle}>
                      </div>
                    ) : null
                  }
                  <div className={styles.cardDetails}>
                    {
                      cardLabels.length ? (
                        <div className={styles.cardLabels} onClick={handleOpenCardModal}>
                          {
                            cardLabels.map((label: { active: any; color: any; _id: string; title: string }) => (
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
                </div>
                <div className={styles.btnContainer}>
                  {
                    isDisplayEditIcon ? (
                      <IconButton onClick={() => {
                        setActionTrigger(true)
                        setDragDisabled(true)
                      }}>
                        <RiDeleteBin6Line />
                      </IconButton>) : null
                  }
                </div>
                {/* <div className={styles.actionsContainer}>
                  <Popup
                    title={'akcje karty'}
                    trigger={actionTrigger}
                    closePopup={() => {
                      setActionTrigger(false)
                      setDragDisabled(false)
                    }}
                  >
                    <div className={styles.actionsPopupContent}>
                      <TaskButton onClick={() => {
                        handleOpenCardModal()
                        setActionTrigger(false)
                      }} name={'Otwórz kartę'} icon={<MdOutlineLabel />} />

                      <TaskButton onClick={() => {
                        deleteCard(_id);
                        updateBoard({ _id: boardId })
                      }} name={'Usuń'} icon={<RiDeleteBinLine />} />
                    </div>
                  </Popup>
                </div> */}
              </div>
            </div>
          )}
        </Draggable>
      </div>
    </div>
  )
}

export default Card