import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Cards {
  _id: string
  boardId: string
  listId: string
  title: string
  description: string
  deadline: Date
  completed: boolean
  createdAt: Date
  updateDate: Date
  text: string
  labels: {
    color: string
    title: string
    active: boolean
  }[]
}

const url = 'http://localhost:5000/'

type CardsResponse = Cards[]

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  tagTypes: ['Cards'],
  endpoints: (builder) => ({
    getAllCards: builder.query<CardsResponse, void>({
      query: () => `cards`,
      providesTags: ['Cards'],
    }),
    getCard: builder.query({
      query: (id) => `cards/${id}`,
      providesTags: ['Cards'],
    }),
    addCard: builder.mutation<Cards, Partial<Cards>>({
      query: (body: {}) => ({
        url: 'cards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
    deleteCard: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cards'],
    }),
    updateCard: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `cards/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Cards'],
    }),
    deleteAll: builder.mutation({
      query: () => ({
        url: `cards`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cards'],
    }),
  }),
})

export const {
  useGetAllCardsQuery,
  useGetCardQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useDeleteAllMutation,
} = cardsApi
