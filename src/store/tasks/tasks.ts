import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../index'

enum TodoActions {
  ADD_TASK = 'Add task',
  EDIT_TASK = 'Edit task',
  REMOVE_TASK = 'Remove task',
  IMPORT_TASKS = 'Import tasks'
}

interface Task {
  id: number;
  title: string;
  description: string;
  dataCreation: number;
  dataDedline: number;
}

const initialState: Task = {
  id: 0,
  title: '',
  description: '',
  dataCreation: 0,
  dataDedline: 0,
}

export const counterSlice = createSlice({
  name: TodoActions.ADD_TASK,
  initialState,
  reducers: {
    addTaskToList: () => {
      
    }
  },
})


export const { addTaskToList } = counterSlice.actions



export default counterSlice.reducer