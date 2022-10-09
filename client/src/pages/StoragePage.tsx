import React from 'react'
import { useGetAllProductsQuery } from "store/api/products"
import Storage from 'components/Storage/Storage'
import ErrorMessage from 'components/common/Messages/ErrorMessage'
import Loading from 'components/common/Loading/Loading'

const StoragePage: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery()

  return (
    <>
      {
        error && (<ErrorMessage message={'Wystąpił błąd serwera, nie można wyświetlić zawartości'} />)
      }
      {
        isLoading ? <Loading /> : <Storage data={data} />
      }

    </>
  )
}

export default StoragePage
