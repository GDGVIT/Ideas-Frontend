import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    name: '',
    givenName: '',
    familyName: '',
    googleId: '',
    _id: '',
    picture: '',
    email: ''
  },
  reducers: {
    initialiseStore: state => {
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.name = localStorage.getItem('name')
        state.givenName = localStorage.getItem('givenName')
        state.familyName = localStorage.getItem('familyName')
        state.googleId = localStorage.getItem('googleId')
        state._id = localStorage.getItem('_id')
        state.picture = localStorage.getItem('picture')
        state.email = localStorage.getItem('email')
      } else {
        state.token = ''
        state.name = ''
        state.givenName = ''
        state.familyName = ''
        state.googleId = ''
        state._id = ''
        state.picture = ''
        state.email = ''
      }
    },
    setUserInfo: (state, action) => {
      state.token = action.payload.token
      state.name = action.payload.data.name
      state.givenName = action.payload.data.givenName
      state.familyName = action.payload.data.familyName
      state.googleId = action.payload.data.googleId
      state._id = action.payload.data._id
      state.picture = action.payload.data.picture
      state.email = action.payload.data.email
    },
    logout: state => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
      }
      if (localStorage.getItem('admin')) {
        localStorage.removeItem('admin')
      }
      window.location.reload()
    }
  }
})

export const { initialiseStore, setUserInfo, logout } = authSlice.actions

export default authSlice.reducer
