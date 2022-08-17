
import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'

const GuardedRoute = () => {
  const auth = localStorage.getItem('token')
  return auth ? <Outlet /> : <Navigate to='/' />
}

export default GuardedRoute
