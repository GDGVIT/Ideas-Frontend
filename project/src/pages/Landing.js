import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing () {
  return (
    <>
      <div className='hero w-8'>
        <h1 className='text-7xl'>
          DSC Idea
        </h1>
        <h1 className='text-7xl'>
          Hub
        </h1>
        <p className='mt-5'>DSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
        </p>
        <p className='mt-5'>"Everything Begins With An Idea" – Earl Nightingale</p>
        <Link to='/ideas/new'>
          <button className='primary-button mt-5'>Add an Idea</button>
        </Link>
      </div>

      <div>
        <h2>Trending Ideas</h2>
        <div className='mt-5 flex flex-row gap-4 flex-wrap' />
      </div>
      <div className='mt-6'>
        <h2>Ideas Made Real</h2>
        <div className='mt-5 flex flex-row gap-4 flex-wrap' />
      </div>
      <p className='mt-8 text-center'>Wanna know how we make your ideas our reality? Let's find out.</p>
    </>
  )
}
