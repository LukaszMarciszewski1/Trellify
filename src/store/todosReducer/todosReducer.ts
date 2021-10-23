import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { RootState } from '../store'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
}

const todosSlice = createSlice({
  name: 'todo-list',
  initialState: [] as Task[],
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Task>) => {
        state.push(action.payload)
      },
      prepare: (title: string, description: string) => {
        const id = nanoid()
        return { payload: { id, title, description, completed: false } }
      },
    },
    removeTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex((task) => task.id === action.payload);
      state.splice(index, 1);
    },
    changeStatus(
      state,
      action: PayloadAction<{completed: boolean, id: string}>
    ){
     const index = state.findIndex(task => task.id === action.payload.id)
     state[index].completed = action.payload.completed
    }
  },
})


export const { addTodo, removeTodo, changeStatus } = todosSlice.actions;
export default todosSlice.reducer;