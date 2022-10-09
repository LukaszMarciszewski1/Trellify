import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import fileDownload from 'js-file-download'
import Container from '../../Container/Container'
import Attachment from '../Attachment/Attachment'

import { useUpdateBoardMutation } from 'store/api/boards'
import { useUpdateCardMutation } from "store/api/cards"
import { useDeleteFileMutation } from 'store/api/files'

interface AttachmentsListProps {
  cardId: string
  boardId: string
  files: any
  cardFileIndex: number
  setCardCover: (value: string) => void
  setCardFileIndex: (value: number) => void
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  cardId,
  boardId,
  files,
  cardFileIndex,
  setCardCover,
  setCardFileIndex
}) => {
  dayjs.locale('pl');
  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleDeleteFile = (fileId: string) => {
    const result = window.confirm("Usunąć plik?")
    if (!result) return
    deleteFile(fileId)
    updateCard({
      _id: cardId,
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
      _id: cardId,
      cover: files[index].fileUrl
    })
    updateBoard({
      _id: boardId
    })
  }

  return (
    <Container data={files} title={'Załączniki'}>
      {
        files?.map((file: {
          _id: string;
          fileName: string;
          createdAt: string;
          fileUrl: string;
          fileType: string
        },
          index: number
        ) => (
          <Attachment
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
    </Container>
  )
}

export default AttachmentsList