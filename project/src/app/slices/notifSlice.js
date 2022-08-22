import { createSlice } from '@reduxjs/toolkit'

export const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    unreads: false
  },
  reducers: {
    setStatus: (state, action) => {
      state.unreads = action.payload
    },
  }
})

export const { setStatus } = notifSlice.actions

export default notifSlice.reducer
