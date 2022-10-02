import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from 'models/product'

type ProductResponse = Product[]
const token = localStorage.getItem('token') || null
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || null
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  refetchOnMountOrArgChange: token ? true : false,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductResponse, void>({
      query: () => `products`,
      providesTags: ['Products'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      providesTags: ['Products'],
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body: {}) => ({
        url: 'products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: ({ _id, ...patch }) => ({
        url: `products/${_id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApi
