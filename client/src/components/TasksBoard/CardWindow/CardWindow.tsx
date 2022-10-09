import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.scss'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { useGetBoardQuery, useUpdateBoardMutation } from 'store/api/boards'
import { useDeleteCardMutation } from "store/api/cards"
import { Card as CardModel } from 'models/card'
import { Labels as LabelsModel } from 'models/labels'
import Modal from 'components/common/Modal/Modal'
import Popup from 'components/common/Popup/Popup'
import TaskButton from 'components/common/TaskButton/TaskButton'
import Cover from './Cover/Cover'
import Title from './Title/Title'
import Labels from './Labels/LabelsList/LabelsList'
import LabelsPopup from './Labels/LabelsPopup/LabelsPopup'
import DeadlineDate from './Date/DeadlineDate/DeadlineDate'
import DatePopup from './Date/DatePopup/DatePopup'
import Description from './Description/Description'
import Attachments from './Attachments/AttachmentsList/AttachmentsList'
import AttachmentsPopup from './Attachments/AttachmentsPopup/AttachmentsPopup'
import MaterialsList from './Materials/MaterialsList/MaterialsList'
import MaterialsPopup from './Materials/MaterialsPopup/MaterialsPopup'
import { BiTask } from 'react-icons/bi'
import { GrAttachment } from 'react-icons/gr'
import { BsStopwatch } from 'react-icons/bs'
import { MdOutlineLabel } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'

interface CardModalProps extends CardModel {
  dateIsSameOrBefore: boolean
  deadlineIsSoon: boolean
  cardFileIndex: number
  cardDateDisplay: {
    style: {
      backgroundColor: string
    },
    title: string
    status: string
  }
  setIsCardWindowOpen: () => void
  setCardCompleted: (value: boolean) => void
  setCardCover: (value: string) => void
  setCardFileIndex: (value: number) => void
}

const CardModal: React.FC<CardModalProps> = ({
  _id,
  boardId,
  title,
  description,
  completed,
  labels,
  deadline,
  cover,
  files,
  usedProducts,
  listTitle,
  dateIsSameOrBefore,
  deadlineIsSoon,
  cardDateDisplay,
  cardFileIndex,
  setCardCompleted,
  setIsCardWindowOpen,
  setCardCover,
  setCardFileIndex,
}) => {
  const { data: board } = useGetBoardQuery(boardId);
  const [deleteCard] = useDeleteCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const [labelsTrigger, setLabelsTrigger] = useState(false)
  const [dateTrigger, setDateTrigger] = useState(false)
  const [attachmentsTrigger, setAttachmentsTrigger] = useState(false)
  const [valuationTrigger, setValuationTrigger] = useState(false)
  const [materialsTrigger, setMaterialsTrigger] = useState(false)

  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDeadline, setCardDeadline] = useState<Date | null>(deadline ? new Date(deadline) : new Date())
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [boardLabels, setBoardLabels] = useState<LabelsModel[] | undefined>([])
  const [cardLabels, setCardLabels] = useState<LabelsModel[]>(labels)

  const refModal = useRef(null)

  useEffect(() => {
    if (board) {
      setBoardLabels(board.labels)
    }
  }, [board])

  useOnClickOutside(refModal, setIsCardWindowOpen)

  return (
    <Modal trigger={true} closeModal={setIsCardWindowOpen}>
      <div className={styles.cardWindow}>
        <Cover cover={cover} />
        <Title
          cardId={_id}
          boardId={boardId}
          cardTitle={cardTitle}
          listTitle={listTitle}
          setCardTitle={setCardTitle}
        />
        <div className={styles.cardWindowWrapper}>
          <div className={styles.cardWindowContent}>
            <Labels
              cardLabels={cardLabels}
              setLabelsTrigger={() => setLabelsTrigger(true)} />
            <DeadlineDate
              cardId={_id}
              boardId={boardId}
              deadline={deadline}
              completed={completed}
              deadlineIsSoon={deadlineIsSoon}
              dateIsSameOrBefore={dateIsSameOrBefore}
              setDateTrigger={setDateTrigger}
              setCompleted={setCardCompleted}
              title={cardDateDisplay.title}
              backgroundColor={cardDateDisplay.style.backgroundColor}
              status={cardDateDisplay.status}
            />
            <Description
              boardId={boardId}
              cardId={_id}
              cardDescription={cardDescription}
              beforeDescription={description}
              setCardDescription={setCardDescription}
            />
            <MaterialsList
              materials={usedProducts}
              setTrigger={setMaterialsTrigger}
            />
            <Attachments
              cardId={_id}
              boardId={boardId}
              files={files}
              cardFileIndex={cardFileIndex}
              setCardCover={setCardCover}
              setCardFileIndex={setCardFileIndex}
            />
          </div>
          <div className={styles.cardWindowSidebar} >
            <LabelsPopup
              cardId={_id}
              boardId={boardId}
              boardLabels={boardLabels}
              cardLabels={cardLabels}
              setBoardLabels={setBoardLabels}
              setCardLabels={setCardLabels}
              trigger={labelsTrigger}
              setTrigger={setLabelsTrigger}
            />
            <DatePopup
              cardId={_id}
              boardId={boardId}
              cardDeadline={cardDeadline}
              setCardDeadline={setCardDeadline}
              trigger={dateTrigger}
              setTrigger={setDateTrigger}
            />
            <AttachmentsPopup
              cardId={_id}
              boardId={boardId}
              trigger={attachmentsTrigger}
              setTrigger={setAttachmentsTrigger}
            />
            <MaterialsPopup
              cardId={_id}
              boardId={boardId}
              usedProducts={usedProducts}
              trigger={materialsTrigger}
              setTrigger={setMaterialsTrigger}
            />
            <Popup
              title={'Dodaj wycenę'}
              trigger={valuationTrigger}
              closePopup={() => setValuationTrigger(false)}
            >
              <div>
                <p>Is in progress ...</p>
              </div>
            </Popup>
            <TaskButton
              onClick={() => setLabelsTrigger(true)}
              name={'Etykiety'}
              icon={<MdOutlineLabel />} />
            <TaskButton
              onClick={() => setDateTrigger(true)}
              name={'Data'}
              icon={<BsStopwatch />} />
            <TaskButton
              onClick={() => setAttachmentsTrigger(true)}
              name={'Załącznik'}
              icon={<GrAttachment />} />
            <TaskButton
              onClick={() => setMaterialsTrigger(true)}
              name={'Magazyn'}
              icon={<BiTask />} />
            <TaskButton
              onClick={() => setValuationTrigger(true)}
              name={'Dodaj wycenę'}
              icon={<BiTask />} />
            <div className={styles.divider}></div>
            <TaskButton onClick={() => {
              const result = window.confirm("Usunąć kartę?")
              if (!result) return
              deleteCard(_id);
              updateBoard({ _id: boardId })
            }}
              name={'Usuń'}
              icon={<RiDeleteBinLine />} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CardModal