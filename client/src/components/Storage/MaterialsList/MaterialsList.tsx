import React, { useCallback, useState } from 'react'
import Row from './Row/Row'
import styles from './styles.module.scss'
import { useDeleteProductMutation } from "../../../store/api/products";
import { TiArrowSortedDown } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowUnsorted } from 'react-icons/ti'
import { Product } from '../../../models/product';

interface MaterialsListProps {
  data: Product[] | undefined
  setIsModalEditOpen: (value: boolean) => void
  setCurrentProduct: (value: Product) => void
}

type SortKeys = keyof Product;

const MaterialsList: React.FC<MaterialsListProps> = ({ data, setIsModalEditOpen, setCurrentProduct }) => {
  const [deleteProduct] = useDeleteProductMutation()
  const [products, setProducts] = useState(data)
  const [order, setOrder] = useState('asc')
  const [sortKey, setSortKey] = useState('');

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

  }, [products, order, sortKey])

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        {headers.map(row => (
          <div
            key={row.key}
            className={`${styles.block} ${row.sortable ? styles.sortable : ''}`}
            {...(row.sortable && { onClick: () => sortData({ sortBy: row.key })})}>
            <span>
              {row.label}
              {row.sortable ?
                (sortKey === row.key ? (order === 'desc' ? <TiArrowSortedDown /> : <TiArrowSortedUp />) : <TiArrowUnsorted color='#d4d4d4' />)
                : null}
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