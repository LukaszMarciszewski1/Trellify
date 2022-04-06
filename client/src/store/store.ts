import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../reducers/reducer'
import { boardApi } from './reducers/boardsReducer'
import { listApi } from './reducers/listsReducer'
import { cardsApi } from './reducers/cardsReducer'
import { filesApi } from './reducers/filesReducer'

export const store = configureStore({
  reducer: {
    [boardApi.reducerPath]: boardApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      boardApi.middleware,
      listApi.middleware,
      cardsApi.middleware,
      filesApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
