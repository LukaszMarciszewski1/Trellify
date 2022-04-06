import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface File {
  name: string
  size: number
  lastModifiedDate: Date
}

type FilesResponse = File[]
const url = 'http://localhost:5000/'

export const filesApi = createApi({
  reducerPath: 'filesApi',
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  tagTypes: ['Files'],
  endpoints: (builder) => ({
    getAllFiles: builder.query<FilesResponse, void>({
      query: () => `files`,
      providesTags: ['Files'],
    }),
    getFile: builder.query<FilesResponse, Partial<File>>({
      query: (id) => `files/${id}`,
      providesTags: ['Files'],
    }),
    addFile: builder.mutation({
      query: (body: {}) => ({
        url: 'files',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Files'],
    }),
    deleteFile: builder.mutation<
      { success: boolean; id: string | number },
      string
    >({
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
  useAddFileMutation,
  useDeleteFileMutation,
} = filesApi
