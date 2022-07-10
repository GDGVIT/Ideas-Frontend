import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout ({ children }) {
  return (
    <div className='layout min-h-screen flex flex-column'>
      <Navbar />
      <main className='container'>{children}</main>
      <Footer />
    </div>
  )
}
