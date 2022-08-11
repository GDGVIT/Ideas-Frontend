import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Landing () {
  const [enter, setEnter] = useState(false)

  useEffect(() => {
    if (!enter) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [enter])

  return (
    <div className='z-2'>
      <div className={`${enter ? 'opacity-0 z-0' : 'opacity-100 z-4'} blackout top-0 left-0 fixed h-screen w-screen`} style={{ 'backgroundColor': 'rgba(0, 0, 0, 0.92)' }} />
      <img src={require('../assets/lamp.png')} alt='lamp' className='absolute lg:w-10rem md:w-8rem w-6rem mx-auto lamp-position' />
      <div className='flex flex-column w-screen relative px-6 rem-mar' style={{ overflow: 'hidden', marginLeft: '-6rem' }}>
        <img src={require('../assets/plantshelf.png')} alt='plantshelf' className='absolute h-6rem plantshelf-position md:block hidden' />
        <img src={require('../assets/board.png')} alt='plantshelf' className='absolute lg:h-18rem md:h-15rem board-position md:block hidden' />
        <img src={require('../assets/landingperson.png')} alt='plantshelf' className='absolute lg:h-22rem md:h-20rem board-position landing-person-position md:block hidden' />
        <div className={`${enter ? null : 'text-white'} hero lg:w-6 md:w-8 w-12 z-5`} id='hero'>
          <h1 className='landing-font  relative'>
            DSC Idea Hub
            <img className='landing-circle absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../assets/drawCircle2.svg').default} alt='stroke' />
          </h1>
          <p className='mt-5'>DSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
          </p>
          <p className='mt-5'>"Everything Begins With An Idea" – Earl Nightingale</p>
          {enter
            ? <Link to='/ideas/new'>
              <button className='primary-button mt-5 font-20'>Add an Idea</button>
            </Link>
            : <button href='#hero' onClick={() => setEnter(true)} className='primary-button mt-5 font-20'>Enter the Ideas Hub</button>}
        </div>

        <div>
          <h2 className='font-36 font-bold'>Trending Ideas</h2>
          <div className='mt-5 flex flex-row gap-4 flex-wrap' />
        </div>
        <div className='mt-6'>
          <h2 className='font-36 font-bold'>Ideas Made Real</h2>
          <div className='mt-5 flex flex-row gap-4 flex-wrap' />
        </div>
        <p className='mt-8 text-center'>Wanna know how we make your ideas our reality? Let's find out.</p>
      </div>
    </div>
  )
}
