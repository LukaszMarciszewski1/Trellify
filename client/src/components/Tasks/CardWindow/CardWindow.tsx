import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.scss'
import dayjs from 'dayjs';
import TextareaAutosize from 'react-textarea-autosize';

import TaskForm from '../TaskForm/TaskForm'
import IconButton from '../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../hooks/useOnClickOutside'

import DatePicker, { registerLocale } from "react-datepicker";
import { parseISO, format } from 'date-fns'
import { pl } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css";

import { BsXLg } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { BiTask } from 'react-icons/bi';
import { GrAttachment } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { MdOutlineLabel } from 'react-icons/md';
import { CgArrowRight, CgChevronDoubleLeft } from 'react-icons/cg';
import { IoMdAdd } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
// import { SwatchesPicker } from 'react-color';

import {
  useGetBoardQuery,
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
import { BiCheck } from 'react-icons/bi';
// import { labelItems } from '../localData';

import ItemsContainer from './CardWindowDetails/ItemsContainer/ItemsContainer'
import LabelForm from './CardWindowDetails/LabelForm/LabelForm'
import Button from '../../Details/Button/Button';

type Props = {
  cardId: string
  title: string
  description: string
  boardId: string
  nameList: string | undefined
  deadline: Date | null
  setOpenCardDetails: () => void
  cardLabels: any
  setCardLabels: (value: any) => void
  settingsLabel: []
  setSettingsLabel: (value: any) => void
}

const CardDetails: React.FC<Props> = ({
  cardId,
  title,
  setOpenCardDetails,
  boardId,
  nameList,
  description,
  cardLabels,
  deadline,
  setCardLabels,
  settingsLabel,
  setSettingsLabel
}) => {
  const { data: board, error, isLoading } = useGetBoardQuery(boardId);
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const refWindow = useRef(null)
  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string | undefined>(description)
  const [labels, setLabels] = useState([] as any)
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [labelsTrigger, setLabelsTrigger] = useState<boolean>(false)
  const [dateTrigger, setDateTrigger] = useState<boolean>(false)
  const [isOpenLabelEditWindow, setIsOpenLabelEditWindow] = useState<boolean>(false)
  const [isOpenAddNewLabelWindow, setIsOpenAddNewLabelWindow] = useState<boolean>(false)
  const [currentLabelTitle, setCurrentLabelTitle] = useState<string>('')
  const [currentLabelId, setCurrentLabelId] = useState<string>('')
  const [currentLabelColor, setCurrentLabelColor] = useState<string>('')
  const [labelTitle, setLabelTitle] = useState<string>('')

  const [deadlineCard, setDeadlineCard] = useState<Date | null>(deadline)
  const [checked, setChecked] = React.useState(false);
  const maxDate = new Date()



  useEffect(() => {
    registerLocale("pl", pl);
    if (board) {
      setLabels(board.labels)
    }
  }, [board])


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
    if (e.target.id === 'label-title-edit') setCurrentLabelTitle(e.target.value)
    if (e.target.id === 'label-title-add') setLabelTitle(e.target.value)
  }

  const handleSaveLabelEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...labels]
    const newCardLabels = [...cardLabels]
    if (labels) {
      const newLabelState = newLabels.map((label: any) => {
        if (label._id !== currentLabelId) return label;
        return { ...label, title: currentLabelTitle, color: currentLabelColor };
      });

      const newCardLabelState = newCardLabels.map((label: any) => {
        if (label._id !== currentLabelId) return label;
        return { ...label, title: currentLabelTitle, color: currentLabelColor };
      })

      setCardLabels(newCardLabelState)
      setLabels(newLabelState)
      updateBoard({
        id: boardId,
        labels: newLabelState
      })
      setIsOpenLabelEditWindow(false)
    }
  }

  const handleAddNewLabel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...labels, { color: currentLabelColor, title: labelTitle, active: false }]
    updateBoard({
      id: boardId,
      labels: newLabels
    })
    setIsOpenAddNewLabelWindow(false)
  }

  const handleCheckedLabel = (item: any) => {
    const copyCardLabels = [...cardLabels]
    const newLabel = { ...item, active: !item.active };
    const existLabel = copyCardLabels.find((label: { _id: string; }) => label._id === newLabel._id)

    if (existLabel) {
      const newLabels = copyCardLabels.filter((label: { _id: string; }) => label._id !== existLabel._id)
      setCardLabels(newLabels)
      updateCard({
        id: cardId,
        labels: newLabels
      })
    } else {
      const newLabels = [...copyCardLabels, newLabel]
      setCardLabels(newLabels)
      updateCard({
        id: cardId,
        labels: newLabels
      })
    }
    updateBoard({
      id: boardId,
    })
  }

  const handleDeleteLabel = () => {
    const newLabels = [...labels]
    const newCardLabels = [...cardLabels]
    const newLabelsState = newLabels.filter((label) => label._id !== currentLabelId);
    const newCardLabelsState = newCardLabels.filter((label) => label._id !== currentLabelId);
    setLabels(newLabelsState)
    setCardLabels(newCardLabelsState)
    updateCard({
      id: cardId,
      labels: newCardLabelsState
    })
    updateBoard({
      id: boardId,
      labels: newLabelsState
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

  const handleSaveDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      id: cardId,
      deadline: deadlineCard
    })
    updateBoard({ id: boardId })
    setDateTrigger(false)
  }

  const handleDeleteDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    setDeadlineCard(null)
    updateCard({
      id: cardId,
      deadline: null
    })
    updateBoard({ id: boardId })
    setDateTrigger(false)
  }

  const handleChange = () => {
    setChecked(!checked);
  };
  console.log(checked)

  useOnClickOutside(refWindow, setOpenCardDetails)

  return (
    <>
      <div className={styles.overlay} onClick={setOpenCardDetails}></div>
      <div ref={refWindow} className={styles.cardWindow}>
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
            <ItemsContainer data={cardLabels} title={'Etykiety'}>
              {
                cardLabels.map((label: { title: string; active: any; color: any; _id: string }) => (
                  <div
                    key={label._id}
                    style={{ backgroundColor: `${label.color}` }}
                    className={styles.label}
                    onClick={() => setLabelsTrigger(true)}
                  >
                    <span>{label.title}</span>
                  </div>
                ))
              }
            </ItemsContainer>
            <ItemsContainer data={deadlineCard} title={'Termin'}>
              {
                deadlineCard ? (
                  <>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleChange}
                      style={{ height: '100%', width: '1rem', marginRight: '8px' }} />
                    <button onClick={() => setDateTrigger(true)}
                      style={{ maxWidth: '250px', padding: '8px', backgroundColor: '#ebecf0' }}>
                      <span>{dayjs(deadlineCard).format('DD-MM-YYYY HH:mm')}</span>
                      <span style={{ backgroundColor: deadlineCard < maxDate ? 'red' : 'green', color: 'white', marginLeft: '5px', borderRadius: '4px' }}>
                        {deadlineCard < maxDate ? 'termin przekroczony' : ''}
                      </span>
                      {
                        checked ? (
                          <span style={{ backgroundColor: 'green', color: 'white', padding: '.2rem', marginLeft: '5px', borderRadius: '4px' }}>zrealizowany</span>
                        ) : null
                      }

                    </button>
                    {/* <TaskButton openForm={() => setFormIsOpen(true)} name={'Usuń'} icon={<RiDeleteBinLine />} /> */}
                  </>
                ) : null
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
                <div>
                  {cardDescription !== '' && cardDescription !== undefined ? <p onClick={() => setFormIsOpen(true)}>{cardDescription}</p> :
                    <TaskButton openForm={() => setFormIsOpen(true)} name={'Dodaj opis...'} icon={<IoMdAdd />} />}
                </div>
            }
          </div>
          <div className={styles.cardSidebar} >
            <Popup
              title={isOpenLabelEditWindow ? 'Edytuj etykietę' : isOpenAddNewLabelWindow ? 'Dodaj Etykietę' : 'Etykiety'}
              trigger={labelsTrigger}
              closePopup={() => { setLabelsTrigger(false); setIsOpenLabelEditWindow(false); setIsOpenAddNewLabelWindow(false) }}
              editWindow={isOpenLabelEditWindow || isOpenAddNewLabelWindow}
              backToMainWindow={() => { setIsOpenLabelEditWindow(false); setIsOpenAddNewLabelWindow(false) }}
            >
              <div className={styles.labels}>
                {
                  !isOpenLabelEditWindow &&
                    !isOpenAddNewLabelWindow ? (
                    <>
                      <div className={styles.labelsList}>
                        {
                          labels.map((label: any) => (
                            <Label
                              key={label._id}
                              labelId={label._id}
                              title={label.title}
                              color={label.color}
                              cardLabels={cardLabels}
                              openLabelEditWindow={() => {
                                setIsOpenLabelEditWindow(true)
                                handleGetCurrentEditLabel(label._id)
                              }}
                              checkedLabel={() => handleCheckedLabel(label)}
                            >
                            </Label>
                          ))
                        }
                      </div>
                      <TaskButton openForm={() => setIsOpenAddNewLabelWindow(true)} name={'Utwórz nową etykietę'} />
                    </>
                  ) : (
                    <LabelForm
                      formId={isOpenLabelEditWindow ? 'label-title-edit' : isOpenAddNewLabelWindow ? 'label-title-add' : ''}
                      handleChange={handleChangeLabelTitle}
                      handleSubmit={isOpenLabelEditWindow ? handleSaveLabelEdit : isOpenAddNewLabelWindow ? handleAddNewLabel : () => console.log('label does not exist')}
                      deleteLabel={handleDeleteLabel}
                      value={isOpenLabelEditWindow ? currentLabelTitle : isOpenAddNewLabelWindow ? labelTitle : ''}
                      onFocus={(e) => e.target.select()}
                      selectColor={currentLabelColor}
                      setSelectColor={setCurrentLabelColor}
                    />
                  )
                }
              </div>
            </Popup>
            <Popup
              title={'data'}
              trigger={dateTrigger}
              closePopup={() => setDateTrigger(false)}
              editWindow={false}
              backToMainWindow={() => setDateTrigger(false)}
            >
              <DatePicker
                // locale={'pl'}
                dateFormat='DD/MM/YYYY'
                timeFormat="hh:mm"
                selected={deadlineCard ? new Date(deadlineCard) : null}
                onChange={(date: Date) => setDeadlineCard(date)}
                inline
                showTimeInput
              // isClearable
              />
              <label>Termin <br></br>
                <input style={{ maxWidth: '100px', marginRight: '10px' }} placeholder={dayjs(deadlineCard).format('DD/MM/YYYY')} />
                <input style={{ maxWidth: '100px' }} placeholder={dayjs(deadlineCard).format('HH:mm')} />
              </label>
              <div className={styles.actionsForm}>
                <Button onClick={handleSaveDeadline} title={'Zapisz'} />
                <div style={{ marginRight: '1rem' }} />
                <Button onClick={handleDeleteDeadline} title={'Usuń'} bgColor={'#EA4746'} />
              </div>
            </Popup>

            <TaskButton openForm={() => setLabelsTrigger(true)} name={'Etykiety'} icon={<MdOutlineLabel />} />
            <TaskButton openForm={() => setDateTrigger(true)} name={'Data'} icon={<BsStopwatch />} />
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