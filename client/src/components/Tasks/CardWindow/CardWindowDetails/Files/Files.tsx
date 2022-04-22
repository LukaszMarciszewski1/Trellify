import React, { useCallback } from 'react'
import styles from './styles.module.scss'
import { isFileImage } from '../../../../../hooks/isFileImage'
import TaskButton from '../../../TaskButton/TaskButton'

type Props = {
  title: string,
  src: string,
  created: string,
  index: number,
  active: number,
  type: string,
  deleteFile: () => void
  downloadFile: () => void
  selectCover: () => void
}

const Files: React.FC<Props> = ({ created, title, src, type, index, active, deleteFile, downloadFile, selectCover }) => {
const fileExtension = type.split('/').pop();

  return (
    <div className={styles.container} >
      <div className={styles.fileImg}>
        {
          isFileImage(src) ? (
            <>
              <img src={src} className="card-img-top img-responsive" alt="img" />
              <div className={styles.selectCover}>
                <input
                  type="checkbox"
                  checked={active === index ? true : false}
                  onChange={selectCover}
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
          <TaskButton height={'25px'} margin={'0 8px 0 0'} onClick={deleteFile} name={'Skasuj'} />
          <TaskButton height={'25px'} margin={'0'} onClick={downloadFile} name={'Pobierz'} />
        </div>
      </div>
    </div>
  )
}

export default Files