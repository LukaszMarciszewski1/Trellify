import { configureStore } from '@reduxjs/toolkit'
import { boardApi } from './api/boards'
import { listsApi } from './api/lists'
import { cardsApi } from './api/cards'
import { filesApi } from './api/files'
import {authApi} from './api/user'

export const store = configureStore({
  reducer: {
    [boardApi.reducerPath]: boardApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      boardApi.middleware,
      listsApi.middleware,
      cardsApi.middleware,
      filesApi.middleware,
      authApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
