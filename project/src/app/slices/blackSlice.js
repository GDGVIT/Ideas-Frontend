import { createSlice } from '@reduxjs/toolkit'

export const blackSlice = createSlice({
  name: 'black',
  initialState: {
    entered: false
  },
  reducers: {
    initialiseEnter: (state) => {
      if (localStorage.getItem('entered')) {
        state.entered = true
      }
    },
    enterstore: (state) => {
      localStorage.setItem('entered', true)
      state.entered = true
    },
  }
})

export const { enterstore, initialiseEnter } = blackSlice.actions

export default blackSlice.reducer
