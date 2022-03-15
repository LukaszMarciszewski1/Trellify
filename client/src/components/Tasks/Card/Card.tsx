import React, { useState, useEffect } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
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
// import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton';
import TaskButton from '../TaskButton/TaskButton';

type Props = {
  boardId: string
  title: string
  description: string
  listId?: string
  cardId: string
  index: number
  deadline: Date | null
  updateDate?: Date
  labels: []
  onClickDelete?: () => void
  dragDisabled: (value: boolean) => void
  nameList: string | undefined
}

const Card: React.FC<Props> = ({
  cardId,
  boardId,
  title,
  index,
  onClickDelete,
  dragDisabled,
  nameList,
  description,
  labels,
  deadline
}) => {
  dayjs.locale('pl');
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [openCardDetails, setOpenCardDetails] = useState<boolean>(false)
  const [showText, setShowText] = useState(false)
  const [cardLabels, setCardLabels] = useState(labels)
  const [settingsLabel, setSettingsLabel] = useState([] as any)
  const [checkedDeadline, setCheckedDeadline] = React.useState(false);

  const handleMouseEnter = () => {
    setShowText(true)
  }
  const handleMouseLeave = () => {
    setShowText(false)
  }

  return (
    <>
      {
        openCardDetails ?
          <CardWindow
            nameList={nameList}
            cardId={cardId}
            title={title}
            description={description}
            boardId={boardId}
            cardLabels={cardLabels}
            deadline={deadline}
            setCardLabels={setCardLabels}
            settingsLabel={settingsLabel}
            setSettingsLabel={setSettingsLabel}
            setOpenCardDetails={() => {
              setOpenCardDetails(false)
              dragDisabled(false)
            }}
          /> : null
      }
      <Draggable draggableId={String(cardId)} index={index} >
        {provided => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            <div className={styles.card}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.cardContainer} onClick={() => {
                setOpenCardDetails(true)
                dragDisabled(true)
              }}>
                <div className={styles.cardLabels}>
                  {
                    cardLabels.map((label: { active: any; color: any; _id: string; title: string }) => (
                      // label.active ? 
                      <div title={`${label.title}`} key={label._id} className={styles.cardLabel} style={{ backgroundColor: `${label.color}` }}></div>
                      // : null
                    ))
                  }
                </div>
                <span >{title}</span>
                <div className={styles.iconsContainer}>
                  {description ? <GrTextAlignFull style={{ fontSize: '.9rem', color: 'grey', marginTop: '5px' }} /> : null}
                  {deadline ? <span style={{ fontSize: '.9rem', color: 'grey', marginTop: '5px', display: 'flex', alignItems: 'center' }}><BsStopwatch style={{ marginRight: '5px' }} />{dayjs(deadline).format('DD/MMMM')}</span> : null}
                  {/* <TaskButton openForm={() => console.log('okk')} name={'Usuń'} icon={<BsStopwatch />} /> */}
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
