import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Card } from '../../models/card'

type CardsResponse = Card[]

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['Cards'],
  endpoints: (builder) => ({
    getAllCards: builder.query<CardsResponse, void>({
      query: () => `cards`,
      providesTags: ['Cards'],
    }),
    getCard: builder.query<Card, string>({
      query: (id) => `cards/${id}`,
      providesTags: ['Cards'],
    }),
    addCard: builder.mutation<Card, Partial<Card>>({
      query: (body: {}) => ({
        url: 'cards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
    updateCard: builder.mutation<Card, Partial<Card>>({
      query: ({ _id, ...patch }) => ({
        url: `cards/${_id}`,
        method: 'PATCH',
        body: patch,
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
