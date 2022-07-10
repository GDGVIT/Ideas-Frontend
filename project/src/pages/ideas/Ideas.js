import React from 'react'

export default function Ideas () {
  return (
    <div className='flex flex-row gap-4'>
      <div className='col-3'>
        <div className='flex-grow-1 flex flex-row border-round-xl p-3 bg-white ideacard'>
          <img alt='pfp' src={localStorage.getItem('picture')}></img>
          <p>{localStorage.getItem('name')}</p>
        </div>
      </div>
      <div className='col' />
    </div>
  )
}
