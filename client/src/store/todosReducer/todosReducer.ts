import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from '../../api/index'

interface Todos {
  _id: string
  title: string
  description: string
  completed: number
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
    removeTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation({
      query: ({id, ...body}) => ({
        url: `tasks/${id}`,
        method: 'PATCH',
        body
      })
    }),
    completedTask: builder.mutation({
      query: ({id, ...patch}) => ({
        url: `tasks/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const { 
  useGetAllTasksQuery, 
  useAddTaskMutation, 
  useRemoveTaskMutation, 
  useUpdateTaskMutation,
  useCompletedTaskMutation } = todosApi;
