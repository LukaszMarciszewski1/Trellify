import React from 'react'
import styles from './styles.module.scss'
import Button from 'components/common/Button/Button'

interface AttachmentFormProps {
  name: string
  size: number
  label: string
  type: string
  listNames: string[]
  handleSubmitFiles: (value: any) => void
  handleInputState: (value: any) => void
}

const AttachmentForm: React.FC<AttachmentFormProps> = ({
  name,
  listNames,
  type,
  handleInputState,
  handleSubmitFiles
}) => {

  return (
    <div >
      <form className={styles.attachmentForm}>
        <label id={"formId"} className={styles.inputContainer}>
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
        <div className={styles.listContainer}>
          {
            listNames.map((name, index) => (
              <span
                key={index}
                className={styles.nameFileSpan}>
                {name}
              </span>
            ))
          }
        </div>
        {
          listNames.length ? (
            <Button
              title={"Załącz"}
              type={'submit'}
              onClick={handleSubmitFiles} />
          ) : null
        }
      </form>
    </div>
  )
}

export default AttachmentForm