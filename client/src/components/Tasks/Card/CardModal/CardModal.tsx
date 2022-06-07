import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios';
import styles from './styles.module.scss'
import dayjs from 'dayjs';
import fileDownload from 'js-file-download'
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../../TaskForm/TaskForm'
import IconButton from '../../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../../hooks/useOnClickOutside'
import { isFileImage } from '../../../../hooks/useIsFileImage'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsXLg } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { BiTask } from 'react-icons/bi';
import { GrAttachment } from 'react-icons/gr';
import { BsStopwatch } from 'react-icons/bs';
import { MdOutlineLabel } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';

import {
  useGetBoardQuery,
  useUpdateBoardMutation,

} from '../../../../store/api/boards'

import {
  useGetAllCardsQuery,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../../store/api/cards";

import {
  useDeleteFileMutation,
} from '../../../../store/api/files'

import TaskButton from '../../TaskButton/TaskButton';
import Popup from '../../../Details/Popup/Popup';
import Label from './CardModalDetails/Label/Label';
import Container from './CardModalDetails/Container/Container'
import LabelForm from './CardModalDetails/LabelForm/LabelForm'
import Button from '../../../Details/Button/Button';
import FileForm from './CardModalDetails/FileForm/FileForm'
import Files from './CardModalDetails/Files/Files';

import { Line as ProgressLine } from 'rc-progress';
import { Card as CardModel } from '../../../../models/card'
import { Labels as LabelsInterface } from '../../../../models/labels'
import pl from "date-fns/locale/pl";


interface CardModalProps extends CardModel {
  dateIsSameOrBefore: boolean
  deadlineIsSoon: boolean
  cardFileIndex: number
  cardDateDisplay: {
    style: {
      backgroundColor: string
    },
    title: string
    name: string
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
  nameList,
  dateIsSameOrBefore,
  deadlineIsSoon,
  cardDateDisplay,
  cardFileIndex,
  setCardCompleted,
  setIsCardWindowOpen,
  setCardCover,
  setCardFileIndex,
}) => {
  dayjs.locale('pl');
  registerLocale("pl", pl);
  const { data: board } = useGetBoardQuery(boardId);
  const { data: cards } = useGetAllCardsQuery()

  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [cardLabels, setCardLabels] = useState<LabelsInterface[]>(labels)
  const [cardDeadline, setCardDeadline] = useState(deadline)
  const [boardLabels, setBoardLabels] = useState<any>([])
  const [labelTitle, setLabelTitle] = useState('')
  const [isDescriptionFormOpen, setIsDescriptionFormOpen] = useState(false)
  const [isLabelEditPopupOpen, setIsLabelEditPopupOpen] = useState(false)
  const [isAddNewLabelPopupOpen, setIsAddNewLabelPopupOpen] = useState(false)
  const [currentLabelTitle, setCurrentLabelTitle] = useState('')
  const [currentLabelId, setCurrentLabelId] = useState('')
  const [currentLabelColor, setCurrentLabelColor] = useState('')
  const [labelsTrigger, setLabelsTrigger] = useState(false)
  const [dateTrigger, setDateTrigger] = useState(false)
  const [fileTrigger, setFileTrigger] = useState(false)
  const [valuationTrigger, setValuationTrigger] = useState(false)
  const [storageTrigger, setStorageTrigger] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNameFiles, setSelectedNameFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null)

  const refModal = useRef(null)

  useEffect(() => {
    if (board) {
      setBoardLabels(board.labels)
    }
  }, [board])

  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-title') setCardTitle(e.target.value)
    updateCard({
      _id: _id,
      title: e.target.value
    })
    updateBoard({
      _id: boardId
    })
  }

  const handleEditCardDescription = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-description')
      setCardDescription(e.target.value)
  }

  const handleSaveCardDescription = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      _id: _id,
      description: cardDescription
    })
    updateBoard({
      _id: boardId
    })
    setIsDescriptionFormOpen(false)
  }

  const handleChangeLabelTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'label-title-edit') setCurrentLabelTitle(e.target.value)
    if (e.target.id === 'label-title-add') setLabelTitle(e.target.value)
  }

  const handleSaveLabelEditing = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...boardLabels]

    if (boardLabels) {
      const newLabelsBoardState = newLabels.map((label) => {
        if (label._id !== currentLabelId) return label;
        return { ...label, title: currentLabelTitle, color: currentLabelColor };
      });

      cards?.map(card => {
        const newLabels = card.labels.map(label => {
          if (label._id !== currentLabelId) return label;
          return { ...label, title: currentLabelTitle, color: currentLabelColor };
        })
        updateCard({
          _id: card._id,
          labels: newLabels
        })
        setCardLabels(newLabels)
      })

      setBoardLabels(newLabelsBoardState)

      updateBoard({
        _id: boardId,
        labels: newLabelsBoardState
      })
      setIsLabelEditPopupOpen(false)
    }
  }

  const handleAddNewLabel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...boardLabels, { color: currentLabelColor, title: labelTitle, active: false }]
    updateBoard({
      _id: boardId,
      labels: newLabels
    })
    setIsAddNewLabelPopupOpen(false)
  }

  const handleCheckedLabel = (item: LabelsInterface) => {
    const newCardLabels = [...cardLabels]
    const newLabel = { ...item, active: !item.active };
    const existLabel = newCardLabels.find((label: { _id: string; }) => label._id === newLabel._id)

    if (existLabel) {
      const newStateLabels = [...cardLabels].filter((label: { _id: string; }) => label._id !== existLabel._id)
      setCardLabels(newStateLabels)
      updateCard({
        _id: _id,
        labels: newStateLabels
      })
    } else {
      const newStateLabels = [...cardLabels, newLabel]
      setCardLabels(newStateLabels)
      updateCard({
        _id: _id,
        labels: newStateLabels
      })
    }
    updateBoard({
      _id: boardId,
    })
  }

  const handleDeleteLabel = () => {
    const newBoardLabelsState = [...boardLabels].filter((label) => label._id !== currentLabelId);
    cards?.map(card => {
      const newCardLabelsState = card.labels.filter((label) => label._id !== currentLabelId);
      setCardLabels(newCardLabelsState)
      updateCard({
        _id: card._id,
        labels: newCardLabelsState
      })
    })
    setBoardLabels(newBoardLabelsState)
    updateBoard({
      _id: boardId,
      labels: newBoardLabelsState
    })
    setIsLabelEditPopupOpen(false)
  }

  const handleGetCurrentEditLabel = (id: string) => {
    const newLabels = [...boardLabels]
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
      _id: _id,
      deadline: cardDeadline
    })
    updateBoard({ _id: boardId })
    setDateTrigger(false)
  }

  const handleDeleteDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    setCardDeadline(null)
    updateCard({
      _id: _id,
      deadline: null
    })
    updateBoard({ _id: boardId })
    setDateTrigger(false)
  }

  const handleChangeCompleted = () => {
    setCardCompleted(!completed);
    updateCard({
      _id: _id,
      completed: !completed
    })
    updateBoard({
      _id: boardId
    })
  };

  const handleUploadFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { files } } = e
    if (files !== null) {
      files?.length && setSelectedFiles(Array.from(files))
      const arr = []
      for (let i = 0; i < files.length; i++) {
        arr.push(files[i].name)
        setSelectedNameFiles(arr)
      }
    }
    setUploadStatus(true)
    setUploadProgress(0)
  },
    [],
  );

  const handleSubmitFiles = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!selectedFiles.length) return;
    if (!uploadStatus) return;

    const formData = new FormData();
    formData.append('cardId', _id)
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    const uploadFileOptions = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        setUploadProgress(percent)
      }
    }

    await axios.post(`${process.env.REACT_APP_API_URL}files`, formData, uploadFileOptions)
      .then(res => {
        updateCard({
          _id: _id,
        })
        updateBoard({
          _id: boardId
        })
        setUploadStatus(true)
        setTimeout(() => {
          setUploadProgress(0)
          setSelectedNameFiles([])
          setFileTrigger(false)
        }, 500)
      })
      .catch((error) => {
        console.log(error)
        setUploadStatus(false)
      })
  }

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId)
    updateCard({
      _id: _id,
      files: files
    })
    updateBoard({
      _id: boardId
    })
    if (files.length) {
      setCardCover(files[0].fileUrl)
    }
    else {
      setCardCover('')
    }
  }

  const handleDownloadFile = async (fileUrl: string) => {
    await axios.get(`${fileUrl}`, {
      responseType: 'blob',
    }).then((res) => {
      let filename = fileUrl.replace(/^.*[\\\/]/, '')
      let fileExtension;
      fileExtension = fileUrl.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      fileDownload(res.data, `${filename}.${fileExtension}`);
    });
  }

  const onClickHandler = () => {
    const newWindow = window.open(`${cover}`, "_blank", 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
  }

  const handleSelectCover = (index: number) => {
    setCardFileIndex(index)
    setCardCover(files[index].fileUrl)
    updateCard({
      _id: _id,
      cover: files[index].fileUrl
    })
    updateBoard({
      _id: boardId
    })
  }

  useOnClickOutside(refModal, setIsCardWindowOpen)

  return (
    <>
      <div className={styles.modal} onClick={setIsCardWindowOpen}></div>
      <div ref={refModal} className={styles.cardModal}>
        {
          cover && isFileImage(cover) ? (
            <div className={styles.cardModalCover} >
              <img onClick={onClickHandler} src={cover} alt={cover} />
            </div>
          ) : null
        }

        <div className={styles.closeModalBtn}>
          <IconButton onClick={setIsCardWindowOpen}><BsXLg /></IconButton>
        </div>
        <div className={styles.cardModalContainer}>
          <div className={styles.cardModalHeader}>
            <div className={styles.cardModalHeaderTextarea}>
              <TextareaAutosize
                id='card-title'
                autoFocus={false}
                value={cardTitle}
                className={styles.cardModalTextareaTitle}
                onChange={handleEditCardTitle}
                onFocus={(e) => e.target.select()}
                rows={20}
                required
              />
              <p>Na liscie: <strong>{nameList}</strong></p>
            </div>
          </div>
          <div className={styles.cardModalContent}>
            <div className={styles.cardModalMainContent}>
              <Container data={cardLabels} title={'Etykiety'}>
                {
                  cardLabels.map((label: { title: string; active: any; color: any; _id: string }) => (
                    <div
                      key={label._id}
                      style={{ backgroundColor: `${label.color}` }}
                      className={styles.cardModalLabel}
                      onClick={() => setLabelsTrigger(true)}
                    >
                      <span>{label.title}</span>
                    </div>
                  ))
                }
              </Container>
              <Container data={deadline} title={'Termin'}>
                <>
                  {
                    deadline ? (
                      <>
                        <input
                          type="checkbox"
                          checked={completed}
                          onChange={handleChangeCompleted}
                          style={{ height: '100%', width: '1rem', marginRight: '8px' }} />
                        <button onClick={() => setDateTrigger(true)}
                          className={styles.cardModalSelectedDateBtn}>
                          <span>{dayjs(deadline).format('DD-MM-YYYY HH:mm')}</span>
                          {
                            dateIsSameOrBefore && !completed ? (
                              <span
                                title={cardDateDisplay.title}
                                style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.dateNotificationSpan}>
                                {cardDateDisplay.name}
                              </span>
                            ) : null
                          }
                          {
                            deadlineIsSoon && !completed ? (
                              <span
                                title={cardDateDisplay.title}
                                style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.dateNotificationSpan}>
                                {cardDateDisplay.name}
                              </span>
                            ) : null
                          }
                          {
                            completed ? (
                              <span
                                title={cardDateDisplay.title}
                                style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.dateNotificationSpan}>
                                {cardDateDisplay.name}
                              </span>
                            ) : null
                          }
                        </button>
                      </>
                    ) : null
                  }
                </>
              </Container>
              <div className={styles.cardModalDescriptionContainer}>
                <div className={styles.cardModalDescriptionHeader}>
                  <h4>Opis</h4>
                  <div style={{ maxWidth: '100px', marginLeft: '1rem' }}>
                    {
                      !isDescriptionFormOpen && cardDescription !== undefined && cardDescription !== '' ? (
                        <TaskButton onClick={() => setIsDescriptionFormOpen(true)} name={'Edytuj'} icon={<BsPencil />} />
                      ) : null
                    }
                  </div>
                </div>
                {
                  isDescriptionFormOpen ?
                    <TaskForm
                      id={'card-description'}
                      handleChange={handleEditCardDescription}
                      handleSubmit={handleSaveCardDescription}
                      closeForm={() => { setIsDescriptionFormOpen(false); setCardDescription(description) }}
                      value={cardDescription}
                      onFocus={(e) => e.target.select()}
                      titleBtn={'Zapisz'}
                    /> :
                    <div>
                      {cardDescription !== '' && cardDescription !== undefined ? <p onClick={() => setIsDescriptionFormOpen(true)}>{cardDescription}</p> :
                        <TaskButton onClick={() => setIsDescriptionFormOpen(true)} name={'Dodaj opis...'} icon={<IoMdAdd />} />}
                    </div>
                }
              </div>
              <Container data={files} title={'Załącznik'}>
                <div className={styles.filesContainer}>
                  {
                    files?.map((file: { _id: string; fileName: string; createdAt: string; fileUrl: string; fileType: string }, index: number) => (
                      <Files
                        key={file._id}
                        title={file.fileName}
                        created={`Dodano ${dayjs(file.createdAt).format('DD MMM')} o ${dayjs(file.createdAt).format('HH:mm')}`}
                        active={cardFileIndex}
                        index={index}
                        src={`${file.fileUrl}`}
                        type={file.fileType}
                        handleDeleteFile={() => handleDeleteFile(file._id)}
                        handleDownloadFile={() => handleDownloadFile(file.fileUrl)}
                        handleSelectCover={() => handleSelectCover(index)}
                      />
                    ))
                  }
                </div>
              </Container>
            </div>
            <div className={styles.cardModalSidebar} >
              <Popup
                title={isLabelEditPopupOpen ? 'Edytuj etykietę' : isAddNewLabelPopupOpen ? 'Dodaj Etykietę' : 'Etykiety'}
                trigger={labelsTrigger}
                closePopup={() => { setLabelsTrigger(false); setIsLabelEditPopupOpen(false); setIsAddNewLabelPopupOpen(false) }}
                isEditWindow={isLabelEditPopupOpen || isAddNewLabelPopupOpen}
                backToMainWindow={() => { setIsLabelEditPopupOpen(false); setIsAddNewLabelPopupOpen(false) }}
              >
                <div className={styles.cardModalLabels}>
                  {
                    !isLabelEditPopupOpen &&
                      !isAddNewLabelPopupOpen ? (
                      <>
                        <div className={styles.cardModalLabelsList}>
                          {
                            boardLabels.map((label: LabelsInterface) => (
                              <Label
                                key={label._id}
                                labelId={label._id}
                                title={label.title}
                                color={label.color}
                                cardLabels={labels}
                                openLabelEditWindow={() => {
                                  setIsLabelEditPopupOpen(true)
                                  handleGetCurrentEditLabel(label._id)
                                }}
                                handleCheckedLabel={() => handleCheckedLabel(label)}
                              >
                              </Label>
                            ))
                          }
                        </div>
                        <TaskButton onClick={() => setIsAddNewLabelPopupOpen(true)} name={'Utwórz nową etykietę'} />
                      </>
                    ) : (
                      <LabelForm
                        formId={isLabelEditPopupOpen ? 'label-title-edit' : isAddNewLabelPopupOpen ? 'label-title-add' : ''}
                        handleChangeTitle={handleChangeLabelTitle}
                        handleChangeLabelTitle={isLabelEditPopupOpen ? handleSaveLabelEditing : isAddNewLabelPopupOpen ? handleAddNewLabel : () => console.log('label does not exist')}
                        handleDeleteLabel={handleDeleteLabel}
                        value={isLabelEditPopupOpen ? currentLabelTitle : isAddNewLabelPopupOpen ? labelTitle : ''}
                        onFocus={(e) => e.target.select()}
                        selectColor={currentLabelColor}
                        setSelectColor={setCurrentLabelColor}
                      />
                    )
                  }
                </div>
              </Popup>
              <Popup
                title={'Data'}
                trigger={dateTrigger}
                closePopup={() => setDateTrigger(false)}
                backToMainWindow={() => setDateTrigger(false)}
              >
                <DatePicker
                  dateFormat='DD/MM/YYYY'
                  timeFormat="hh:mm"
                  locale="pl"
                  selected={deadline ? new Date(deadline) : null}
                  onChange={(date: Date) => setCardDeadline(date)}
                  inline
                  showTimeInput
                  timeInputLabel="Godzina:"
                />
                <label>Termin <br></br>
                  <input style={{ maxWidth: '100px', marginRight: '10px' }} placeholder={dayjs(deadline).format('DD/MM/YYYY')} />
                  <input style={{ maxWidth: '100px' }} placeholder={dayjs(deadline).format('HH:mm')} />
                </label>
                <div className={styles.actionsForm}>
                  <Button onClick={handleSaveDeadline} title={'Zapisz'} type={'button'} />
                  <div style={{ marginRight: '1rem' }} />
                  <Button onClick={handleDeleteDeadline} title={'Usuń'} bgColor={'#EA4746'} type={'button'} />
                </div>
              </Popup>
              <Popup
                title={'Załącznik'}
                trigger={fileTrigger}
                closePopup={() => setFileTrigger(false)}
                backToMainWindow={() => setFileTrigger(false)}
              >
                <FileForm
                  name={'załącznik'}
                  size={0}
                  label={'załącznik'}
                  type={'file'}
                  listNames={selectedNameFiles}
                  handleInputState={handleUploadFiles}
                  handleSubmitFiles={handleSubmitFiles}
                />
                {uploadProgress > 0 ? (
                  <>
                    {
                      uploadStatus !== null && uploadStatus === true ? (
                        <div><ProgressLine percent={uploadProgress} strokeWidth={4} strokeColor="#D3D3D3" /><p>{uploadProgress}%</p></div>
                      ) : null
                    }
                    {
                      uploadStatus === false ?
                        <p style={{ color: 'red' }}>Błąd przesyłania<small> (max 10mb, lub nieprawidłowy format pliku)</small></p>
                        : null
                    }
                  </>
                ) : null
                }
              </Popup>
              <Popup
                title={'Dodaj wycenę'}
                trigger={valuationTrigger}
                closePopup={() => setValuationTrigger(false)}
              >
                <div>
                  <p>In progress ...</p>
                </div>
              </Popup>
              <Popup
                title={'Magazyn'}
                trigger={storageTrigger}
                closePopup={() => setStorageTrigger(false)}
              >
                <div>
                  <p>In progress ...</p>
                </div>
              </Popup>
              <TaskButton onClick={() => setLabelsTrigger(true)} name={'Etykiety'} icon={<MdOutlineLabel />} />
              <TaskButton onClick={() => setDateTrigger(true)} name={'Data'} icon={<BsStopwatch />} />
              <TaskButton onClick={() => setFileTrigger(true)} name={'Załącznik'} icon={<GrAttachment />} />
              <TaskButton onClick={() => setValuationTrigger(true)} name={'Dodaj wycenę'} icon={<BiTask />} />
              <TaskButton onClick={() => setStorageTrigger(true)} name={'Magazyn'} icon={<BiTask />} />
              <div className={styles.divider}></div>
              <TaskButton onClick={() => {
                deleteCard(_id);
                updateBoard({ _id: boardId })
              }} name={'Usuń'} icon={<RiDeleteBinLine />} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardModal