import { createSlice } from '@reduxjs/toolkit'

export const slideshowSlice = createSlice({
  name: 'slideshow',
  initialState: {
    trendingEnd: 1,
    realEnd: 1,
    trendingStart:0,
    realStart:0
  },
  reducers: {
    setTrendingIndexEnd: (state, action) => {
      state.trendingEnd = action.payload
    },
    setTrendingIndexStart: (state, action) => {
      state.trendingStart = action.payload
    },
    setRealIndexEnd: (state, action) => {
      state.realEnd = action.payload
    },
    setRealIndexStart: (state, action) => {
      state.realStart = action.payload
    },
  }
})

export const { setTrendingIndexEnd, setRealIndexEnd, setTrendingIndexStart, setRealIndexStart } = slideshowSlice.actions

export default slideshowSlice.reducer
