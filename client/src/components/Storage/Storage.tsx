import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation
} from "store/api/products"
import { Product as ProductModel } from 'models/product'
import Modal from 'components/Details/Modal/Modal'
import ProductForm from './ProductForm/ProductForm'
import Header from './Header/Header'
import ProductsList from './ProductsList/ProductsList'
import Product from './Product/Product'
import CategoriesList from './CategoriesList/CategoriesList'
import SuccessMessage from 'components/Details/Messages/SuccessMessage'

export type ReduceReturnType = Record<string, number>;

const Storage: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()
  const [addProduct] = useAddProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const [products, setProducts] = useState<ProductModel[]>()
  const [categories, setCategories] = useState<ReduceReturnType | undefined>()
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const allCategoryValue = 'Wszystkie kategorie'
  const [activeCategory, setActiveCategory] = useState<string>(allCategoryValue)

  useEffect(() => {
    if (data) {
      setProducts(data)
      setCategories(getCategories(data))
      setTimeout(() => setIsSuccess(false), 2000)
    }
  }, [data])

  const getCategories = (data: ProductModel[] | undefined) => {
    if (!data) return
    const categories = [...data].map(product => product.category)
    const categoryObj = categories.reduce<ReduceReturnType>((acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }), {});

    return categoryObj
  }

  const handleFilterCategory = (value: string) => {
    if (!data) return
    const filterProducts = [...data].filter(product => product.category === value)
    if (value !== allCategoryValue) {
      setProducts(filterProducts)
    }
    else {
      setProducts(data)
    }
    setActiveCategory(value)
  }

  const handleOpenEditProduct = (prod: ProductModel) => {
    setIsModalEditOpen(true)
    setCurrentProduct(prod)
  }

  const handleAddProduct = (data: ProductModel) => {
    const { name, category, quantity, unit, price } = data
    addProduct({
      name,
      category,
      quantity,
      unit,
      price
    })
    setIsSuccess(true)
  }

  const handleEditProduct = (data: ProductModel) => {
    const { name, category, quantity, unit, price } = data
    updateProduct({
      _id: currentProduct._id,
      name,
      category,
      quantity,
      unit,
      price
    })
    setIsSuccess(true)
  }

  return (
    <div className={styles.container}>
      {error && <h2>Error 500</h2>}
      <div className={styles.left}>
        <div className={styles.top}>
          <CategoriesList data={categories} />
        </div>
        <div className={styles.bottom}>
          <Header
            addNewProduct={() => setIsModalOpen(true)}
            categories={categories}
            handleFilterCategory={handleFilterCategory}
            activeCategory={activeCategory}
            allCategoryValue={allCategoryValue}
          />
          {
            isLoading ? <div>Loading...</div> : (
              <ProductsList
                data={products}
                sortProducts={setProducts}
              >
                {
                  products?.slice(0).reverse().map(product => (
                    <Product
                      key={product._id}
                      _id={product._id}
                      name={product.name}
                      category={product.category}
                      quantity={product.quantity}
                      unit={product.unit}
                      price={product.price}
                      editProd={() => handleOpenEditProduct(product)}
                      deleteProd={() => {
                        const result = window.confirm("Usunąć produkt?")
                        if (!result) return
                        deleteProduct(product._id)
                      }}
                    />
                  ))
                }
              </ProductsList>
            )
          }
        </div>
      </div>
      {/* <div className={styles.right}><p>statystyki magazynu</p></div> */}
      <Modal
        trigger={isModalOpen}
        closeModal={() => setIsModalOpen(false)}>
        <ProductForm
          categoryList={categories}
          formTitle={'Dodaj produkt'}
          handleSubmitForm={handleAddProduct}
          message={(isSuccess && <SuccessMessage message={'Produkt został dodany'} />)}
        />
      </Modal>
      <Modal
        trigger={isModalEditOpen}
        closeModal={() => setIsModalEditOpen(false)}>
        {
          currentProduct && (
            <ProductForm
              formTitle={'Edytuj produkt'}
              categoryList={categories}
              defaultName={currentProduct.name}
              defaultCategory={currentProduct.category}
              defaultQuantity={currentProduct.quantity}
              defaultUnit={currentProduct.unit}
              defaultPrice={currentProduct.price}
              handleSubmitForm={handleEditProduct}
              message={(isSuccess && <SuccessMessage message={'Produkt został zedytowany'} />)}
            />
          )
        }
      </Modal>
    </div>
  )
}

export default Storage