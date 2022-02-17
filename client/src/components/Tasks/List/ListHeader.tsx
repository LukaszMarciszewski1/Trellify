import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

type Props = {
  listTitle: string
  toggleState?: () => void
}

const ListHeader: React.FC<Props> = ({ listTitle }) => {
  return (
    <div></div>
    //   <div className={styles.listHeader} onClick={() => setIsOpen(true)} ref={ref}>
    //   {
    //     !isOpen ? <h2>{listTitle}</h2> : 
    //     <TextareaAutosize
    //       id='list'
    //       autoFocus={true}
    //       value={listTitle}
    //       className={styles.textarea}
    //       onChange={handleEditListTitle}
    //       onFocus={(e) => e.target.select()}
    //       required
    //     />
    //   }
    //   <IconButton onClick={onClickDelete} title={''} ><BsThreeDots style={{ fontSize: "1.3em" }} /></IconButton>
    // </div>
  )
}

export default ListHeader