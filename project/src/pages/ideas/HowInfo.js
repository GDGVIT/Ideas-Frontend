import React from 'react'

export default function HowInfo() {
  return (
    <div>HowInfo
      <img src={require('../../assets/hanging-lights.png')} alt='lights' className='absolute h-10rem top-0 right-0 hanging-lights-position sm:block hidden' />
      <img src={require('../../assets/redline.png')} alt='line1' className='absolute line redline top-0 right-0' />
      <img src={require('../../assets/blueline.png')} alt='line2' className='absolute line blueline top-0 right-0' />
    </div>
  )
}
