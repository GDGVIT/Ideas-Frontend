import React, { useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { initialiseStore } from './app/slices/authSlice'

import Landing from './pages/Landing'
import Ideas from './pages/ideas/Ideas'
import NewIdea from './pages/ideas/NewIdea'

function App () {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseStore())
  }, [dispatch])

  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route exact path='/ideas/' element={<Ideas />} />
        <Route exact path='/ideas/new/' element={<NewIdea />} />
      </Routes>
    </div>
  )
}

export default App
