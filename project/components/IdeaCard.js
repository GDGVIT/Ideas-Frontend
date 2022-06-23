import React from 'react'

export default function IdeaCard () {
  return (
    <div className='flex-grow-1 md:max-w-30rem border-round-xl w-18rem px-4 py-6 bg-white ideacard'>
      <div className='flex flex-row justify-content-between'>
        <p>Idea Name</p>
        <span style={{ color: '#FF6B6B' }}>&#9829;</span>
      </div>
      <p className='mt-3'>Author Name</p>
      <p>Date</p>
      <p className='mt-3'>Lorem ipsum and some assorted information about the project which is apparently trending.</p>
      <div className='mt-6 flex flex-row gap-2'>
        <button className='border-round-xl flex-grow-1'>One</button>
        <button className='border-round-xl flex-grow-1'>Two</button>
      </div>
    </div>
  )
}
