import React from 'react'
import styles from './styles.module.scss'

import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'

const toDoTask:React.FC = () => {
  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          <Task />
          <Task />
          <Task />
          <Task />
          <Task />
        </TabsContent>
        <TabsContent title="Zrobione">Zrobione</TabsContent>
        <TabsContent title="Dodaj zadanie">Dodaj zadanie</TabsContent>
      </Tabs>
    </div>
  )
}

export default toDoTask
