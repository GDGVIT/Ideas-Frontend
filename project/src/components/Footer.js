import React from 'react'

export default function Footer () {
  return (
    <footer className='p-3 flex justify-content-center mt-auto'>
      <p className='flex gap-2 align-items-center' style={{ fontSize: 20 }}>Made with <img src={require('../assets/fullHeart.svg').default} alt='heart' /> By GDSC</p>
    </footer>
  )
}
