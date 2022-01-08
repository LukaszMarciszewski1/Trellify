import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../reducers/reducer'
import {boardApi} from './api/boardsReducer'
import {listApi} from './api/listsReducer'
import {cardsApi} from './api/cardsReducer'

export const store = configureStore({
  reducer:{
    [boardApi.reducerPath]: boardApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(boardApi.middleware, listApi.middleware, cardsApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch