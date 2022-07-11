import React from 'react'
import { Link } from 'react-router-dom'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId }) {
  return (
    <div className='flex-grow-1 border-round-xl p-3 bg-white ideacard'>
      <div style={{ fontSize: 20 }} className='flex gap-1 flex-row'>
        <p>{author}</p>
        <p className='bodytext'>|</p>
        <p className='bodytext'>{date}</p>
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
