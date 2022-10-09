import React from 'react'
import styles from './styles.module.scss'
import { isFileImage } from 'hooks/useIsFileImage'

interface CoverProps {
  cover: string
}

const Cover: React.FC<CoverProps> = ({ cover }) => {
  const onClickHandler = () => {
    const newWindow = window.open(`${cover}`, "_blank", 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
  }
  return (
    <>
      {
        cover && isFileImage(cover) ? (
          <div className={styles.cardCover} >
            <img onClick={onClickHandler} src={cover} alt={cover} />
          </div>
        ) : null
      }
    </>
  )
}

export default Cover