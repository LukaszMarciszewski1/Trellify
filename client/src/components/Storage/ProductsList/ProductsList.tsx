import React, { useCallback, useState } from 'react'
import styles from './styles.module.scss'
import { TiArrowSortedDown } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowUnsorted } from 'react-icons/ti'
import { Product as ProductModel } from '../../../models/product';

interface ProductsListProps {
  data: ProductModel[] | undefined
  sortProducts: (value: ProductModel[]) => void
}

type SortKeys = keyof ProductModel;

const ProductsList: React.FC<ProductsListProps> = ({ data, children, sortProducts }) => {
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

  const sortData = useCallback(({ sortBy }: { sortBy: SortKeys }) => {
    if (!data) return;
    const array: ProductModel[] = [...data]

    if (order === 'asc') {
      const sorted = array.sort((a, b) => a[sortBy].toString().localeCompare(b[sortBy].toString(), "pl", { numeric: true }))
      sortProducts(sorted)
      setOrder('desc')
    }

    if (order === 'desc') {
      const sorted = array.sort((a, b) => b[sortBy].toString().localeCompare(a[sortBy].toString(), "pl", { numeric: true }))
      sortProducts(sorted)
      setOrder('asc')
    }

    setSortKey(sortBy);

  }, [data, order, sortKey])

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
                (sortKey === row.key ? (order === 'desc' ? <TiArrowSortedDown /> : <TiArrowSortedUp />) : <TiArrowUnsorted color='#c8c8c8' />)
                : null}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.list}>
        {children}
      </div>
    </div>
  )
}

export default ProductsList