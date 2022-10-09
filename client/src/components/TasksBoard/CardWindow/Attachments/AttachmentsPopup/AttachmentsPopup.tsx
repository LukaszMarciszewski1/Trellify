import React, { useState, useCallback } from 'react'
import styles from './styles.module.scss'
import axios from 'axios'
import { Line as ProgressLine } from 'rc-progress'
import Popup from 'components/common/Popup/Popup'
import AttachmentForm from '../AttachmentForm/AttachmentForm'

import { useUpdateBoardMutation } from 'store/api/boards'
import { useUpdateCardMutation } from "store/api/cards"

interface AttachmentPopupProps {
  cardId: string
  boardId: string
  trigger: boolean
  setTrigger: (value: boolean) => void
}

const AttachmentPopup: React.FC<AttachmentPopupProps> = ({ cardId, boardId, trigger, setTrigger }) => {
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNameFiles, setSelectedNameFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null)

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
    formData.append('cardId', cardId)
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
          _id: cardId,
        })
        updateBoard({
          _id: boardId
        })
        setUploadStatus(true)
        setTimeout(() => {
          setUploadProgress(0)
          setSelectedNameFiles([])
          setTrigger(false)
        }, 500)
      })
      .catch((error) => {
        console.log(error)
        setUploadStatus(false)
      })
  }

  return (
    <Popup
      title={'Załączniki'}
      trigger={trigger}
      closePopup={() => setTrigger(false)}
      backToMainWindow={() => setTrigger(false)}
    >
      <AttachmentForm
        name={'załączniki'}
        size={0}
        label={'załączniki'}
        type={'file'}
        listNames={selectedNameFiles}
        handleInputState={handleUploadFiles}
        handleSubmitFiles={handleSubmitFiles}
      />
      {uploadProgress > 0 ? (
        <>
          {
            uploadStatus !== null && uploadStatus === true ? (
              <div>
                <ProgressLine percent={uploadProgress} strokeWidth={4} strokeColor="#D3D3D3" />
                <p>{uploadProgress}%</p>
              </div>
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
  )
}

export default AttachmentPopup