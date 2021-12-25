import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../reducers/reducer'
import {todosApi} from './api/todosReducer'
import {cardsApi} from './api/cardsReducer'

export const store = configureStore({
  reducer:{
    [todosApi.reducerPath]: todosApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(todosApi.middleware, cardsApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch