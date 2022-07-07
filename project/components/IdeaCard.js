import React from 'react'

export default function IdeaCard ({name, color, author, description, tags, date}) {
  return (
    <div className='flex-grow-1 border-round-xl p-3 bg-white ideacard'>
      <div className="flex gap-1 flex-row">
        <p>{author}</p>
        <p>|</p>
        <p>{date}</p>
      </div>
      <p className='mt-3'>{name}</p>
      <p className='mt-3'>{description}</p>
      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {tags.map((tag, index) => {
          return <p className='p-2 border-round-md' style={{'backgroundColor': '#F0B501'}} key={index}>{tag}</p>
        })}
      </div>
    </div>
  )
}
