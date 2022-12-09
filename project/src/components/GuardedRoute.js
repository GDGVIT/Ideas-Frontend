import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const GuardedRoute = ({ admin }) => {
  const auth = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('admin')
  if (admin) {
    return (isAdmin === "true" && auth) ? <Outlet /> : <Navigate to='/' />
  } else {
    return auth ? <Outlet /> : <Navigate to='/' />
  }
}

export default GuardedRoute
