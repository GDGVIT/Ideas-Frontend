import React, { useEffect, useState } from 'react'
import './App.css'
import './assets/gilroy/Gilroy-Bold.ttf'
import './assets/gilroy/Gilroy-Medium.ttf'
import { Routes, Route } from 'react-router-dom'
import GuardedRoute from './components/GuardedRoute'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'

import { initialiseStore } from './app/slices/authSlice'

import Landing from './pages/Landing'
import Ideas from './pages/ideas/Ideas'
import NewIdea from './pages/ideas/NewIdea'
import SingleIdea from './pages/ideas/SingleIdea'
import EditIdea from './pages/ideas/EditIdea'
import CommentNotif from './pages/CommentNotif'
import HowInfo from './pages/ideas/HowInfo'
import MentionNotif from './pages/MentionNotif'
import Admin from './pages/admin/Admin'
import MakeReal from './pages/admin/MakeReal'
import AdminApproved from './pages/admin/AdminApproved'
import AdminRejected from './pages/admin/AdminRejected'

function App () {
  const dispatch = useDispatch()

  const authState = useSelector(state => state.auth)

  const [auth, setAuth] = useState(authState)

  useEffect(() => {
    dispatch(initialiseStore())
    setAuth(authState)
  }, [dispatch, authState])

  return (
    <div className='App'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
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
        <Route path='/ideas/edit/:id' element={<GuardedRoute auth={auth} />}>
          <Route path='/ideas/edit/:id' element={<EditIdea />} />
        </Route>
        <Route path='/how' element={<HowInfo />} />
        <Route exact path='/mentions' element={<GuardedRoute auth={auth} />}>
          <Route exact path='/mentions' element={<MentionNotif />} />
        </Route>
        <Route exact path='/admin' element={<GuardedRoute admin auth={auth} />}>
          <Route exact path='/admin' element={<Admin />} />
        </Route>
        <Route exact path='/admin/accepted' element={<GuardedRoute admin auth={auth} />}>
          <Route exact path='/admin/accepted' element={<AdminApproved a />} />
        </Route>
        <Route exact path='/admin/rejected' element={<GuardedRoute admin auth={auth} />}>
          <Route exact path='/admin/rejected' element={<AdminRejected r />} />
        </Route>
        <Route exact path='/admin/makereal/:id' element={<GuardedRoute admin auth={auth} />}>
          <Route exact path='/admin/makereal/:id' element={<MakeReal />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
