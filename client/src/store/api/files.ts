import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { File } from 'models/file'

type FilesResponse = File[]

export const filesApi = createApi({
  reducerPath: 'filesApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['Files'],
  endpoints: (builder) => ({
    getAllFiles: builder.query<FilesResponse, void>({
      query: () => `files`,
      providesTags: ['Files'],
    }),
    getFile: builder.query<File, string>({
      query: (id) => `files/${id}`,
      providesTags: ['Files'],
    }),
    uploadFile: builder.mutation<FilesResponse, Partial<File>>({
      query: (body: {}) => ({
        url: `files`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Files'],
    }),
    deleteFile: builder.mutation<{ success: boolean; id: string | number },string>({
      query: (id) => ({
        url: `files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Files'],
    }),
  }),
})

export const {
  useGetAllFilesQuery,
  useGetFileQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} = filesApi
