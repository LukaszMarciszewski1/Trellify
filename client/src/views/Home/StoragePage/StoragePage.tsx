import React from 'react'
import Storage from '../../../components/Storage/Storage'

import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../../store/api/products";

const View2: React.FC = () => {
const { data, error, isLoading, refetch } = useGetAllProductsQuery()
  return (
    <>
      <Storage/>
    </>
  )
}

export default View2
