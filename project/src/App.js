import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Ideas from './pages/ideas/Ideas'
import NewIdea from './pages/ideas/NewIdea'

function App () {
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
