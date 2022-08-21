import React, { useEffect, useState, useCallback, useRef } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'

export default function NewIdea () {
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [description, setDesc] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [userIdeas, setUserIdeas] = useState([])
  const [isKeyReleased, setIsKeyReleased] = useState(false)
  const [ideaLoad, setIdeaLoad] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const prevRef = useRef(null)

  const auth = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    setSubmitLoading(true)
    e.preventDefault()
    const postObject = {
      idea: {
        title,
        description,
        tags
      }
    }
    await axios
      .post('/ideas', postObject, {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setDesc('')
        setTitle('')
        setTags([])
        setTagInput('')
        fetchUserPosts()
        toast.success("Idea submitted!")
      })
      .catch(e => console.log(e))
    setSubmitLoading(false)
  }

  const fetchUserPosts = useCallback(
    async () => {
      await axios
        .get(`/ideas/user/${auth._id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then((res) => {
          console.log(res.data)
          setUserIdeas(res.data.ideas.sort(function(a,b){
            return new Date(b.createdOn) - new Date(a.createdOn);
          }))
          setIdeaLoad(false)
        })
        .catch(e => console.log(e))
    }, [auth]
  )

  const detectTagSep = (e) => {
    const { key } = e
    const trimmedTagInput = tagInput.trim()

    if ((key === ',' || key === ' ') && trimmedTagInput.length && !tags.includes(trimmedTagInput)) {
      e.preventDefault()
      setTags(prevState => [...prevState, trimmedTagInput])
      setTagInput('')
    }

    if (key === 'Backspace' && !tagInput.length && tags.length && isKeyReleased) {
      e.preventDefault()
      const tagsCopy = [...tags]
      const poppedTag = tagsCopy.pop()

      setTags(tagsCopy)
      setTagInput(poppedTag)
    }

    setIsKeyReleased(false)
  }

  const onKeyUp = () => {
    setIsKeyReleased(true)
  }

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  const scrollToPrevious = () => {
    console.log("h")
    prevRef.current.scrollIntoView(true)
  }

  useEffect(() => {
    if (location.state?.toPrevious) {
      scrollToPrevious()
    }
  }, [location])

  useEffect(() => {
    if (auth.token) {
      fetchUserPosts()
    }
    window.scrollTo(0, 0);
  }, [auth, fetchUserPosts])

  return (
    <div>
      <div className='mt-6 grid gap-3 relative'>
        <div className='lg:w-6 md:w-7 sm:w-8 w-12'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl font-medium g-bold'>Add an Idea</h1>
          <form onSubmit={handleSubmit} className='md:p-5 p-2 flex flex-column gap-3 mt-3'>
            <label className='relative' htmlFor='title-input'>
              <img className='absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../../assets/drawCircle1.svg').default} alt='stroke' />
              Title
            </label>
            <input value={title} onChange={(e) => { setTitle(e.target.value) }} className='input' id='title-input' />
            <label htmlFor='desc-input'>Description <span className='font-16 bodytext'>{description.length ? `${500-description.length} characters remaining` : null}</span></label>
            <textarea maxLength={500} value={description} onChange={(e) => { setDesc(e.target.value) }} rows={5} className='input' id='desc-input' />
            <label htmlFor='tag-input'>Tags</label>
            <div className='flex align-items-center flex-row flex-wrap gap-3'>
              {tags.map((tag, index) => tag
                ? <div className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>
                  <button type='button' className='mr-2 cross-button' onClick={() => deleteTag(index)}>x</button>
                  {tag}
                </div>
                : null)}
              <input
                value={tagInput} onChange={(e) => {
                  setTagInput(e.target.value)
                }} onKeyUp={onKeyUp} onKeyDown={detectTagSep} className='w-12 input' id='tag-input'
              />
            </div>
            <button type='submit' disabled={!title || !description || !tags} className={((submitLoading || !title || !description || !tags) ? 'disabled-button' : null) + ' primary-button mx-auto mt-5'}>Submit</button>
          </form>
        </div>
        <img src={require('../../assets/frame.png')} alt='frame' className='absolute h-3rem top-0 right-0 frame-position sm:block hidden' />
        <img src={require('../../assets/plant1.png')} alt='frame' className='absolute h-7rem bottom-0 right-0 mb-3 sm:block hidden' />
        <img src={require('../../assets/addIdeaPerson.png')} className='h-20rem hidden md:block absolute bottom-0 right-0 lg:mr-8 md:mr-5 mb-2 sm:block hidden' alt='addIdeaPerson' />
      </div>
      <img src={require('../../assets/shelf.png')} alt='frame' className='absolute h-10rem top-0 right-0 shelf-position sm:block hidden' />
      <img src={require('../../assets/plant2.png')} alt='frame' className='absolute h-7rem left-0 top-0 plant2-position md:block hidden' />
      <div ref={prevRef} className='mt-8 grid gap-4 flex-grow-1 flex'>
        <div className='md:col-4 h-min col-12 md:sticky top-0'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl relative g-bold font-medium'>
            Your previous Ideas
            <img className='absolute lg:block md:hidden block' style={{ top: '2.7rem', left: '5.2rem' }} src={require('../../assets/drawUnderline1.svg').default} alt='stroke' />
          </h1>
          <p className='mt-4 font-16 bodytext'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material.</p>
        </div>
        {!ideaLoad ?
        <div className='md:col md:mt-8 mt-2 col-12 flex flex-column gap-5 relative'>
          <img src={require('../../assets/bricks.png')} alt='bricks' className='absolute h-3rem top-0 right-0 brick1-position sm:block hidden' />
          <img src={require('../../assets/bricks.png')} alt='bricks' className='absolute h-3rem top-0 left-0 brick2-position sm:block hidden' />
          {userIdeas.length ? userIdeas.map((idea, index) => {
            return <IdeaCard key={index} name={idea.title} description={idea.description} authorId={idea.author._id} author='You' tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          }) : <IdeaCard name='Oops' description='Nothing to see here.' tags={[]} disabled={true} />}
        </div> : <Skeleton containerClassName='flex flex-column gap-2 col' className='border-round-xl flex-grow-1' height={200} count={5}/>}
      </div>
    </div>
  )
}
