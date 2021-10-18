import React, { useCallback } from "react"
import styles from './styles.module.scss'

type Props = {
  title: string
  index: number
  active: number
  setSelectedTab: (index: number) => void
}

const Tab: React.FC<Props> = ({ title, setSelectedTab, active, index }) => {

  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <li>
      <button 
        className={
          `${styles.tab} ${index === active ? styles.active : styles.tab}`
        }
        onClick={onClick}>
        {title}
      </button>
    </li>
  )
}

export default Tab