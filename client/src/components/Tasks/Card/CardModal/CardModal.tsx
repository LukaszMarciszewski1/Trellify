import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios';
import styles from './styles.module.scss'
import dayjs from 'dayjs';
import fileDownload from 'js-file-download'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import minMax from 'dayjs/plugin/minMax';
import updateLocale from 'dayjs/plugin/updateLocale'
import duration from 'dayjs/plugin/duration'
import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import storage from '../../../../config/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


import TextareaAutosize from 'react-textarea-autosize';

import TaskForm from '../../TaskForm/TaskForm'
import IconButton from '../../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../../hooks/useOnClickOutside'
import { isFileImage } from '../../../../hooks/isFileImage'

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
} from '../../../../store/reducers/boardsReducer'

import {
  useGetCardQuery,
  // useGetCardFilesQuery,
  useDeleteCardMutation,
  useUpdateCardMutation,
  // useUploadFilesCardMutation,
  // useDeleteFileMutation,
} from "../../../../store/reducers/cardsReducer";

import {
  useGetAllFilesQuery,
  useGetFileQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} from '../../../../store/reducers/filesReducer'

// import { GrAdd } from 'react-icons/gr';
import TaskButton from '../../TaskButton/TaskButton';
import Popup from '../../../Details/Popup/Popup';
import Label from './CardModalDetails/Label/Label';
import { BiCheck } from 'react-icons/bi';
// import { labelItems } from '../localData';

import ItemsContainer from './CardModalDetails/ItemsContainer/ItemsContainer'
import LabelForm from './CardModalDetails/LabelForm/LabelForm'
import Button from '../../../Details/Button/Button';

import FileForm from './CardModalDetails/FileForm/FileForm'
import Files from './CardModalDetails/Files/Files';

import { Line as ProgressLine } from 'rc-progress';
import { File as FileResponse } from '../../../../models/file'

type Props = {
  cardId: string
  title: string
  description: string
  boardId: string
  nameList: string | undefined
  cardDeadline: Date | null
  cardLabels: any
  cardFiles: any
  cardCompleted: boolean
  dateIsSameOrBefore: boolean
  deadlineIsSoon: boolean
  cardCover: string | undefined
  cardFileIndex: number
  cardDateDisplay: {
    style: {
      backgroundColor: string
    },
    title: string
    name: string
  }
  setIsCardWindowOpen: () => void
  setCardCompleted: (value: any) => void
  setCardDeadline: (value: any) => void
  setCardLabels: (value: any) => void
  setCardCover: (value: any) => void
  setCardFileIndex: (value: any) => void
}

const CardModal: React.FC<Props> = ({
  cardId,
  title,
  boardId,
  nameList,
  description,
  cardLabels,
  cardDeadline,
  cardCompleted,
  setCardDeadline,
  setCardCompleted,
  setIsCardWindowOpen,
  setCardLabels,
  dateIsSameOrBefore,
  deadlineIsSoon,
  cardDateDisplay,
  cardFiles,
  cardCover,
  setCardCover,
  setCardFileIndex,
  cardFileIndex
}) => {
  dayjs.locale('pl');
  const { data: board, error, isLoading } = useGetBoardQuery(boardId);

  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [uploadFiles] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const refWindow = useRef(null)
  const [cardTitle, setCardTitle] = useState<string>(title)
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [labels, setLabels] = useState([] as any)
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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNameFiles, setSelectedNameFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null)

  const url = 'http://localhost:5000/'
  // const url = 'https://lukas-backend.herokuapp.com/'


  useEffect(() => {
    if (board) {
      setLabels(board.labels)
    }
  }, [board])

  console.log(selectedFiles)


  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-title') setCardTitle(e.target.value)
    updateCard({
      _id: cardId,
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
      _id: cardId,
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
        _id: boardId,
        labels: newLabelState
      })
      setIsOpenLabelEditWindow(false)
    }
  }

  const handleAddNewLabel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    const newLabels = [...labels, { color: currentLabelColor, title: labelTitle, active: false }]
    updateBoard({
      _id: boardId,
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
        _id: cardId,
        labels: newLabels
      })
    } else {
      const newLabels = [...copyCardLabels, newLabel]
      setCardLabels(newLabels)
      updateCard({
        _id: cardId,
        labels: newLabels
      })
    }
    updateBoard({
      _id: boardId,
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
      _id: cardId,
      labels: newCardLabelsState
    })
    updateBoard({
      _id: boardId,
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
      _id: cardId,
      deadline: cardDeadline
    })
    updateBoard({ _id: boardId })
    setDateTrigger(false)
  }

  const handleDeleteDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    setCardDeadline(null)
    updateCard({
      _id: cardId,
      deadline: null
    })
    updateBoard({ _id: boardId })
    setDateTrigger(false)
  }

  const handleChangeCompleted = () => {
    setCardCompleted(!cardCompleted);
    updateCard({
      _id: cardId,
      completed: !cardCompleted
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
  },
    [],
  );

  const uploadFileOptions = {
    headers: {
      'content-type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
      const { loaded, total } = progressEvent;
      const percent = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setUploadProgress(percent);
    }
  }

  const handleSubmitFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!selectedFiles.length) return;
    const formData = new FormData();
    formData.append('cardId', cardId)
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    await axios.post(`${url}files`, formData, uploadFileOptions)
      .then(res => {
        updateCard({
          _id: cardId,
        })
        updateBoard({
          _id: boardId
        })
        setUploadStatus(true)
        setTimeout(() => {
          setUploadProgress(0)
          setSelectedNameFiles([])
          setFileTrigger(false)
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
        setUploadStatus(false)
      })
  }

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId)
    updateCard({
      _id: cardId,
      files: cardFiles
    })
    updateBoard({
      _id: boardId
    })
    if (cardFiles.length) {
      setCardCover(cardFiles[0].fileUrl)
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

  useOnClickOutside(refWindow, setIsCardWindowOpen)

  const onClickHandler = () => {
    // setSelected(id); 
    // const newWindow = window.open(`${cardCover}`, "_blank", 'noopener,noreferrer');
    // if (newWindow) newWindow.opener = null
  }



  const handleSelectCover = (index: number) => {
    setCardFileIndex(index)
    setCardCover(cardFiles[index].fileUrl)
    updateCard({
      _id: cardId,
      cover: cardFiles[index].fileUrl
    })
    updateBoard({
      _id: boardId
    })
  }

  return (
    <>
      <div className={styles.overlay} onClick={setIsCardWindowOpen}></div>
      <div ref={refWindow} className={styles.cardWindow}>
        {
          cardCover && isFileImage(cardCover) ? (
            <div className={styles.cardCover} >
              <img onClick={onClickHandler} src={cardCover} alt={cardCover} />
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
              <ItemsContainer data={cardDeadline} title={'Termin'}>
                {
                  cardDeadline ? (
                    <>
                      <input
                        type="checkbox"
                        checked={cardCompleted}
                        onChange={handleChangeCompleted}
                        style={{ height: '100%', width: '1rem', marginRight: '8px' }} />
                      <button onClick={() => setDateTrigger(true)}
                        className={styles.selectedDateBtn}>
                        <span>{dayjs(cardDeadline).format('DD-MM-YYYY HH:mm')}</span>
                        {
                          dateIsSameOrBefore && !cardCompleted ? (
                            <span
                              title={cardDateDisplay.title}
                              style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.datedateNotificationSpan}>
                              {cardDateDisplay.name}
                            </span>
                          ) : null
                        }
                        {
                          deadlineIsSoon && !cardCompleted ? (
                            <span
                              title={cardDateDisplay.title}
                              style={{ backgroundColor: cardDateDisplay.style.backgroundColor }} className={styles.datedateNotificationSpan}>
                              {cardDateDisplay.name}
                            </span>
                          ) : null
                        }
                        {
                          cardCompleted ? (
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
              <ItemsContainer data={cardFiles} title={'Załącznik'}>
                <div className={styles.filesContainer}>
                  {
                    cardFiles?.map((file: { _id: string; fileName: string; createdAt: string; fileUrl: string; fileType: string }, index: number) => (
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
                  selected={cardDeadline ? new Date(cardDeadline) : null}
                  onChange={(date: Date) => setCardDeadline(date)}
                  inline
                  showTimeInput
                />
                <label>Termin <br></br>
                  <input style={{ maxWidth: '100px', marginRight: '10px' }} placeholder={dayjs(cardDeadline).format('DD/MM/YYYY')} />
                  <input style={{ maxWidth: '100px' }} placeholder={dayjs(cardDeadline).format('HH:mm')} />
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
                  handleInputState={handleUploadImage} handleSubmitFile={handleSubmitFile}
                />{
                  uploadProgress > 0 ? (
                    <>
                      {uploadStatus !== null ? (<ProgressLine percent={uploadProgress} strokeWidth={4} strokeColor="#D3D3D3" />) : null}
                      {uploadStatus === false ?
                        <p style={{ color: 'red' }}>Błąd przesyłania<small> (max 10mb, lub nieprawidłowy format pliku)</small></p>
                        : `${uploadProgress}%`}
                    </>
                  ) : null
                }
              </Popup>
              <TaskButton onClick={() => setLabelsTrigger(true)} name={'Etykiety'} icon={<MdOutlineLabel />} />
              <TaskButton onClick={() => setDateTrigger(true)} name={'Data'} icon={<BsStopwatch />} />
              <TaskButton onClick={() => setFileTrigger(true)} name={'Załącznik'} icon={<GrAttachment />} />
              <TaskButton onClick={() => setFormIsOpen(true)} name={'Marazyn'} icon={<BiTask />} />
              <div className={styles.divider}></div>
              <TaskButton onClick={() => {
                deleteCard(cardId);
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