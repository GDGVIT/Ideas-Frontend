import React from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId }) {

  date = dayjs(date).format('DD-MM-YYYY')
  return (
    <div className='flex-grow-1 border-round-xl p-3 bg-white ideacard relative'>
      <div className='flex flex-row gap-2 absolute top-0 right-0 m-3'>
        <p style={{color:'#FF6B6B'}}>17</p>
        <img src={require('../assets/hollowHeart.svg').default} alt='heart' />
      </div>
      <div style={{ fontSize: 20 }} className='flex gap-1 flex-row'>
        <p>{author}</p>
        <p className='bodytext'>|</p>
        <p className='datetext'>{date}</p>
      </div>
      <Link to={`/ideas/${ideaId}`}><p style={{ fontSize: 24 }} className='mt-3'>{name}</p></Link>
      <p style={{ fontSize: 16 }} className='mt-3 bodytext'>{description}</p>
      <div style={{ fontSize: 20 }} className='mt-3 flex flex-row flex-wrap gap-2'>
        {tags.map((tag, index) => {
          return <p className='p-1 px-3 border-round-xl' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
      </div>
    </div>
  )
}
