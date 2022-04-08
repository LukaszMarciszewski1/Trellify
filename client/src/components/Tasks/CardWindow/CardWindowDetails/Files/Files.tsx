import React from 'react'
import TaskButton from '../../../TaskButton/TaskButton'
import styles from './styles.module.scss'

type Props = {
  title: string,
  src: string,
  created: string,
  deleteFile: () => void
}

const Files: React.FC<Props> = ({ created, title, src, deleteFile }) => {
  return (
    <div className={styles.conatiner}>
      <div className={styles.fileImg}>
        <img src={src} className="card-img-top img-responsive" alt="img" />
      </div>
      <div className={styles.fileDetails}>
        <h4>{title}</h4>
        <span>{created}</span>
        <div className={styles.fileButton}>
          <TaskButton onClick={deleteFile} name={'Skasuj'} />
        </div>
      </div>
    </div>
  )
}

export default Files