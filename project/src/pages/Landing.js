import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import { setUserInfo } from '../app/slices/authSlice'
import axios from '../axios'
import IdeaCard from '../components/IdeaCard'
import { enterstore, initialiseEnter } from '../app/slices/blackSlice'
import Skeleton from 'react-loading-skeleton'
import { setStatus } from '../app/slices/notifSlice'
import { setTrendingIndexEnd, setRealIndexEnd } from '../app/slices/slideshowSlice'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

export default function Landing () {
  const navigate = useNavigate()
  const [enter, setEnter] = useState(false)
  const [trending, setTrending] = useState([])
  const [completed, setCompleted] = useState([])
  const auth = useSelector(state => state.auth)
  const black = useSelector(state => state.black)
  const slideshow = useSelector(state => state.slideshow)
  const dispatch = useDispatch()
  const [trendload, setTrendload] = useState(true)
  const [realload, setRealload] = useState(true)

  const trendingScrollRight = (step) => {
    let card
    if (slideshow.trendingEnd + step >= 0 && slideshow.trendingEnd + step < trending.length) {
      card = document.getElementById(`trending${slideshow.trendingEnd + step}`)
      dispatch(setTrendingIndexEnd(slideshow.trendingEnd + step))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    } else if (slideshow.trendingEnd + step < 0) {
      card = document.getElementById(`trending${0}`)
      dispatch(setTrendingIndexEnd(0))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    } else {
      card = document.getElementById(`trending${trending.length - 1}`)
      dispatch(setTrendingIndexEnd(trending.length - 1))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }

  const realScrollRight = (step) => {
    let card
    if (slideshow.realEnd + step >= 0 && slideshow.realEnd + step < completed.length) {
      card = document.getElementById(`real${slideshow.realEnd + step}`)
      dispatch(setRealIndexEnd(slideshow.realEnd + step))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    } else if (slideshow.realEnd + step < 0) {
      card = document.getElementById(`real${0}`)
      dispatch(setRealIndexEnd(0))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    } else {
      card = document.getElementById(`real${completed.length - 1}`)
      dispatch(setRealIndexEnd(completed.length - 1))
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }

  useEffect(() => {
    const getNotifs = () => {
      axios.get('/notifications', {
        headers: {
          authorization: auth.token
        }
      }).then(res => {
        dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
      })
    }
    if (auth.token) {
      getNotifs()
    }
  }, [auth, dispatch])

  const getAuthToken = async (cred, dispatch) => {
    await axios
      .post('/auth/google', {
        token: cred
      })
      .then(res => {
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
      .catch((e) => {
        toast.error("Login failed.")
      })
  }

  window.onbeforeunload = function () {
    window.scrollTo(0, 0)
  }

  const fetchTrending = useCallback(() => {
    axios.get('/ideas', {
      headers: {
        authorization: auth.token
      },
      params: {
        trending: true
      }
    })
      .then((res) => {
        setTrending(res.data.ideas.sort(function (a, b) {
          return new Date(b.createdOn) - new Date(a.createdOn)
        }))
        setTrendload(false)
      })
  },[auth])

  const fetchCompleted = useCallback(() => {
    axios.get('/ideas', {
      headers: {
        authorization: auth.token
      },
      params: {
        madeReal: true
      }
    })
      .then((res) => {
        setCompleted(res.data.ideas.sort(function (a, b) {
          return new Date(b.createdOn) - new Date(a.createdOn)
        }))
        setRealload(false)
      })
  },[auth])

  useEffect(() => {
    dispatch(initialiseEnter())
    if (black.entered) {
      setEnter(true)
    }
    if (!enter) {
      // document.body.style.overflow = 'hidden'
    } else {
      // document.body.style.overflow = 'unset'
      fetchTrending()
      fetchCompleted()
      dispatch(enterstore())
    }
  }, [enter, black, dispatch, fetchCompleted, fetchTrending])

  return (
    <div className='z-2'>
      <div className={`${enter || black.entered ? 'opacity-0 z-0' : 'opacity-100 z-4'} blackout top-0 left-0 fixed h-screen w-screen`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }} />
      <img src={require('../assets/lamp.png')} alt='lamp' className='absolute lg:w-8rem w-6rem mx-auto lamp-position' />
      <div className='flex flex-column w-screen relative px-6 rem-mar' style={{ overflow: 'hidden', marginLeft: '-6rem' }}>
        <img src={require('../assets/plantshelf.png')} alt='plantshelf' className='absolute h-6rem plantshelf-position' />
        <img src={require('../assets/books.png')} alt='plantshelf' className='absolute h-5rem books-position sm:block hidden' />
        <img src={require('../assets/board.png')} alt='plantshelf' className='absolute lg:h-18rem md:h-15rem board-position md:block hidden' />
        <img src={require('../assets/landingperson.png')} alt='plantshelf' className='absolute lg:h-22rem md:h-20rem board-position landing-person-position md:block hidden' />
        <div className={`${enter ? null : 'text-white'} hero lg:w-6 md:w-8 w-12 ${black.entered ? 'z-2' : 'z-5'}`} id='hero'>
          <h1 className='z-2 g-bold landing-font  relative'>
            GDSC Idea Hub
            <img className='landing-circle absolute' src={require('../assets/drawCircle2.svg').default} alt='stroke' />
          </h1>
          <p className='mt-5'>GDSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
          </p>
          <p className='mt-5 mb-5'><i>"Everything Begins With An Idea" – Earl Nightingale</i></p>
          {enter
            ? auth.token
              ? <Link to='/ideas/new'>
                <button className='primary-button font-20'>Add an Idea</button>
              </Link>
              : <GoogleLogin
                  className='mt-5'
                  onSuccess={credentialResponse => {
                    getAuthToken(credentialResponse.credential, dispatch)
                  }}
                  onError={() => {
                    toast.error("Login failed.")
                  }}
                />
            : <button href='#hero' onClick={() => setEnter(true)} className='primary-button mt-5 font-20'>Enter the Ideas Hub</button>}
          <p onClick={() => navigate('/how')} style={{ color: '#4D96FF', width: 'fit-content' }} className='button mt-4'>How does this work?</p>
        </div>
        
        {enter ? 
        <div className='relative'>
          <img src={require('../assets/bricks2.png')} alt='bricks' className='absolute h-3rem brick3-position top-0 right-0 sm:block hidden' />
          <h2 className='font-36 g-bold'>Trending Ideas</h2>
          {!trendload
            ? <div className='horigrid-container relative'>
              <span onClick={() => trendingScrollRight(-3)} className='button z-2 arrow-container md:block hidden h-full w-3rem absolute top-0 left-0'>
                <img className='arrow-icon absolute h-3rem top-50 left-0' alt='left-arrow' src={require('../assets/arrow-left.svg').default} />
              </span>
              <div className='mt-5 px-3 pb-2 horigrid overflow-scroll flex-row gap-5'>
                <span className='grid-space-span' />
                {trending.map((idea, index) => {
                  return <IdeaCard type='trending' index={index} id={'trending' + index} key={'trending' + index} horigrid name={idea.title} description={idea.description} ideaspage authorId={idea.author._id} author={idea.author._id === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
                })}
                <span className='grid-space-span' />
              </div>
              <span onClick={() => trendingScrollRight(2)} className='button z-2 arrow-container md:block hidden h-full w-3rem absolute top-0 right-0'>
                <img className='arrow-icon absolute h-3rem top-50 left-0' alt='right-arrow' src={require('../assets/arrow-right.svg').default} />
              </span>
            </div>
            : <Skeleton containerClassName='flex flex-column gap-2 mt-4' className='border-round-xl' height={250} count={1} />}
        </div> : null }
        {enter ? 
        <div className='mt-6 relative'>
          <img src={require('../assets/cupboard.png')} alt='bricks' className='absolute h-13rem cupboard-position top-0 right-0 sm:block hidden' />
          <img src={require('../assets/web.png')} alt='bricks' className='absolute h-8rem web-position left-0 sm:block hidden' />
          <h2 className='font-36 g-bold'>Ideas Made Real</h2>
          {!realload
            ? completed.length
              ? <div className='horigrid-container relative'>
                <span onClick={() => realScrollRight(-3)} className='button z-2 arrow-container md:block hidden h-full w-3rem absolute top-0 left-0'>
                  <img className='arrow-icon absolute h-3rem top-50 left-0' alt='left-arrow' src={require('../assets/arrow-left.svg').default} />
                </span>
                <div className='mt-5 px-3 pb-2 horigrid overflow-scroll flex-row gap-5'>
                  <span className='grid-space-span' />
                  {completed.map((idea, index) => {
                    return <IdeaCard type='real' index={index} id={'real' + index} key={'real' + index} name={idea.title} description={idea.description} horigrid ideaspage authorId={idea.author._id} author={idea.author._id === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
                  })}
                  <span className='grid-space-span' />
                </div>
                <span onClick={() => realScrollRight(2)} className='button z-2 arrow-container md:block hidden h-full w-3rem absolute top-0 right-0'>
                  <img className='arrow-icon absolute h-3rem top-50 left-0' alt='right-arrow' src={require('../assets/arrow-right.svg').default} />
                </span>
              </div>
              : <p className='bodytext mt-4'>No ideas made real yet 😔</p>
            : <Skeleton containerClassName='flex flex-column gap-2 mt-4' className='border-round-xl' height={250} count={1} />}
        </div> : null }
        {enter ?
        <p className='mt-8 text-center'>Wanna know how we make your ideas our reality? <Link style={{ color: '#4D96FF' }} to='/how'>Let's find out.</Link></p>
        :null }
      </div>
    </div>
  )
}
