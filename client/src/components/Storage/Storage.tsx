import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from '../../models/product'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation
} from "../../store/api/products"
import Modal from '../Details/Modal/Modal'
import ProductForm from './ProductForm/ProductForm'
import Header from './Header/Header'
import ProductsList from './ProductsList/ProductsList'
import Product from './Product/Product'
import CategoriesList from './CategoriesList/CategoriesList'

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
  const allCategoryValue = 'Wszystkie kategorie'
  const [activeCategory, setActiveCategory] = useState<string>(allCategoryValue)

  useEffect(() => {
    if (data) {
      setProducts(data)
      setCategories(getCategories(data))
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

  const handleEditProd = (prod: ProductModel) => {
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
                  products?.map(product => (
                    <Product
                      key={product._id}
                      _id={product._id}
                      name={product.name}
                      category={product.category}
                      quantity={product.quantity}
                      unit={product.unit}
                      price={`${product.price} zł`}
                      editProd={() => handleEditProd(product)}
                      deleteProd={() => deleteProduct(product._id)}
                    />
                  ))
                }
              </ProductsList>
            )
          }
        </div>
      </div>
      <div className={styles.right}><p>sticky</p></div>
      <Modal
        trigger={isModalOpen}
        closeModal={() => setIsModalOpen(false)}>
        <ProductForm
          categoryList={categories}
          formTitle={'Dodaj produkt'}
          handleSubmitForm={handleAddProduct} />
      </Modal>
      <Modal
        trigger={isModalEditOpen}
        closeModal={() => setIsModalEditOpen(false)}>
        {
          currentProduct && (
            <ProductForm
              categoryList={categories}
              formTitle={'Edytuj produkt'}
              defaultName={currentProduct.name}
              defaultCategory={currentProduct.category}
              defaultQuantity={currentProduct.quantity}
              defaultUnit={currentProduct.unit}
              defaultPrice={currentProduct.price}
              handleSubmitForm={handleEditProduct}
            />
          )
        }
      </Modal>
    </div>
  )
}

export default Storage