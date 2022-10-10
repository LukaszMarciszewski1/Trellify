import React from 'react'
import { useGetAllProductsQuery } from "store/api/products"
import Storage from 'components/Storage/Storage'
import ErrorMessage from 'components/common/Messages/ErrorMessage'

const StoragePage: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery()

  return (
    <>
      {
        error && (<ErrorMessage message={'Wystąpił błąd serwera, nie można wyświetlić zawartości'} />)
      }
      {
        isLoading ? <div>Loading...</div> : <Storage data={data} />
      }

    </>
  )
}

export default StoragePage
