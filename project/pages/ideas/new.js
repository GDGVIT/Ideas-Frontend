import React, { useEffect, useState } from 'react'
import styles from './newIdeas.module.css'
import axios from '../../axios'

export default function newIdea () {
  const [title, setTitle] = useState('')
  const [description, setDesc] = useState('')
  const [tags, setTags] = useState('')
  const [userIdeas, setUserIdeas] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const tagList = tags.split(',')
    const postObject = {
      idea: {
        title,
        description,
        tags: tagList
      }
    }
    await axios
      .post('/ideas', postObject, {
        headers: {
          authorization: localStorage.getItem('token')
        }
      })
      .then(res => {
        setDesc('')
        setTitle('')
        setTags('')
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      await axios
        .get(`/ideas/user/${localStorage.getItem('id')}`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        })
        .then((res) => {
          console.log(res.data)
          setUserIdeas(res.data.ideas)
        })
        .catch(e => console.log(e))
    }
    fetchUserPosts()
  }, [userIdeas])

  return (
    <>
      <div className='mt-8'>
        <h1>Add an Idea</h1>
        <form onSubmit={handleSubmit} className='p-5 flex flex-column lg:w-6 md:w-7 w-12 gap-3 mt-3'>
          <label htmlFor='title-input'>Title</label>
          <input value={title} onChange={(e) => { setTitle(e.target.value) }} className={styles.input} id='title-input' />
          <label htmlFor='desc-input'>Description</label>
          <textarea value={description} onChange={(e) => { setDesc(e.target.value) }} rows={5} className={styles.input} id='desc-input' />
          <label htmlFor='tag-input'>Tags</label>
          <input value={tags} onChange={(e) => { setTags(e.target.value) }} className={styles.input} id='tag-input' />
          <button className='primary-button mx-auto mt-5'>Submit</button>
        </form>
      </div>
      <div className='mt-8'>
        <h1>Your previous Ideas</h1>
        {userIdeas.map((idea, index) => {
          return <p key={index}>{idea.title}</p>
        })}
      </div>
    </>
  )
}
