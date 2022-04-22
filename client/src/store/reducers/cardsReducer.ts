import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Card {
  boardId: string
  listId: string
  title: string
  description: string
  deadline: Date
  completed: boolean
  createdAt: Date
  updateDate: Date
  text: string
  files: {
    fileName: string,
    filePath: string,
    fileType: string,
    fileSize: string,
  }[]
  labels: {
    color: string
    title: string
    active: boolean
  }[]
}

const url = 'http://localhost:5000/'
// const url = 'https://lukas-backend.herokuapp.com/'

type CardsResponse = Card[]

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
    addCard: builder.mutation<Card, Partial<Card>>({
      query: (body: {}) => ({
        url: 'cards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
    uploadFilesCard: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `cards/${id}/files`,
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Cards'],
    }),
    getCardFiles: builder.query({
      query: (id) => `cards/${id}/files`,
      providesTags: ['Cards'],
    }),
    deleteFile: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `cards/${id}/files`,
        method: 'DELETE',
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
  useDeleteFileMutation,
  useUploadFilesCardMutation,
  useGetCardFilesQuery,
} = cardsApi
