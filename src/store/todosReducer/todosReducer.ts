import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { RootState } from '../store'

enum TodoActions {
  ADD_TASK = 'Add task',
  EDIT_TASK = 'Edit task',
  REMOVE_TASK = 'Remove task',
  IMPORT_TASKS = 'Import tasks'
}

// const initialState: Task = {
//   id: 0,
//   title: '',
//   description: '',
//   dataCreation: 0,
//   dataDedline: 0,
// }

interface Task {
  id: string
  description: string
  completed: boolean
}

const todosSlice = createSlice({
  name: TodoActions.ADD_TASK,
  initialState: [] as Task[],
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Task>) => {
        state.push(action.payload)
      },
      prepare: (description: string) => {
        const id = nanoid()
        return { payload: { id, description, completed: false } }
      },
    },
  },
})


export const { addTodo } = todosSlice.actions;
export default todosSlice.reducer;