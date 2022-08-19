import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import { setUserInfo, logout } from '../app/slices/authSlice'
import axios from '../axios'
import IdeaCard from '../components/IdeaCard'
import {enterstore} from '../app/slices/blackSlice'
import Skeleton from 'react-loading-skeleton'

export default function Landing () {
  const [enter, setEnter] = useState(false)
  const [trending, setTrending] = useState([])
  const [completed, setCompleted] = useState([])
  const auth = useSelector(state => state.auth)
  const black = useSelector(state => state.black)
  const dispatch = useDispatch()
  const [trendload, setTrendload] = useState(true)
  const [realload, setRealload] = useState(true)

  const getAuthToken = async (cred, dispatch) => {
    await axios
      .post('/auth/google', {
        token: cred
      })
      .then(res => {
        console.log(res.data)
        localStorage.setItem('email', res.data.data.email)
        localStorage.setItem('name', res.data.data.name)
        localStorage.setItem('familyName', res.data.data.familyName)
        localStorage.setItem('givenName', res.data.data.givenName)
        localStorage.setItem('googleId', res.data.data.googleId)
        localStorage.setItem('picture', res.data.data.picture)
        localStorage.setItem('_id', res.data.data._id)
        localStorage.setItem('token', res.data.token)
        dispatch(setUserInfo({ data: res.data.data, token: res.data.token }))
      })
  }

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (black.entered) {
      setEnter(true)
    }
    if (!enter) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      fetchTrending()
      fetchCompleted()
      dispatch(enterstore())
    }
  }, [enter, black, dispatch])

  const fetchTrending = () => {
    axios.get('/ideas',{headers: {
      authorization: auth.token
    },
    params: {
      trending:true
    }})
    .then((res) => {
      setTrending(res.data.ideas)
      setTrendload(false)
    })
  }

  const fetchCompleted = () => {
    axios.get('/ideas',{headers: {
      authorization: auth.token
    },
    params: {
      madeReal:true
    }})
    .then((res) => {
      setCompleted(res.data.ideas)
      setRealload(false)
    })
  }

  return (
    <div className='z-2'>
      <div className={`${enter || black.entered ? 'opacity-0 z-0' : 'opacity-100 z-4'} blackout top-0 left-0 fixed h-screen w-screen`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }} />
      <img src={require('../assets/lamp.png')} alt='lamp' className='absolute lg:w-8rem w-6rem mx-auto lamp-position' />
      <div className='flex flex-column w-screen relative px-6 rem-mar' style={{ overflow: 'hidden', marginLeft: '-6rem' }}>
        <img src={require('../assets/plantshelf.png')} alt='plantshelf' className='absolute h-6rem plantshelf-position' />
        <img src={require('../assets/books.png')} alt='plantshelf' className='absolute h-5rem books-position sm:block hidden' />
        <img src={require('../assets/board.png')} alt='plantshelf' className='absolute lg:h-18rem md:h-15rem board-position md:block hidden' />
        <img src={require('../assets/landingperson.png')} alt='plantshelf' className='absolute lg:h-22rem md:h-20rem board-position landing-person-position md:block hidden' />
        <div className={`${enter ? null : 'text-white'} hero lg:w-6 md:w-8 w-12 z-5`} id='hero'>
          <h1 className='landing-font  relative'>
            DSC Idea Hub
            <img className='landing-circle absolute' src={require('../assets/drawCircle2.svg').default} alt='stroke' />
          </h1>
          <p className='mt-5'>DSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
          </p>
          <p className='mt-5'>"Everything Begins With An Idea" – Earl Nightingale</p>
          {enter
            ? auth.token ? <Link to='/ideas/new'>
              <button className='primary-button mt-5 font-20'>Add an Idea</button>
            </Link>
            : <GoogleLogin className='mt-5'
            onSuccess={credentialResponse => {
              getAuthToken(credentialResponse.credential, dispatch)
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
            : <button href='#hero' onClick={() => setEnter(true)} className='primary-button mt-5 font-20'>Enter the Ideas Hub</button>}
        </div>

        <div className='relative'>
          <img src={require('../assets/bricks2.png')} alt='bricks' className='absolute h-3rem brick3-position top-0 right-0 sm:block hidden' />
          <h2 className='font-36 font-bold'>Trending Ideas</h2>
          {!trendload ? 
          <div className='mt-5 flex flex-row flex-wrap'>
          {trending.map((idea, index) => {
            return <IdeaCard masonry key={index} name={idea.title} description={idea.description} author={idea.author._id === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })}
          </div> : <Skeleton containerClassName='flex flex-column gap-2' className='border-round-xl' height={200} count={10} />}
        </div>
        <div className='mt-6'>
          <h2 className='font-36 font-bold'>Ideas Made Real</h2>
          {!realload ? 
          <div className='mt-5 flex flex-row flex-wrap'>
          {completed.map((idea, index) => {
            return <IdeaCard masonry key={index} name={idea.title} description={idea.description} author={idea.author._id === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })}
          </div>: <Skeleton containerClassName='flex flex-column gap-2' className='border-round-xl' height={200} count={10}/>}
        </div>
        <p className='mt-8 text-center'>Wanna know how we make your ideas our reality? <Link style={{'color':'#4D96FF'}} to='/how'>Let's find out.</Link></p>
      </div>
    </div>
  )
}
