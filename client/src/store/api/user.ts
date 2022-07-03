import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../../models/user'
import { RootState } from '../store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authApi
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
  
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<void, User>({
      query: (body: {}) => ({
        url: '/users/login',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;