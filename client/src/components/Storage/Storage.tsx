import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation
} from "store/api/products"
import { Product as ProductModel } from 'models/product'
import Modal from 'components/common/Modal/Modal'
import ProductForm from './ProductForm/ProductForm'
import Controls from './Controls/Controls'
import ProductsList from './ProductsList/ProductsList'
import Product from './Product/Product'
import CategoriesList from './CategoriesList/CategoriesList'
import SuccessMessage from 'components/common/Messages/SuccessMessage'
import ErrorMessage from 'components/common/Messages/ErrorMessage'
import Loading from 'components/common/Loading/Loading'

export type ReduceReturnType = Record<string, number>;

interface StorageProps {
  data: ProductModel[] | undefined
}

const Storage: React.FC<StorageProps> = ({ data }) => {
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
    }
  }, [data])

  useEffect(() => {
    const formStatus = setTimeout(() => setIsSuccess(false), 1000)
    return () => {
      clearTimeout(formStatus)
    }
  }, [updateProduct])

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
    <div className={styles.storage}>
      <div className={styles.content}>
        <div className={styles.top}>
          <CategoriesList data={categories} />
        </div>
        <div className={styles.bottom}>
          <Controls
            addNewProduct={() => setIsModalOpen(true)}
            categories={categories}
            handleFilterCategory={handleFilterCategory}
            activeCategory={activeCategory}
            allCategoryValue={allCategoryValue}
          />
          {
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
          }
        </div>
      </div>
      <Modal
        trigger={isModalOpen}
        closeModal={() => setIsModalOpen(false)}>
        <ProductForm
          categoryList={categories}
          formTitle={'Dodaj produkt'}
          handleSubmitForm={handleAddProduct}
          message={(isSuccess ? (
            <SuccessMessage message={'Produkt został dodany'} />) : null)}
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
              message={(isSuccess ? (
                <SuccessMessage message={'Produkt został zmieniony'} />) : null)}
            />
          )
        }
      </Modal>
    </div>
  )
}

export default Storage