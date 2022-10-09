import React, { useState, useEffect, useCallback } from 'react'
import styles from './styles.module.scss'
import { Labels as LabelModel } from 'models/labels'
import Popup from 'components/common/Popup/Popup'
import LabelForm from '../LabelForm/LabelForm'
import TaskButton from 'components/common/TaskButton/TaskButton'
import Label from '../Label/Label'

import {
  useUpdateBoardMutation,

} from 'store/api/boards'
import {
  useGetAllCardsQuery,
  useUpdateCardMutation,
} from "store/api/cards"

interface LabelsPopupProps {
  boardLabels: any
  cardLabels: LabelModel[]
  setBoardLabels: (data: LabelModel[]) => void
  setCardLabels: (data: LabelModel[]) => void
  trigger: boolean
  setTrigger: (value: boolean) => void
  boardId: string
  cardId: string
}

const LabelsPopup: React.FC<LabelsPopupProps> = ({
  boardId,
  cardId,
  boardLabels,
  cardLabels,
  setBoardLabels,
  setCardLabels,
  trigger,
  setTrigger
}) => {

  const { data: cards } = useGetAllCardsQuery()
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const [isEditLabelPopupOpen, setIsEditLabelPopupOpen] = useState(false)
  const [isNewLabelPopupOpen, setIsNewLabelPopupOpen] = useState(false)

  const [labelTitle, setLabelTitle] = useState('')
  const [currentLabel, setCurrentLabel] = useState({ _id: '', color: '', title: '' })

  useEffect(() => {
    if (!trigger) {
      setIsEditLabelPopupOpen(false)
      setIsNewLabelPopupOpen(false)
    }
  }, [trigger])

  const handleAddNewLabel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...boardLabels, { color: currentLabel.color, title: labelTitle, active: false }]
    updateBoard({
      _id: boardId,
      labels: newLabels
    })
    setIsNewLabelPopupOpen(false)
  }

  const handleChangeLabelTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'label-title-edit') setCurrentLabel(label => { return { ...label, title: e.target.value } })
    if (e.target.id === 'label-title-add') setLabelTitle(e.target.value)
  }

  const handleGetCurrentEditLabel = (id: string) => {
    const newLabels = [...boardLabels]
    const activeLabel = newLabels.filter((label: { _id: string }) => label._id === id)
    const activeLabelTitle = activeLabel.map((label: { title: string }) => label.title).toString()
    const activeLabelColor = activeLabel.map((label: { color: string }) => label.color).toString()
    setCurrentLabel(label => { return { ...label, _id: id, title: activeLabelTitle, color: activeLabelColor } })
  }

  const getChangedLabels = (labels: LabelModel[]) => {
    return labels.map((label) => {
      if (label._id !== currentLabel._id) return label;
      return { ...label, title: currentLabel.title, color: currentLabel.color };
    });
  }

  const updateAllLabels = useCallback(() => {
    cards?.filter(card => card.boardId === boardId).map(card => {
      updateCard({
        _id: card._id,
        labels: getChangedLabels(card.labels)
      })
    })
  }, [currentLabel.color, currentLabel.title])

  const handleSaveLabelEditing = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateAllLabels()
    setBoardLabels(getChangedLabels(boardLabels))
    setCardLabels(getChangedLabels(cardLabels))
    updateBoard({
      _id: boardId,
      labels: getChangedLabels(boardLabels)
    })
    setIsEditLabelPopupOpen(false)
    setCurrentLabel(label => { return { ...label, title: '', color: '' } })
  }

  const handleCheckedLabel = (item: LabelModel) => {
    const newLabel = { ...item, active: !item.active };
    const existLabel = [...cardLabels].find((label: { _id: string; }) => label._id === newLabel._id)

    if (existLabel) {
      const newStateLabels = [...cardLabels].filter((label: { _id: string; }) => label._id !== existLabel._id)
      setCardLabels(newStateLabels)
      updateCard({
        _id: cardId,
        labels: newStateLabels
      })
    } else {
      const newStateLabels = [...cardLabels, newLabel]
      setCardLabels(newStateLabels)
      updateCard({
        _id: cardId,
        labels: newStateLabels
      })
    }
    updateBoard({
      _id: boardId,
    })
  }

  const handleDeleteLabel = () => {
    const newBoardLabels = [...boardLabels].filter((label) => label._id !== currentLabel._id);
    cards?.filter(card => card.boardId === boardId).map(card => {
      const newCardLabels = card.labels.filter((label: { _id: string }) => label._id !== currentLabel._id);
      setCardLabels(newCardLabels)
      updateCard({
        _id: card._id,
        labels: newCardLabels
      })
    })
    updateBoard({
      _id: boardId,
      labels: newBoardLabels
    })
    setIsEditLabelPopupOpen(false)
  }

  return (
    <Popup
      title={isEditLabelPopupOpen ? 'Edytuj etykietę' : isNewLabelPopupOpen ? 'Dodaj Etykietę' : 'Etykiety'}
      trigger={trigger}
      closePopup={() => setTrigger(false)}
      isEditWindow={isEditLabelPopupOpen || isNewLabelPopupOpen}
      backToMainWindow={() => { setIsEditLabelPopupOpen(false); setIsNewLabelPopupOpen(false) }}
    >
      <div className={styles.cardLabels}>
        {
          !isEditLabelPopupOpen &&
            !isNewLabelPopupOpen ? (
            <>
              <div className={styles.cardLabelsList}>
                {
                  boardLabels.map((label: LabelModel) => (
                    <Label
                      key={label._id}
                      labelId={label._id}
                      title={label.title}
                      color={label.color}
                      cardLabels={cardLabels}
                      openLabelEditWindow={() => {
                        setIsEditLabelPopupOpen(true)
                        handleGetCurrentEditLabel(label._id)
                      }}
                      handleCheckedLabel={() => handleCheckedLabel(label)}
                    >
                    </Label>
                  ))
                }
              </div>
              <TaskButton onClick={() => setIsNewLabelPopupOpen(true)} name={'Utwórz nową etykietę'} />
            </>
          ) : (
            <LabelForm
              formId={isEditLabelPopupOpen ? 'label-title-edit' : isNewLabelPopupOpen ? 'label-title-add' : ''}
              handleChangeTitle={handleChangeLabelTitle}
              handleSubmitForm={isEditLabelPopupOpen ?
                handleSaveLabelEditing : isNewLabelPopupOpen ? handleAddNewLabel :
                  () => console.log('label does not exist')}
              handleDeleteLabel={handleDeleteLabel}
              value={isEditLabelPopupOpen ? currentLabel.title : isNewLabelPopupOpen ? labelTitle : ''}
              onFocus={(e) => e.target.select()}
              selectColor={currentLabel.color}
              setSelectColor={setCurrentLabel}
            />
          )
        }
      </div>
    </Popup>
  )
}

export default LabelsPopup