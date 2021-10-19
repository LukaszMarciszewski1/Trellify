import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../reducers/reducer'
import todosReducer from './todosReducer/todosReducer'

export const store = configureStore({
  reducer: {
    reducer: todosReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch