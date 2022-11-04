import React, { useState, useEffect, useCallback } from 'react'
import axios from '../../axios'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setStatus } from '../../app/slices/notifSlice'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'

export default function EditIdea () {
  const dispatch = useDispatch()
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [title, setTitle] = useState('fetching...')
  const [description, setDesc] = useState('fetching...')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [isKeyReleased, setIsKeyReleased] = useState(false)
  const navigate = useNavigate()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

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
      .put(`/ideas/${id}`, postObject, {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setDesc('')
        setTitle('')
        setTags([])
        setTagInput('')
        toast.success('Idea edited!')
        navigate(`/ideas/${id}`)
      })
      // .catch(e => console.log(e))
    setSubmitLoading(false)
  }

  const getIdea = useCallback(
    async () => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          },
          params: {
            edit: true
          }
        })
        .then(res => {
          setTitle(res.data.idea.title)
          setDesc(res.data.idea.description)
          setTags(res.data.idea.tags)
          setFetchLoading(false)
        })
    }, [auth, id]
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

  useEffect(() => {
    if (auth.token) {
      getIdea()
    }
  }, [auth, id, getIdea])

  return (
    <Layout>
    <div>
      <div className='mt-6 grid gap-3 relative'>
        <div className='lg:w-6 md:w-7 sm:w-8 w-12'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl font-medium g-bold'>Edit Idea</h1>
          <form onSubmit={handleSubmit} className='md:p-5 p-2 flex flex-column gap-3 mt-3'>
            <div className='flex flex-column gap-2'>
              <label className='relative' htmlFor='title-input'>
                <img className='absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../../assets/drawCircle1.svg').default} alt='stroke' />
                Title
                {!fetchLoading
                  ? <span className='ml-3 font-16 bodytext'>{title.length ? `${50 - title.length} characters remaining` : null}</span>
                  : null}
              </label>
              <input disabled={fetchLoading} value={title} onChange={(e) => { setTitle(e.target.value) }} className={`input ${fetchLoading ? 'bodytext' : null}`} id='title-input' />
            </div>
            <div className='flex flex-column gap-2'>
              <label htmlFor='desc-input'>Description
                {!fetchLoading
                  ? <span className='ml-1 font-16 bodytext'>{description.length && description.length > 450 ? `${500 - description.length} characters remaining` : null}{description.length && description.length < 200 ? `${200 - description.length} more characters minimum` : null}</span>
                  : null}
              </label>
              <textarea disabled={fetchLoading} minLength={199} maxLength={500} value={description} onChange={(e) => { setDesc(e.target.value) }} rows={5} className={`input ${fetchLoading ? 'bodytext' : null}`} id='desc-input' />
            </div>
            <div className='flex flex-column gap-2'>
              <label htmlFor='tag-input'>Tags</label>
              <div className='flex align-items-center flex-row flex-wrap gap-3'>
                {tags.map((tag, index) => tag
                  ? (
                    <div className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>
                      <button type='button' className='mr-2 cross-button' onClick={() => deleteTag(index)}>x</button>
                      {tag}
                    </div>
                    )
                  : null)}
                <input
                  value={tagInput} disabled={fetchLoading} onChange={(e) => {
                    setTagInput(e.target.value)
                  }} onKeyUp={onKeyUp} onKeyDown={detectTagSep} className='w-12 input' id='tag-input'
                />
              </div>
            </div>
            <button type='submit' disabled={!title || !description || !tags || description.length < 200} className={((submitLoading || !title || !description || !tags || description.length < 200) ? 'disabled-button' : null) + ' primary-button mx-auto mt-5'}>Submit</button>
          </form>
        </div>
        <img src={require('../../assets/frame.png')} alt='frame' className='absolute h-3rem top-0 right-0 frame-position sm:block hidden' />
        <img src={require('../../assets/plant1.png')} alt='frame' className='absolute h-7rem bottom-0 right-0 mb-3 sm:block hidden' />
        <img src={require('../../assets/addIdeaPerson.png')} className='h-20rem hidden md:block absolute bottom-0 right-0 lg:mr-8 md:mr-5 mb-2 sm:block hidden' alt='addIdeaPerson' />
      </div>
    </div>
    </Layout>
  )
}
