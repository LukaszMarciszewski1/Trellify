import React, { useState, useRef } from 'react'
import styles from './styles.module.scss'

import TextareaAutosize from 'react-textarea-autosize';

import TaskForm from '../TaskForm/TaskForm'
import IconButton from '../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../hooks/useOnClickOutside'

import { BsXLg } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { BiTask } from 'react-icons/bi';
import { GrAttachment } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { MdOutlineLabel } from 'react-icons/md';
import { CgArrowRight } from 'react-icons/cg';
import { IoMdAdd } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
// import { SwatchesPicker } from 'react-color';

import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'

import {
  // useGetCardQuery,
  // useAddCardMutation,
  // useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";
// import { GrAdd } from 'react-icons/gr';
import TaskButton from '../TaskButton/TaskButton';
import Popup from '../../Details/Popup/Popup';
import Label from './CardWindowDetails/Label/Label';
// import { labelItems } from '../localData';

import ItemsContainer from './CardWindowDetails/ItemsContainer/ItemsContainer'
import LabelForm from './CardWindowDetails/LabelForm/LabelForm'
import e from 'express';

type Props = {
  cardId: string
  title: string
  description: string
  boardId: string
  nameList: string | undefined
  setOpenCardDetails: () => void
  cardLabels: any
}

const CardDetails: React.FC<Props> = ({ cardId, title, setOpenCardDetails, boardId, nameList, description, cardLabels }) => {

  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const ref = useRef(null)

  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string | undefined>(description)
  const [labels, setLabels] = useState(cardLabels)
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [labelsTrigger, setLabelsTrigger] = useState<boolean>(false)
  const [isOpenLabelEditWindow, setIsOpenLabelEditWindow] = useState<boolean>(false)
  const [currentLabelTitle, setCurrentLabelTitle] = useState<string>('')
  const [currentLabelId, setCurrentLabelId] = useState<string>('')
  const [currentLabelColor, setCurrentLabelColor] = useState<string>('')

  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-title') setCardTitle(e.target.value)
    updateCard({
      id: cardId,
      title: e.target.value
    })
    updateBoard({
      id: boardId
    })
  }

  const handleEditCardDescription = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-description')
      setCardDescription(e.target.value)
  }

  const handleSaveCardDescription = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      id: cardId,
      description: cardDescription
    })
    updateBoard({
      id: boardId
    })
    setFormIsOpen(false)
  }

  const handleChangeLabelTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'label-title') setCurrentLabelTitle(e.target.value)
  }

  const handleSaveLabelEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...labels]
    if (labels) {
      const newState = newLabels.map((label: any) => {
        if (label._id !== currentLabelId) return label;
        return { ...label, title: currentLabelTitle, color: currentLabelColor };
      });
      setLabels(newState)
      updateCard({
        id: cardId,
        labels: newState
      })
      updateBoard({
        id: boardId
      })
      setIsOpenLabelEditWindow(false)
    }
  }

  const handleCheckedLabel = (item: any) => {
    const newLabels = [...labels]
    if (labels) {
      const newState = newLabels.map((label: any) => {
        if (label._id !== item._id) return label;
        return { ...label, active: !label.active };
      });
      setLabels(newState)
      updateCard({
        id: cardId,
        labels: newState
      })
      updateBoard({
        id: boardId
      })
    }
  }

  const handleDeleteLabel = () => {
    const newLabels = [...labels]
    const newState = newLabels.filter((label) => label._id !== currentLabelId);
    setLabels(newState)
    updateCard({
      id: cardId,
      labels: newState
    })
    updateBoard({
      id: boardId
    })
    setIsOpenLabelEditWindow(false)
  }

  const handleGetCurrentEditLabel = (id: string) => {
    const newLabels = [...labels]
    const activeLabel = newLabels.filter((label: { _id: string }) => label._id === id)
    const activeLabelTitle = activeLabel.map((label: { title: string }) => label.title).toString()
    const activeLabelColor = activeLabel.map((label: { color: string }) => label.color).toString()
    setCurrentLabelTitle(activeLabelTitle)
    setCurrentLabelColor(activeLabelColor)
    setCurrentLabelId(id)
  }

  useOnClickOutside(ref, setOpenCardDetails)

  return (
    <>
      <div className={styles.overlay} onClick={setOpenCardDetails}></div>
      <div ref={ref} className={styles.cardWindow} >
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderText}>
            <TextareaAutosize
              id='card-title'
              autoFocus={false}
              value={cardTitle}
              className={styles.textareaTitle}
              onChange={handleEditCardTitle}
              onFocus={(e) => e.target.select()}
              rows={20}
              required
            />
            <p>Na liscie: <strong>{nameList}</strong></p>
          </div>
          <IconButton onClick={setOpenCardDetails}><BsXLg /></IconButton>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.windowMain}>
            <ItemsContainer data={labels} title={'Etykiety'}>
              {
                labels.map((label: { title: string; active: any; color: any; _id: string }) => (
                  label.active ? (
                    <div
                      key={label._id}
                      style={{ backgroundColor: `${label.color}` }}
                      className={styles.label}
                      onClick={() => console.log('click')}
                    >
                      <span>{label.title}</span>
                    </div>
                  ) : null
                ))
              }
            </ItemsContainer>
            <div className={styles.descriptionHeader}>
              <h4>Opis</h4>
              <div style={{ maxWidth: '100px', marginLeft: '1rem' }}>
                {
                  !formIsOpen && cardDescription !== undefined && cardDescription !== '' ? (
                    <TaskButton openForm={() => setFormIsOpen(true)} name={'Edytuj'} icon={<BsPencil />} />
                  ) : null
                }
              </div>
            </div>
            {
              formIsOpen ?
                <TaskForm
                  id={'card-description'}
                  handleChange={handleEditCardDescription}
                  handleSubmit={handleSaveCardDescription}
                  closeForm={() => { setFormIsOpen(false); setCardDescription(description) }}
                  value={cardDescription}
                  onFocus={(e) => e.target.select()}
                /> :
                <div className={styles.innerTextWrapper} >
                  {cardDescription !== '' && cardDescription !== undefined ? <p onClick={() => setFormIsOpen(true)}>{cardDescription}</p> :
                    <TaskButton openForm={() => setFormIsOpen(true)} name={'Dodaj opis...'} icon={<IoMdAdd />} />}
                </div>
            }
          </div>
          <div className={styles.cardSidebar}>
            <Popup
              title={isOpenLabelEditWindow ? 'Edytuj etykietę' : 'Etykiety'}
              trigger={labelsTrigger}
              closePopup={() => { setLabelsTrigger(false); setIsOpenLabelEditWindow(false) }}
              editWindow={isOpenLabelEditWindow}
              backToMainWindow={() => setIsOpenLabelEditWindow(false)}
            >
              <div className={styles.labels}>
                {
                  !isOpenLabelEditWindow ? (
                    <>
                      {
                        labels.map((label: any) => (
                          <Label
                            key={label._id}
                            title={label.title}
                            color={label.color}
                            active={label.active}
                            openLabelEditWindow={() => {
                              setIsOpenLabelEditWindow(true)
                              handleGetCurrentEditLabel(label._id)
                            }}
                            checkedLabel={() => handleCheckedLabel(label)}
                          />
                        ))
                      }
                      <TaskButton openForm={() => console.log('add new label')} name={'Utwórz nową etykietę'} />
                    </>
                  ) : (
                    <LabelForm
                      formId={'label-title'}
                      handleChange={handleChangeLabelTitle}
                      handleSubmit={handleSaveLabelEdit}
                      deleteLabel={handleDeleteLabel}
                      value={currentLabelTitle}
                      onFocus={(e) => e.target.select()}
                      selectColor={currentLabelColor}
                      setSelectColor={setCurrentLabelColor}
                    />
                  )
                }
              </div>
            </Popup>
            {/* </div> */}
            <TaskButton openForm={() => setLabelsTrigger(true)} name={'Etykiety'} icon={<MdOutlineLabel />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Data'} icon={<BsStopwatch />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Załącznik'} icon={<GrAttachment />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Lista zadań'} icon={<BiTask />} />
            <div className={styles.divider}></div>
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Przenieś'} icon={<CgArrowRight />} />
            <TaskButton openForm={() => setFormIsOpen(true)} name={'Usuń'} icon={<RiDeleteBinLine />} />
          </div>
        </div>
      </div>
    </>

  )
}

export default CardDetails