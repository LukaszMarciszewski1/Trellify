import React from 'react'
import styles from './styles.module.scss'
import { Labels as LabelModel } from 'models/labels'
import Container from '../../Container/Container'


interface LabelsProps {
  cardLabels: LabelModel[]
  setLabelsTrigger: (value: boolean) => void
}

const Labels: React.FC<LabelsProps> = ({ cardLabels, setLabelsTrigger }) => {
  return (
    <Container data={cardLabels} title={'Etykiety'}>
      {
        cardLabels.map((label: { title: string; active: boolean; color: string; _id: string }) => (
          <div
            key={label._id}
            style={{ backgroundColor: `${label.color}` }}
            className={styles.labelsList}
            onClick={() => setLabelsTrigger(true)}
          >
            <span>{label.title}</span>
          </div>
        ))
      }
    </Container>
  )
}

export default Labels