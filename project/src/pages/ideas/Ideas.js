import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'
import { useSelector } from 'react-redux'

export default function Ideas () {
  const [ideas, setIdeas] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState('')
  const [userList, setUserList] = useState([])
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
    const fetchUsers = async () => {
      await axios
        .get('/user', {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setUserList(res.data.users)
        })
    }
    if (auth.token) {
      fetchIdeas()
      fetchUsers()
    }
  }, [auth])

  const searchIdeas = async (e) => {
    e.preventDefault()
    let userId = userList.filter(userItem => {
      return userItem.name === user
    })
    userId = userId[0]._id
    await axios
      .get(`/user/${userId}/ideas`, {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setIdeas(res.data.ideas)
      })
  }

  const deleteUserTag = () => {

  }

  const onKeyDown = (e) => {
    const {key} = e;

    if (key === ' ' && search.length) {
      e.preventDefault();
      setSearch(search+' ')

      if (search.split(' ')[search.split(' ').length-1].substring(0,5) === 'from:') {
        let start = search.indexOf('from:')
        let end = search.length
        console.log(start,end)
        console.log(search)
        setUser(search.substring(start+5,end))
        setSearch(search.replace(search.substring(start,end), ''))
      }
    }
  }

  return (
    <div className='grid gap-4'>
      <div className='h-min lg:sticky top-0 xl:col-4 lg:col-5 col-12'>
        <div className='flex-grow-1 flex flex-row border-round-xl p-3 bg-white ideacard align-items-center gap-3'>
          <img className='pfp' width={60} alt='pfp' src={auth.picture} />
          <p>{auth.name}</p>
        </div>
      </div>
      <div className='col-12 lg:col flex flex-column gap-6'>
        <div className='align-items-center relative w-full flex gap-4 flex-row'>
          {user ?
          <div className='h-min p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }}>
          <button type='button' className='mr-2 cross-button' onClick={() => deleteUserTag()}>x</button>
          from:{user}
        </div> : null}
          <form className='relative flex-grow-1' onSubmit={searchIdeas}>
            <input placeholder='Search for Ideas' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={onKeyDown} className='w-full ideasearch-input' />
            <img className='absolute top-0 bottom-0 left-0 ml-3 my-auto' src={require('../../assets/searchglass.svg').default} alt='searchglass' />
          </form>
        </div>
        <div className='flex flex-column gap-5'>
          {ideas.map((idea, index) => {
            return <IdeaCard key={index} name={idea.title} description={idea.description} author={idea.author === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })}
        </div>
      </div>
    </div>
  )
}
