import React from 'react'
import styles from './styles.module.scss'
import dayjs from 'dayjs'
import pl from "date-fns/locale/pl"
import DatePicker, { registerLocale } from "react-datepicker"
import Popup from 'components/common/Popup/Popup'
import Button from 'components/common/Button/Button'

import { useUpdateBoardMutation } from 'store/api/boards'
import { useUpdateCardMutation } from "store/api/cards"

interface DatePopupProps {
  cardId: string
  boardId: string
  trigger: boolean
  cardDeadline: Date | null
  setTrigger: (value: boolean) => void
  setCardDeadline: (value: Date | null) => void
}

const DatePopup: React.FC<DatePopupProps> = ({
  cardId,
  boardId,
  cardDeadline,
  setCardDeadline,
  trigger,
  setTrigger,
}) => {

  dayjs.locale('pl');
  registerLocale("pl", pl);

  const [updateCard] = useUpdateCardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  const handleSaveDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    updateCard({
      _id: cardId,
      deadline: cardDeadline
    })
    updateBoard({ _id: boardId })
    setTrigger(false)
  }

  const handleDeleteDeadline = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    setCardDeadline(null)
    updateCard({
      _id: cardId,
      deadline: null
    })
    updateBoard({ _id: boardId })
    setTrigger(false)
  }

  return (
    <Popup
      title={'Data'}
      trigger={trigger}
      closePopup={() => setTrigger(false)}
      backToMainWindow={() => setTrigger(false)}
    >
      <DatePicker
        dateFormat='DD/MM/YYYY'
        timeFormat="hh:mm"
        locale="pl"
        selected={cardDeadline}
        onChange={(date: Date) => setCardDeadline(date)}
        inline
        showTimeInput
        timeInputLabel={`Godzina:`}
      />
      <label>Termin <br></br>
        <input
          style={{ maxWidth: '100px', marginRight: '10px' }}
          placeholder={dayjs(cardDeadline ? cardDeadline : new Date()).format('DD/MM/YYYY')} />
        <input
          style={{ maxWidth: '100px' }}
          placeholder={dayjs(cardDeadline ? cardDeadline : new Date()).format('HH:mm')} />
      </label>
      <div className={styles.actionsForm}>
        <Button
          onClick={handleSaveDeadline}
          title={'Zapisz'}
          type={'button'}
          style={{ marginRight: '1rem' }} />
        <Button
          onClick={handleDeleteDeadline}
          title={'Usuń'}
          type={'reset'} />
      </div>
    </Popup>
  )
}

export default DatePopup