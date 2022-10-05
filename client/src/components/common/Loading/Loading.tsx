import React from 'react'
import MoonLoader from "react-spinners/MoonLoader";
import styles from './styles.module.scss'
const Loading = () => {
  return (
  <div className={styles.loadingContainer}>
     <MoonLoader size={40}/>
  </div>
  )
}

export default Loading