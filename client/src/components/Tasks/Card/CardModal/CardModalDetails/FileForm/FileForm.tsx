import React from 'react'
import { Line } from 'rc-progress';
import styles from './styles.module.scss'
import Button from '../../../../../Details/Button/Button'
interface FileFormProps {
  name: string
  size: number
  label: string
  type: string
  listNames: string[]
  handleSubmitFiles: (value: any) => void
  handleInputState: (value: any) => void
}

const FileForm: React.FC<FileFormProps> = ({ name, listNames, type, handleInputState, handleSubmitFiles }) => {

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
          />
          Dodaj załączniki
        </label>
        <div className={styles.spanContainer}>
          {
            listNames.map((name, index) => (
              <span key={index} className={styles.nameFileSpan}>{name}</span>
            ))
          }
        </div>
        {
          listNames.length ? (
            <Button onClick={handleSubmitFiles} title={"Załącz"} type={'submit'} />
          ) : null
        }
      </form>
    </div>
  )
}

export default FileForm