import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.scss'
import "react-datepicker/dist/react-datepicker.css"
import DatePicker, { registerLocale } from "react-datepicker"
import axios from 'axios'
import dayjs from 'dayjs'
import fileDownload from 'js-file-download'
import { Line as ProgressLine } from 'rc-progress'
import pl from "date-fns/locale/pl"

import {
  useGetBoardQuery,
  useUpdateBoardMutation,

} from 'store/api/boards'
import {
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "store/api/cards"
import {
  useDeleteFileMutation
} from 'store/api/files'

import { Card as CardModel } from 'models/card'
import { Labels as LabelsInterface } from 'models/labels'

import useOnClickOutside from 'hooks/useOnClickOutside'
import { isFileImage } from 'hooks/useIsFileImage'

import TextareaAutosize from 'react-textarea-autosize'
import TaskButton from '../../common/TaskButton/TaskButton'
import Popup from '../../common/Popup/Popup'

import Labels from './Labels/LabelsList/LabelsList'
import LabelsPopup from './Labels/LabelsPopup/LabelsPopup'
import DeadlineDate from './Date/DeadlineDate/DeadlineDate'
import DatePopup from './Date/DatePopup/DatePopup'
import Description from './Description/Description'
import Attachments from './Attachments/AttachmentsList/AttachmentsList'
import AttachmentsPopup from './Attachments/AttachmentsPopup/AttachmentsPopup'

import Container from './Container/Container'
import Modal from '../../common/Modal/Modal'
import UsedProducts from './UsedProducts/UsedProducts'
import MaterialsList from './UsedProducts/MaterialsList/MaterialsList'

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

  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [cardTitle, setCardTitle] = useState<string>(title)

  //triggers
  const [labelsTrigger, setLabelsTrigger] = useState(false)
  const [dateTrigger, setDateTrigger] = useState(false)
  const [fileTrigger, setFileTrigger] = useState(false)
  const [valuationTrigger, setValuationTrigger] = useState(false)
  const [storageTrigger, setStorageTrigger] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNameFiles, setSelectedNameFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null)

  const [cardDeadline, setCardDeadline] = useState<Date | null>(deadline ? new Date(deadline) : new Date())
  const [cardDescription, setCardDescription] = useState<string>(description)
  const [boardLabels, setBoardLabels] = useState<any>([])
  const [cardLabels, setCardLabels] = useState<LabelsInterface[]>(labels)

  const refModal = useRef(null)

  useEffect(() => {
    if (board) {
      setBoardLabels(board.labels)
    }
  }, [board])

  const handleEditCardTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card-title') {
      setCardTitle(e.target.value)
      updateCard({
        _id: _id,
        title: e.target.value
      })
      updateBoard({
        _id: boardId
      })
    }
  }


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
    const result = window.confirm("Usunąć plik?")
    if (!result) return
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
    axios.get(fileUrl, {
      responseType: 'blob',
    })
      .then((res) => {
        let filename = fileUrl.replace(/^.*[\\\/]/, '')
        let fileExtension;
        fileExtension = fileUrl.split('.');
        fileExtension = fileExtension[fileExtension.length - 1];
        fileDownload(res.data, `${filename}.${fileExtension}`);
      })
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


  const onClickHandler = () => {
    const newWindow = window.open(`${cover}`, "_blank", 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
  }


  useOnClickOutside(refModal, setIsCardWindowOpen)

  return (
    <Modal trigger={true} closeModal={setIsCardWindowOpen}>
      <div className={styles.container}>
        {
          cover && isFileImage(cover) ? (
            <div className={styles.cardCover} >
              <img onClick={onClickHandler} src={cover} alt={cover} />
            </div>
          ) : null
        }
        <div className={styles.titleContainer}>
          <div className={styles.cardModalHeaderTextarea}>
            <TextareaAutosize
              id='card-title'
              autoFocus={false}
              value={cardTitle}
              className={styles.cardModalTextareaTitle}
              onChange={handleEditCardTitle}
              onFocus={(e) => e.target.select()}
              rows={20}
              maxRows={4}
              required
            />
            <p>Na liscie: <strong>{nameList}</strong></p>
          </div>
        </div>
        <div className={styles.groupWrapper}>
          <div className={styles.content}>
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
              setDateTrigger={() => setDateTrigger(true)}
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
              setTrigger={setStorageTrigger}
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

          <div className={styles.cardModalSidebar} >
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
              trigger={fileTrigger}
              setTrigger={setFileTrigger}
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
            <Popup
              title={'Wykorzystane materiały'}
              trigger={storageTrigger}
              closePopup={() => setStorageTrigger(false)}
            >
              <UsedProducts
                cardId={_id}
                boardId={boardId}
                usedProducts={usedProducts} />
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
              onClick={() => setFileTrigger(true)}
              name={'Załącznik'}
              icon={<GrAttachment />} />
            <TaskButton
              onClick={() => setStorageTrigger(true)}
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