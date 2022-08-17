import React, { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import GuardedRoute from './components/GuardedRoute'
import { useDispatch, useSelector } from 'react-redux'

import { initialiseStore } from './app/slices/authSlice'

import Landing from './pages/Landing'
import Ideas from './pages/ideas/Ideas'
import NewIdea from './pages/ideas/NewIdea'
import SingleIdea from './pages/ideas/SingleIdea'
import EditIdea from './pages/ideas/EditIdea'
import CommentNotif from './pages/CommentNotif'

function App () {
  const dispatch = useDispatch()

  const authState = useSelector(state => state.auth)

  const [auth,setAuth] = useState(authState)

  useEffect(() => {
    dispatch(initialiseStore())
    setAuth(authState)
  }, [dispatch,authState])

  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route exact path='/ideas/new/' element={<GuardedRoute auth={auth} />}>
          <Route exact path='/ideas/new/' element={<NewIdea />} />
        </Route>
        <Route exact path='/comments' element={<GuardedRoute auth={auth} />}>
          <Route exact path='/comments' element={<CommentNotif />} />
        </Route>
        <Route exact path='/ideas/' element={<Ideas />} />
        <Route path='/ideas/:id' element={<SingleIdea />} />
        <Route path='/ideas/edit/:id' element={<EditIdea />} />
      </Routes>
    </div>
  )
}

export default App
