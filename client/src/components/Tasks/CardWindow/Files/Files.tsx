import React from 'react'
import styles from './styles.module.scss'
import { isFileImage } from 'hooks/useIsFileImage'
import TaskButton from 'components/common/TaskButton/TaskButton'

interface FileProps {
  title: string
  src: string
  created: string
  index: number
  active: number
  type: string
  handleDeleteFile: () => void
  handleDownloadFile: () => void
  handleSelectCover: () => void
}

const Files: React.FC<FileProps> = ({ created, title, src, type, index, active, handleDeleteFile, handleDownloadFile, handleSelectCover }) => {
  const fileExtension = type.split('/').pop();

  return (
    <div className={styles.container} >
      <div className={styles.fileImg}>
        {
          isFileImage(src) ? (
            <>
              <img src={src} className="card-img-top img-responsive" alt="img" />
              <div className={styles.selectCover} title='ustaw okładkę'>
                <input
                  type="checkbox"
                  checked={active === index ? true : false}
                  onChange={handleSelectCover}
                  style={{ height: '100%', width: '1rem', marginRight: '8px' }} />
              </div>
            </>
          ) : (<p>{fileExtension}</p>)
        }
      </div>
      <div className={styles.fileDetails}>
        <h4>{title}</h4>
        <span>{created}</span>
        <div className={styles.fileButtons}>
          <TaskButton style={{height:'25px', margin:'0 8px 0 0'}} onClick={handleDeleteFile} name={'Skasuj'} />
          <TaskButton style={{height:'25px', margin:'0'}} onClick={handleDownloadFile} name={'Pobierz'} />
        </div>
      </div>
    </div>
  )
}

export default Files