import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios';
import styles from './styles.module.scss'
import dayjs from 'dayjs';
import fileDownload from 'js-file-download'
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../../TaskForm/TaskForm'
import IconButton from '../../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../../hooks/useOnClickOutside'
import { isFileImage } from '../../../../hooks/isFileImage'
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
import ItemsContainer from './CardModalDetails/ItemsContainer/ItemsContainer'
import LabelForm from './CardModalDetails/LabelForm/LabelForm'
import Button from '../../../Details/Button/Button';
import FileForm from './CardModalDetails/FileForm/FileForm'
import Files from './CardModalDetails/Files/Files';

import { Line as ProgressLine } from 'rc-progress';
import { File as FileResponse } from '../../../../models/file'
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
  setCardDeadline: (value: Date | null) => void
  setCardLabels: (value: any) => void
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
  setCardDeadline,
  setCardCompleted,
  setIsCardWindowOpen,
  setCardLabels,
  setCardCover,
  setCardFileIndex,
}) => {
  dayjs.locale('pl');
  registerLocale("pl", pl);
  const { data: board, error, isLoading } = useGetBoardQuery(boardId);
  const { data: cards } = useGetAllCardsQuery()

  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteFile] = useDeleteFileMutation();

  const refWindow = useRef(null)
  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [boardLabels, setBoardLabels] = useState([] as any)
  const [labelTitle, setLabelTitle] = useState('')

  const [formIsOpen, setFormIsOpen] = useState(false)
  const [isOpenLabelEditWindow, setIsOpenLabelEditWindow] = useState(false)
  const [isOpenAddNewLabelWindow, setIsOpenAddNewLabelWindow] = useState(false)

  const [currentLabelTitle, setCurrentLabelTitle] = useState('')
  const [currentLabelId, setCurrentLabelId] = useState('')
  const [currentLabelColor, setCurrentLabelColor] = useState('')

  //triggers state
  const [labelsTrigger, setLabelsTrigger] = useState(false)
  const [dateTrigger, setDateTrigger] = useState(false)
  const [fileTrigger, setFileTrigger] = useState(false)
  const [storageTrigger, setStorageTrigger] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNameFiles, setSelectedNameFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null)

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
    setFormIsOpen(false)
  }

  const handleChangeLabelTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'label-title-edit') setCurrentLabelTitle(e.target.value)
    if (e.target.id === 'label-title-add') setLabelTitle(e.target.value)
  }


  const handleSaveLabelEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...boardLabels]
    const newCardLabels = [...labels]

    if (boardLabels) {
      const newLabelsBoardState = newLabels.map((label) => {
        if (label._id !== currentLabelId) return label;
        return { ...label, title: currentLabelTitle, color: currentLabelColor };
      });

      // const newCardLabelState = newCardLabels.map((label) => {
      //   if (label._id !== currentLabelId) return label;
      //   return { ...label, title: currentLabelTitle, color: currentLabelColor };
      // })

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
      setIsOpenLabelEditWindow(false)
    }
  }

  const handleAddNewLabel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...boardLabels, { color: currentLabelColor, title: labelTitle, active: false }]
    updateBoard({
      _id: boardId,
      labels: newLabels
    })
    setIsOpenAddNewLabelWindow(false)
  }

  const handleCheckedLabel = (item: LabelsInterface) => {
    const newCardLabels = [...labels]
    const newLabel = { ...item, active: !item.active };
    const existLabel = newCardLabels.find((label: { _id: string; }) => label._id === newLabel._id)

    if (existLabel) {
      const newStateLabels = [...labels].filter((label: { _id: string; }) => label._id !== existLabel._id)
      setCardLabels(newStateLabels)
      updateCard({
        _id: _id,
        labels: newStateLabels
      })
    } else {
      const newStateLabels = [...labels, newLabel]
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
    setIsOpenLabelEditWindow(false)
  }

  const handleGetCurrentEditLabel = (id: string) => {
    const newLabels = [...boardLabels]
    const activeLabel = newLabels.filter((label: { _id: string }) => label._id === id)
    const activeLabelTitle = activeLabel.map((label: { title: string }) => label.title).toString()
    const activeLabelColor = activeLabel.map((label: { color: string }) => label.color).toString()
    setCurrentLabelTitle(activeLabelTitle)
    setCurrentLabelColor(activeLabelColor)
    setCurrentLabelId(id)
    // updateBoard({ _id: boardId })
  }

  const handleSaveDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      _id: _id,
      deadline: deadline
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

  const handleUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmitFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

  const handleDownloadFile = (fileUrl: string) => {
    axios.get(`${fileUrl}`, {
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
    // setSelected(id); 
    // const newWindow = window.open(`${cardCover}`, "_blank", 'noopener,noreferrer');
    // if (newWindow) newWindow.opener = null
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

  useOnClickOutside(refWindow, setIsCardWindowOpen)

  return (
    <>
      <div className={styles.modal} onClick={setIsCardWindowOpen}></div>
      <div ref={refWindow} className={styles.cardWindow}>
        {
          cover && isFileImage(cover) ? (
            <div className={styles.cardCover} >
              <img onClick={onClickHandler} src={cover} alt={cover} />
            </div>
          ) : null
        }

        <div className={styles.closeWindowBtn}>
          <IconButton onClick={setIsCardWindowOpen}><BsXLg /></IconButton>
        </div>
        <div className={styles.cardWindowContent}>
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
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.windowMain}>
              <ItemsContainer data={labels} title={'Etykiety'}>
                {
                  labels.map((label: { title: string; active: any; color: any; _id: string }) => (
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
              <ItemsContainer data={deadline} title={'Termin'}>
                {
                  deadline ? (
                    <>
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={handleChangeCompleted}
                        style={{ height: '100%', width: '1rem', marginRight: '8px' }} />
                      <button onClick={() => setDateTrigger(true)}
                        className={styles.selectedDateBtn}>
                        <span>{dayjs(deadline).format('DD-MM-YYYY HH:mm')}</span>
                        {
                          dateIsSameOrBefore && !completed ? (
                            <span
                              title={cardDateDisplay.title}
                              style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.datedateNotificationSpan}>
                              {cardDateDisplay.name}
                            </span>
                          ) : null
                        }
                        {
                          deadlineIsSoon && !completed ? (
                            <span
                              title={cardDateDisplay.title}
                              style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.datedateNotificationSpan}>
                              {cardDateDisplay.name}
                            </span>
                          ) : null
                        }
                        {
                          completed ? (
                            <span
                              title={cardDateDisplay.title}
                              style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.datedateNotificationSpan}>
                              {cardDateDisplay.name}
                            </span>
                          ) : null
                        }

                      </button>
                    </>
                  ) : null
                }
              </ItemsContainer>
              <div className={styles.descriptionContainer}>
                <div className={styles.descriptionHeader}>
                  <h4>Opis</h4>
                  <div style={{ maxWidth: '100px', marginLeft: '1rem' }}>
                    {
                      !formIsOpen && cardDescription !== undefined && cardDescription !== '' ? (
                        <TaskButton onClick={() => setFormIsOpen(true)} name={'Edytuj'} icon={<BsPencil />} />
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
                      titleBtn={'Zapisz'}
                    /> :
                    <div>
                      {cardDescription !== '' && cardDescription !== undefined ? <p onClick={() => setFormIsOpen(true)}>{cardDescription}</p> :
                        <TaskButton onClick={() => setFormIsOpen(true)} name={'Dodaj opis...'} icon={<IoMdAdd />} />}
                    </div>
                }
              </div>
              <ItemsContainer data={files} title={'Załącznik'}>
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
                        deleteFile={() => handleDeleteFile(file._id)}
                        downloadFile={() => handleDownloadFile(file.fileUrl)}
                        selectCover={() => handleSelectCover(index)}
                      />
                    ))
                  }
                </div>
              </ItemsContainer>
            </div>
            <div className={styles.cardSidebar} >
              <Popup
                title={isOpenLabelEditWindow ? 'Edytuj etykietę' : isOpenAddNewLabelWindow ? 'Dodaj Etykietę' : 'Etykiety'}
                trigger={labelsTrigger}
                closePopup={() => { setLabelsTrigger(false); setIsOpenLabelEditWindow(false); setIsOpenAddNewLabelWindow(false) }}
                isEditWindow={isOpenLabelEditWindow || isOpenAddNewLabelWindow}
                backToMainWindow={() => { setIsOpenLabelEditWindow(false); setIsOpenAddNewLabelWindow(false) }}
              >
                <div className={styles.labels}>
                  {
                    !isOpenLabelEditWindow &&
                      !isOpenAddNewLabelWindow ? (
                      <>
                        <div className={styles.labelsList}>
                          {
                            boardLabels.map((label: LabelsInterface) => (
                              <Label
                                key={label._id}
                                labelId={label._id}
                                title={label.title}
                                color={label.color}
                                cardLabels={labels}
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
                        <TaskButton onClick={() => setIsOpenAddNewLabelWindow(true)} name={'Utwórz nową etykietę'} />
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
                title={'załącznik'}
                trigger={fileTrigger}
                closePopup={() => setFileTrigger(false)}
                backToMainWindow={() => setFileTrigger(false)}
              >
                <FileForm
                  name={'załącznik'}
                  size={0}
                  label={'załącznik'}
                  type={'file'}
                  nameFiles={selectedNameFiles}
                  handleInputState={handleUploadImage}
                  handleSubmitFile={handleSubmitFile}
                />{
                  uploadProgress > 0 ? (
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
                title={'magazyn'}
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
              <TaskButton onClick={() => setStorageTrigger(true)} name={'Marazyn'} icon={<BiTask />} />
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