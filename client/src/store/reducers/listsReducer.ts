import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {Card} from './cardsReducer'
export interface List {
  _id: string
  title: string
  index: number
  boardId: string
  cards: Card[]
}

export type ListResponse = List[]
const url = 'http://localhost:5000/'
// const url = 'https://lukas-backend.herokuapp.com/'

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<ListResponse, void>({
      query: () => `lists`,
      providesTags: ['List'],
    }),
    getTask: builder.query<ListResponse, Partial<List>>({
      query: (id) => `lists/${id}`,
      providesTags: ['List'],
    }),
    addTask: builder.mutation({
      query: (body: {}) => ({
        url: 'lists',
        method: 'POST',
        body,
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
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `lists/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['List'],
    }),
    getCards: builder.query<ListResponse, void>({
      query: (id) => `lists/${id}`,
      providesTags: ['List'],
    }),
  }),
})

export const {
  useGetAllTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetCardsQuery,
} = listApi
