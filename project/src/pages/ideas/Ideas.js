import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'
import { useSelector } from 'react-redux'

export default function Ideas () {
  const [ideas, setIdeas] = useState([])
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const fetchIdeas = async () => {
      await axios
        .get('/ideas', {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdeas(res.data.ideas)
        })
    }
    if (auth.token) {
      fetchIdeas()
    }
  }, [auth])

  return (
    <div className='grid gap-4'>
      <div className='h-min lg:sticky top-0 xl:col-4 lg:col-5 col-12'>
        <div className='flex-grow-1 flex flex-row border-round-xl p-3 bg-white ideacard align-items-center gap-3'>
          <img className='pfp' width={60} alt='pfp' src={auth.picture} />
          <p>{auth.name}</p>
        </div>
      </div>
      <div className='col-12 lg:col gap-5 flex flex-column'>
        {ideas.map((idea, index) => {
          return <IdeaCard key={index} name={idea.title} description={idea.description} author={idea.author === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} />
        })}
      </div>
    </div>
  )
}
