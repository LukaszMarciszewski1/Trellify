import React from 'react'
import TaskButton from '../../../TaskButton/TaskButton'
import styles from './styles.module.scss'

type Props = {
  title: string,
  src: string,
  created: string,
  deleteFile: () => void
  downloadFile: () => void
}

const Files: React.FC<Props> = ({ created, title, src, deleteFile, downloadFile }) => {
  return (
    <div className={styles.conatiner}>
      <div className={styles.fileImg}>
        <img src={src} className="card-img-top img-responsive" alt="img" />
      </div>
      <div className={styles.fileDetails}>
        <h4>{title}</h4>
        <span>{created}</span>
        <div className={styles.fileButtons}>
          <TaskButton height={'25px'} margin={'0 8px 0 0'} onClick={deleteFile} name={'Skasuj'} />
          <TaskButton height={'25px'} margin={'0'} onClick={downloadFile} name={'Pobierz'} />
        </div>
      </div>
    </div>
  )
}

export default Files