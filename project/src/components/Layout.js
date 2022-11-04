import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout ({ admin, children }) {
  return (
    <div className='layout min-h-screen flex flex-column'>
      <Navbar admin />
      <main className='container'>{children}</main>
      <Footer admin />
    </div>
  )
}
