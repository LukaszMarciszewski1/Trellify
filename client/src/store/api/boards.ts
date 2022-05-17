import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Board } from '../../models/board'

type BoardResponse = Board[]

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['Board'],
  endpoints: (builder) => ({
    getAllBoards: builder.query<BoardResponse, void>({
      query: () => `boards`,
      providesTags: ['Board'],
    }),
    getBoard: builder.query<Board, string>({
      query: (id) => `boards/${id}`,
      providesTags: ['Board'],
    }),
    createBoard: builder.mutation<Board, Partial<Board>>({
      query: (body: {}) => ({
        url: 'boards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Board'],
    }),
    updateBoard: builder.mutation<Board, Partial<Board>>({
      query: ({ _id, ...patch }) => ({
        url: `boards/${_id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Board'],
    }),
  }),
})

export const {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
} = boardApi
