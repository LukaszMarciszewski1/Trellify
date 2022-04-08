import React, { useCallback, useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import storage from '../../../../../config/firebase'

type Props = {
  name: string
  size: number
  label: string
  type: string
  // value: string
  handleInputState: (value: any) => void
}

const FileForm: React.FC<Props> = ({ name, size, label, type, handleInputState, ...rest }) => {
  const inputRef = useRef()
  const [progress, setProgress] = useState<number>(0)
  const [progressShow, setProgressShow] = useState<boolean>(false)

  // const handleInputState = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.currentTarget.files !== null) {
  //       const file = e.currentTarget.files[0];
  //     }
  //   },
  //   [],
  // );

  const handleUpload = () => {

  }

  return (
    <div >
      <h1>React File Upload</h1>
      <input
        type={type}
        name={name}
        // value={value}
        onChange={handleInputState}
        multiple
        {...rest}
      />
      <button
        type="button"
        onClick={() => console.log('click')}>
        {label}
      </button>
    </div>
  )
}

export default FileForm