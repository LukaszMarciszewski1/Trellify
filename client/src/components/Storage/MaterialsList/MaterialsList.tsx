import React, { useCallback, useState } from 'react'
import Row from './Row/Row'
import styles from './styles.module.scss'
import {
  useDeleteProductMutation
} from "../../../store/api/products";
import IconButton from '../../Details/IconButton/IconButton';
import Popup from '../../Details/Popup/Popup';
import TaskButton from '../../Details/TaskButton/TaskButton';
import { TiArrowSortedDown } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowUnsorted } from 'react-icons/ti'
import { FaSort } from 'react-icons/fa'
import { Product } from '../../../models/product';

interface MaterialsListProps {
  data: Product[] | undefined
  setIsModalEditOpen: (value: boolean) => void
  setCurrentProduct: (value: Product) => void
}

type SortKeys = keyof Product;

const SortButton = ({ order, columnKey, sortKey }: { order: string; columnKey: string; sortKey: string; }) => (
  <div className={`${sortKey === columnKey && order === "desc" ? "sort-reverse" : "" }`}>
    {sortKey === columnKey ? (order === 'desc' ? <TiArrowSortedDown /> : <TiArrowSortedUp /> ): <TiArrowUnsorted color='#d4d4d4' />}
  </div>
)

const headersData: { key: SortKeys; label: string, sortable: boolean, asc?: boolean }[] = [
  { key: "name", label: "Nazwa", sortable: true, asc: false },
  { key: "category", label: "Kategoria", sortable: true, asc: false },
  { key: "quantity", label: "Stan", sortable: true, asc: false },
  { key: "unit", label: "Jedn.", sortable: false },
  { key: "price", label: "Cena", sortable: true, asc: false },
  { key: "actions", label: "Akcje", sortable: false },
];

const MaterialsList: React.FC<MaterialsListProps> = ({ data, setIsModalEditOpen, setCurrentProduct }) => {
  const [deleteProduct] = useDeleteProductMutation()
  const [products, setProducts] = useState(data)
  const [order, setOrder] = useState('asc')
  const [headers, setHeaders] = useState(headersData)
  // const [sortKey, setSortKey] = useState<SortKeys>('name');
  const [sortKey, setSortKey] = useState('');
  const [currenHeader, setCurrenHeader] = useState('')



  const handleEditProd = (prod: Product) => {
    setIsModalEditOpen(true)
    setCurrentProduct(prod)
  }

  // const sortedData = useCallback(
  //   () => sortData({ tableData: data, sortKey, reverse: sortOrder === "desc" }),
  //   [data, sortKey, sortOrder]
  // );

  const sortData = useCallback(({ sortBy }: { sortBy: SortKeys }) => {
    if (!products) return;
    const array: Product[] = [...products]

    if (order === 'asc') {
      const sorted = array.sort((a, b) => a[sortBy].toString().localeCompare(b[sortBy].toString(), "pl", { numeric: true }))
      setProducts(sorted)
      setOrder('desc')
    }

    if (order === 'desc') {
      const sorted = array.sort((a, b) => b[sortBy].toString().localeCompare(a[sortBy].toString(), "pl", { numeric: true }))
      setProducts(sorted)
      setOrder('asc')
    }

    setSortKey(sortBy);

  }, [products, order])

  console.log(sortKey)

  // const changeDirection = (key: string) => {
  //   [...headers].map(item => {
  //     if (key === item.key) {
  //       item.asc = !item.asc
  //     }
  //   })
  //   setHeaders(headers)
  // }

  // console.log(order)
  //{row.label} {row.sortable ? (row.key === sortKey && order === 'dsc' ? <TiArrowSortedUp /> : <TiArrowSortedDown />) : null}

 

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        {headers.map(row => (
          <div
            key={row.key}
            className={`${styles.block} ${row.sortable && styles.sortable}`}
            {...(row.sortable && { onClick: () => sortData({ sortBy: row.key }) })}>
            <span >
              {/* {row.label} {row.sortable ? (row.key === sortKey && order === 'dsc' ? <TiArrowSortedUp /> : <TiArrowSortedDown />) : null} */}
              {/* {row.label} {row.sortable ? (!sortKey ? <TiArrowUnsorted color='#dedede' /> : row.key === sortKey && order === 'dsc' ? <TiArrowSortedUp /> : <TiArrowSortedDown />) : null} */}
              {/* {row.label} {row.sortable ? <SortButton columnKey={row.key} order={order} sortKey={sortKey}/> : null} */}
              {row.label} 
              {row.sortable ? (sortKey === row.key ? (order === 'desc' ? <TiArrowSortedDown /> : <TiArrowSortedUp /> ): <TiArrowUnsorted color='#d4d4d4' />) : null}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.list}>
        {
          products?.map(product => (
            <div key={product._id} className={styles.row}>
              <Row
                _id={product._id}
                name={product.name}
                category={product.category}
                quantity={product.quantity}
                unit={product.unit}
                price={`${product.price} zł`}
                editProd={() => handleEditProd(product)}
                deleteProd={() => deleteProduct(product._id)}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MaterialsList