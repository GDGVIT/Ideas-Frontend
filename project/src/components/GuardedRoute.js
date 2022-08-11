
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const GuardedRoute = ({ auth }) => {
  return auth ? <Outlet /> : <Navigate to='/' />
}

export default GuardedRoute
