import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { List } from '../../models/list'

type ListResponse = List[]

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<ListResponse, void>({
      query: () => `lists`,
      providesTags: ['List'],
    }),
    getTask: builder.query<List, string>({
      query: (id) => `lists/${id}`,
      providesTags: ['List'],
    }),
    addTask: builder.mutation<List, Partial<List>>({
      query: (body: {}) => ({
        url: 'lists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['List'],
    }),
    updateTask: builder.mutation<List, Partial<List>>({
      query: ({ _id, ...patch }) => ({
        url: `lists/${_id}`,
        method: 'PATCH',
        body: patch,
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
    deleteTask: builder.mutation<{ success: boolean; id: string | number }, string>({
      query: (id) => ({
        url: `lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['List'],
    }),
  }),
})

export const {
  useGetAllTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useDeleteAllCardsOfListMutation,
} = listApi
