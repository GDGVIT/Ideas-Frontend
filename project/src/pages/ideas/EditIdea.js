import React, { useState,useEffect,useCallback } from 'react'
import axios from '../../axios'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function EditIdea() {
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [title, setTitle] = useState('')
  const [description, setDesc]= useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [isKeyReleased, setIsKeyReleased] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
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
      .catch(e => console.log(e))
  }

  const getIdea = useCallback(
    async () => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setTitle(res.data.idea.title)
          setDesc(res.data.idea.description)
          setTags(res.data.idea.tags)
        })
    },[auth,id]
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
  },[auth, id, getIdea])
  

  return (
    <div>
      <div className='mt-6 grid gap-3 relative'>
        <div className='lg:w-6 md:w-7 sm:w-8 w-12'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl font-medium'>Edit Idea</h1>
          <form onSubmit={handleSubmit} className='md:p-5 p-2 flex flex-column gap-3 mt-3'>
            <label className='relative' htmlFor='title-input'>
              <img className='absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../../assets/drawCircle1.svg').default} alt='stroke' />
              Title
            </label>
            <input value={title} onChange={(e) => { setTitle(e.target.value) }} className='input' id='title-input' />
            <label htmlFor='desc-input'>Description</label>
            <textarea value={description} onChange={(e) => { setDesc(e.target.value) }} rows={5} className='input' id='desc-input' />
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
            <button type='submit' disabled={!title || !description || !tags} className={((!title || !description || !tags) ? 'disabled-button' : null) + ' primary-button mx-auto mt-5'}>Submit</button>
          </form>
        </div>
        <img src={require('../../assets/frame.png')} alt='frame' className='absolute h-3rem top-0 right-0 frame-position sm:block hidden' />
        <img src={require('../../assets/plant1.png')} alt='frame' className='absolute h-7rem bottom-0 right-0 mb-3 sm:block hidden' />
        <img src={require('../../assets/addIdeaPerson.png')} className='h-20rem hidden md:block absolute bottom-0 right-0 lg:mr-8 md:mr-5 mb-2 sm:block hidden' alt='addIdeaPerson' />
      </div>
    </div>
  )
}