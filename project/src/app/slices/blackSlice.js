import { createSlice } from '@reduxjs/toolkit'

export const blackSlice = createSlice({
  name: 'black',
  initialState: {
    entered: false
  },
  reducers: {
    enterstore: (state) => {
      state.entered = true
    },
  }
})

export const { enterstore } = blackSlice.actions

export default blackSlice.reducer
