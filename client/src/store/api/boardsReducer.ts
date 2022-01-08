import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { v4 as uuidv4 } from 'uuid'
import { cardsApi } from './cardsReducer'

interface Board {
  _id: string
  title: string
  lists: [],
  listOrder: string[],
  sourceIndex: number,
  destinationIndex: number,
}

type BoardResponse = Board[]

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/'}),
  tagTypes: ['Board'],
  endpoints: (builder) => ({
    getAllBoards: builder.query<BoardResponse, void>({
      query: () => `boards`,
      providesTags: ['Board'],
    }),
    getBoard: builder.query({
      query: (id) => `boards/${id}`,
      providesTags: ['Board'],
    }),
    updateBoard: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `boards/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Board'],
    }),
  }),
})

export const {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} = boardApi