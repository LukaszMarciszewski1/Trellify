import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../reducers/reducer'
import {todosApi} from './todosReducer/todosReducer'

export const store = configureStore({
  reducer:{
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(todosApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch