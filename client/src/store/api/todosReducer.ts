import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { v4 as uuidv4 } from 'uuid'
import { cardsApi } from './cardsReducer'

interface Todos {
  _id: string
  title: string
  cards: [
    {
      _id: string
      listId: string
      title: string
      description: string
      deadline: string
      completed: number
      createdDate: Date
      text: string
    }
  ]
}

type TodosResponse = Todos[]

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<TodosResponse, void>({
      query: () => `tasks`,
      providesTags: ['Tasks'],
    }),
    getTask: builder.query<TodosResponse, void>({
      query: (id) => `tasks/${id}`,
      providesTags: ['Tasks'],
    }),
    addTask: builder.mutation<Todos, Partial<Todos>>({
      query: (body: {}) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Tasks'],
    }),
    getCards: builder.query<TodosResponse, void>({
      query: () => `tasks`,
      providesTags: ['Tasks'],
    }),
    addCard: builder.mutation({
      query: ( {id , ...cards}) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: cards,
      }),
      invalidatesTags: ['Tasks'],
    })
  }),
})

export const {
  useGetAllTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetCardsQuery,
  useAddCardMutation,
} = todosApi
