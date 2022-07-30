import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing () {
  return (
    <>
      <img src={require('../assets/lamp.png')} alt='lamp' className='absolute lg:w-10rem md:w-8rem w-6rem mx-auto lamp-position' />
      <div className='w-screen relative px-6 rem-mar' style={{'overflow':'hidden','marginLeft':'-6rem'}}>
        <img src={require('../assets/plantshelf.png')} alt='plantshelf' className='absolute h-6rem plantshelf-position md:block hidden' />
        <img src={require('../assets/board.png')} alt='plantshelf' className='absolute lg:h-18rem md:h-15rem board-position md:block hidden' />
        <img src={require('../assets/landingperson.png')} alt='plantshelf' className='absolute lg:h-22rem md:h-20rem board-position landing-person-position md:block hidden' />
        <div className='hero lg:w-6 md:w-8 w-12'>
          <h1 className='landing-font  relative'>
            DSC Idea Hub
            <img className='landing-circle absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../assets/drawCircle2.svg').default} alt='stroke' />
          </h1>
          <p className='mt-5'>DSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
          </p>
          <p className='mt-5'>"Everything Begins With An Idea" – Earl Nightingale</p>
          <Link to='/ideas/new'>
            <button className='primary-button mt-5 font-20'>Add an Idea</button>
          </Link>
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
    </>
  )
}
