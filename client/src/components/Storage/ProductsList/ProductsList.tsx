import React, { useCallback, useState } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from 'models/product';
import { TiArrowSortedDown } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowUnsorted } from 'react-icons/ti'

interface ProductsListProps {
  data: ProductModel[] | undefined
  sortProducts: (value: ProductModel[]) => void
}

type SortKeys = keyof ProductModel;

const ProductsList: React.FC<ProductsListProps> = ({ data, children, sortProducts }) => {
  const asc = 'ascending'
  const dsc = 'descending'
  const [order, setOrder] = useState(asc)
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

    if (order === asc) {
      const sorted = array.sort((a, b) => a[sortBy]
        .toString()
        .localeCompare(b[sortBy]
          .toString(), "pl", { numeric: true })
      )
      sortProducts(sorted)
      setOrder(dsc)
    }

    if (order === dsc) {
      const sorted = array.sort((a, b) => b[sortBy]
        .toString()
        .localeCompare(a[sortBy]
          .toString(), "pl", { numeric: true })
      )
      sortProducts(sorted)
      setOrder(asc)
    }

    setSortKey(sortBy);

  }, [data, order, sortKey])

  return (
    <div className={styles.productsList}>
      <div className={styles.head}>
        {headers.map(row => (
          <div
            key={row.key}
            className={`${styles.block} ${row.sortable ? styles.sortable : ''}`}
            {...(row.sortable && { onClick: () => sortData({ sortBy: row.key }) })}>
            <span>
              {row.label}
              {row.sortable ? (
                sortKey === row.key ? (
                  order === dsc ? <TiArrowSortedDown /> : <TiArrowSortedUp />
                ) : <TiArrowUnsorted color='#d4d4df' />
              ) : null}
            </span>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}

export default ProductsList