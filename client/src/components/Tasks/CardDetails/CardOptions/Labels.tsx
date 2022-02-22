import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { BiCheck } from 'react-icons/bi';

import {
  useGetCardQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../../store/reducers/cardsReducer";
import { useUpdateBoardMutation } from '../../../../store/reducers/boardsReducer'

const colors = [
  {
    id: 0,
    color: '#FB8B24',
    title: 'gggggjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
    active: false
  },
  {
    id: 1,
    color: '#9575cd',
    title: '',
    active: false
  },
  {
    id: 2,
    color: '#F36935',
    title: '',
    active: false
  },
  {
    id: 3,
    color: '#EA4746',
    title: '',
    active: false
  },
  {
    id: 4,
    color: '#AE0366',
    title: '',
    active: false
  },
]

type Props = {
  boardId: string
  cardId: string
  // labels: []
}

const Labels: React.FC<Props> = ({ boardId, cardId }) => {
  const { data: card, error, isLoading } = useGetCardQuery(cardId)
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()

  const [labels, setLabels] = useState([] as any)

  const [status, setStatus] = useState(false)

  useEffect(() => {
    if (card) {
      const newCard = { ...card }
      setLabels(newCard.labels)
    }
  }, [])

  const selectItem = (item: any) => {
    const newLabels = [...labels]
    if (labels) {
      const newState = newLabels.map((label: any) => {
        if (label !== item) return label;
        return { ...label, active: !label.active };
      });
      setLabels(newState)
      updateCard({
        id: cardId,
        labels: newState
      })
    }
  }

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>Brak połączenia</h2>

  return (
    <div className={styles.container}>
      <h4>Etykiety</h4>
      <ul>
        {
          labels?.map((label: { id?: number, color?: any; title?: any; active: boolean; }, index: React.Key | null | undefined) => (
            <li onClick={() => selectItem(label)} key={index} style={{ background: `${label.color}` }} className={styles.boxColor}>
              <p>{label.title}</p>
              {label.active ? < BiCheck style={{ color: 'white' }} /> : null}
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Labels


// const Labels: React.FC = () => {

//   const [select, setSelect] = useState(false)

//   const selectItem = (e: any, item: any) => {
//     setSelect(prev => !prev)
//     const change = item.active === false ? true : false
//     item.active = change
//     console.log(select)
//   }

//   return (
//     <div className={styles.container}>
//       <h4>Etykiety</h4>
//       <ul>
//         {
//           colors.map((item, index) => (
//             <li onClick={(e) => selectItem(e, item)} key={index} style={{ background: `${item.color}` }} className={styles.boxColor}>
//               <p>{item.title}</p>
//               <div>{item.active ? < BiCheck /> : null}</div>
//             </li>
//           ))
//         }
//       </ul>
//     </div>
//   )
// }