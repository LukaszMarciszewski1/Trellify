import React from 'react'

type Props = {
  title: string
}

const TabsContent: React.FC<Props> = ({ title, children }) => {
  return <div title={title}>{children}</div>
}

export default TabsContent