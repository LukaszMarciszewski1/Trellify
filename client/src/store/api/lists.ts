import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { List } from 'models/list'

type ListResponse = List[]

export const listsApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getAllLists: builder.query<ListResponse, void>({
      query: () => `lists`,
      providesTags: ['List'],
    }),
    getList: builder.query<List, string>({
      query: (id) => `lists/${id}`,
      providesTags: ['List'],
    }),
    addList: builder.mutation<List, Partial<List>>({
      query: (body: {}) => ({
        url: 'lists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['List'],
    }),
    updateList: builder.mutation<List, Partial<List>>({
      query: ({ _id, ...patch }) => ({
        url: `lists/${_id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['List'],
    }),
    deleteList: builder.mutation<{ success: boolean; id: string | number }, string>({
      query: (id) => ({
        url: `lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['List'],
    }),
    deleteAllCardsOfList: builder.mutation<List, Partial<List>>({
      query: ({ _id, ...patch }) => ({
        url: `lists/${_id}/cards`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['List'],
    }),
  }),
})

export const {
  useGetAllListsQuery,
  useGetListQuery,
  useAddListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useDeleteAllCardsOfListMutation,
} = listsApi
