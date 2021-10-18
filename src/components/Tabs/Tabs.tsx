import React, { ReactElement, useState } from "react"
import Tab from "./Tab/Tab"
import styles from './styles.module.scss'

type Props = {
  children: ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div>
      <ul className={styles.tabContainer}>
        {children.map((item, index) => (
          <Tab
            key={index}
            title={item.props.title}
            index={index}
            setSelectedTab={setSelectedTab}
            active={selectedTab}
          />
        ))}
      </ul>
      {children[selectedTab]}
    </div>
  )
}

export default Tabs