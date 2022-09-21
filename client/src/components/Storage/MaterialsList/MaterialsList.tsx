import React, { useState } from 'react'
import Row from './Row/Row'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../../store/api/products";
import IconButton from '../../Details/IconButton/IconButton';
import Popup from '../../Details/Popup/Popup';
import TaskButton from '../../Details/TaskButton/TaskButton';
import { TiArrowSortedDown } from 'react-icons/ti'
import { Product } from '../../../models/product';
import { BiDotsVerticalRounded } from 'react-icons/bi';

interface Props {
  data: Product[] | undefined
  setIsModalEditOpen: (value: boolean) => void
  setCurrentProduct: (value: Product | null) => void
}

type SortKeys = keyof Product;

const MaterialsList: React.FC<Props> = ({ data, setIsModalEditOpen, setCurrentProduct }) => {
  const [deleteProduct] = useDeleteProductMutation()
  const [products, setProducts] = useState(data)
  const [order, setOrder] = useState('asc')
  const [sortKey, setSortKey] = useState<SortKeys>('name')

  const headers: { key: SortKeys; label: string, sortable: boolean }[] = [
    { key: "name", label: "Nazwa", sortable: true },
    { key: "category", label: "Kategoria", sortable: true },
    { key: "quantity", label: "Stan", sortable: true },
    { key: "unit", label: "Jedn.", sortable: false },
    { key: "price", label: "Cena", sortable: true },
    { key: "actions", label: "Akcje", sortable: false },
  ];

  const handleEditProd = (prod: Product) => {
    setIsModalEditOpen(true)
    setCurrentProduct(prod)
  }

  // const sortTableData = ({ sortBy, direction }: { sortBy: SortKeys; direction: string; }) => {
  //   if (!products) return;
  //   const array: Product[] = [...products]
  //   return array.sort((a, b) => {
  //     if (a[sortBy] < b[sortBy]) return direction === 'ascending' ? -1 : 1
  //     if (a[sortBy] > b[sortBy]) return direction === 'ascending' ? 1 : -1
  //     return 0
  //   })
  // }

  const sortData = ({ sortBy, direction }: { sortBy: SortKeys; direction: string; }) => {
    if (!products) return;
    const array: Product[] = [...products]
    // if (col === 'name') {
    //   const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name.toString(), "en", {
    //     numeric: true
    //   }))
    //   setProducts(sorted)
    // }

    if (direction === 'asc') {
      const sorted = array.sort((a, b) => a[sortBy].toString().localeCompare(b[sortBy].toString(), "en", {numeric: true}))
      setProducts(sorted)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        {headers.map(row => (
          <div key={row.key} className={styles.block} >
            <span >{row.label}</span>
            {row.sortable ? <IconButton onClick={() => sortData({ sortBy: row.key, direction: 'asc' })}><TiArrowSortedDown /></IconButton> : null}
          </div>
        ))}
      </div>
      <div className={styles.list}>
        {
          products?.map(product => (
            <div key={product._id} className={`${styles.row}`}>
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



{/* <div className={styles.container}>
<div className={styles.head}>
  <Row
    _id={'head'}
    name={'Nazwa'}
    category={'Kategoria'}
    quantity={'Stan'}
    unit={'Jedn.'}
    price={'Cena'}
    head={true}
    deleteProd={function (): void { throw new Error('Function not implemented.'); }}
    editProd={function (): void { throw new Error('Function not implemented.'); }}
    sorted={() => console.log('okkk')}
  />
</div>
<div className={styles.list}>
  {children}
</div>
</div> */}