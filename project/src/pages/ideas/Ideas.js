import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'

export default function Ideas () {
  const [ideas, setIdeas] = useState
  ([])

  const fetchIdeas = async () => {
    await axios
      .get('/ideas', {
        headers: {
          authorization: localStorage.getItem('token')
        }
      })
      .then(res => {
        setIdeas(res.data.ideas)
      })
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  return (
    <div className='grid gap-4'>
      <div className='xl:col-4 lg:col-5 col-12'>
        <div className='flex-grow-1 flex flex-row border-round-xl p-3 bg-white ideacard align-items-center gap-3'>
          <img className='pfp' width={60} alt='pfp' src={localStorage.getItem('picture')} />
          <p>{localStorage.getItem('name')}</p>
        </div>
      </div>
      <div className='col-12 lg:col gap-5 flex flex-column'>
        {ideas.map((idea, index) => {
          return <IdeaCard key={index} name={idea.title} description={idea.description} author={idea.author === localStorage.getItem('id') ? 'You' : idea.author} tags={idea.tags} date={idea.date} />
        })}
      </div>
    </div>
  )
}
