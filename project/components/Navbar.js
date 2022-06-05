import React from 'react'

export default function Navbar () {
  return (
    <header className='bg-white p-3 flex justify-content-between'>
      <div className='flex gap-6 align-items-center'>
        <img src='DSClogo.svg' />
        <a>Home</a>
        <a>Ideas</a>
      </div>
      <div className='flex gap-6 align-items-center'>
        <img src='#' alt='notif' />
        <img src='#' alt='mess' />
        <img src='profile.png' />
      </div>
    </header>
  )
}
