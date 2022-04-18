import React, { useCallback, useRef, useState } from 'react'
import { Line } from 'rc-progress';
import styles from './styles.module.scss'

import storage from '../../../../../config/firebase'
import Button from '../../../../Details/Button/Button'

type Props = {
  name: string
  size: number
  label: string
  type: string
  nameFiles: string[]
  handleSubmitFile: (value: any) => void
  handleInputState: (value: any) => void
}

const FileForm: React.FC<Props> = ({ name, size, nameFiles, label, type, handleInputState, handleSubmitFile, ...rest }) => {
  const inputRef = useRef()
  const [progress, setProgress] = useState<number>(0)

  const uploadOptions =  {
    onUploadProgress: (progressEvent: { loaded: any; total: any; }) => {
      const {loaded, total} = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
  }
  }

  return (
    <div >
      <form className={styles.formFile}>
        <label id={"formId"} className={styles.labelFile}>
          <input
            id={"formId"}
            type={type}
            name={name}
            onChange={handleInputState}
            multiple
            hidden
            {...rest}
          />
          Dodaj załączniki
        </label>
        <div className={styles.spanContainer}>
          {
            nameFiles.map((name, index) => (
              <span key={index} className={styles.nameFileSpan}>{name}</span>
            ))
          }
        </div>
        {/* <Line percent:number="10" strokeWidth="4" strokeColor="#D3D3D3" /> */}
        {
          nameFiles.length ? (
            <Button onClick={handleSubmitFile} title={"Załącz"} type={'submit'} />
          ) : null
        }
      </form>
    </div>
  )
}

export default FileForm