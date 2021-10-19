import React from 'react'

type Props = {
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
}

const Form: React.FC<Props> = ({handleChange, handleSubmit}) => {

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange}  type='text'></input>
      <button type='submit'>dodaj</button>
    </form>
  )
}

export default Form
