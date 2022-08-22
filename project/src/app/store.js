import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import blackReducer from './slices/blackSlice'
import notifReducer from './slices/notifSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    black:blackReducer,
    notif:notifReducer
  }
})
