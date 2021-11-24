import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from '../../helpers/index'

interface Todos {
  _id: string
  title: string
  description: string
  completed: number
  createdAt: Date
}

type TodosResponse = Todos[]

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/"}),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<TodosResponse, void>({
      query: () => `tasks`,
      providesTags: ['Tasks'],
    }),
    addTask: builder.mutation<Todos, Partial<Todos>>({
      query: (body:{}) => ({
        url: 'tasks',
        method: 'POST',
        body
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
      query: ({id, ...patch}) => ({
        url: `tasks/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: ['Tasks']
    }),
  }),
});

export const { 
  useGetAllTasksQuery, 
  useAddTaskMutation, 
  useDeleteTaskMutation, 
  useUpdateTaskMutation } = todosApi;
