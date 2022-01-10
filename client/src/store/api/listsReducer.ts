import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { v4 as uuidv4 } from 'uuid'
import { cardsApi } from './cardsReducer'

interface List {
  _id: string
  title: string
  index: number
  sourceIndex: number,
  destinationIndex: number,
  sortIndex: number,
  cards: [
    {
      _id: string
      listId: string | number
      title: string
      description: string
      deadline: string
      completed: number
      createdDate: Date
      text: string
    }
  ]
}

type ListResponse = List[]

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/'}),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<ListResponse, void>({
      query: () => `lists`,
      providesTags: ['List'],
    }),
    getTask: builder.query<ListResponse, void>({
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
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['List'],
    }),
    getCards: builder.query<ListResponse, void>({
      query: (id) => `lists/${id}`,
      providesTags: ['List'],
    }),
    // addCard: builder.mutation({
    //   query: ( {id , ...cards}) => ({
    //     url: `lists/${id}`,
    //     method: 'PUT',
    //     body: cards,
    //   }),
    //   invalidatesTags: ['List'],
    // }),
    // addCard: builder.mutation({
    //   query: ({ id, ...patch }) => ({
    //     url: `lists/${id}`,
    //     method: 'PUT',
    //     body: patch,
    //   }),
    //   invalidatesTags: ['List'],
    // }),
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
