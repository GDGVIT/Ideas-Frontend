import axios from '../../axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function SingleIdea () {
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [idea, setIdea] = useState({ tags: [] })
  const [comments, setComments] = useState([])
  const [newComment, getNewComment] = useState('')

  const getIdea = useCallback(
    async () => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdea(res.data.idea)
          setComments(res.data.comments)
        })
    }, [auth, id]
  )

  const submitComment = async (e) => {
    e.preventDefault()
    const commentObject = {
      commentBody: newComment
    }
    if (commentObject.commentBody !== '') {
      await axios
        .post(`/ideas/${id}/comments`, commentObject, {
          headers: {
            authorization: auth.token
          }
        }).then(() => {
          getNewComment('')
          getIdea()
        })
    }
  }

  useEffect(() => {
    if (auth.token) {
      getIdea()
    }
  }, [auth, id, getIdea])
  return (
    <div className='border-round-xl p-8 bg-white ideacard relative'>
      <img className='absolute top-0 left-0 m-5' src={require('../../assets/backArrow.svg').default} alt='back-arrow' />
      <div style={{ fontSize: 20 }} className='flex gap-1 flex-row'>
        <p>{idea.authorName}</p>
        <p className='bodytext'>|</p>
        <p className='datetext'>{idea.createdOn}</p>
      </div>
      <h1>{idea.title}</h1>
      <p className='mt-4 bodytext'>{idea.description}</p>
      <div style={{ fontSize: 20 }} className='mt-5 flex flex-row flex-wrap gap-2'>
        {idea.tags.map((tag, index) => {
          return <p className='p-1 px-3 border-round-xl' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
      </div>
      <div className='relative mt-7'>
        <form onSubmit={submitComment}>
          <input
            style={{ fontSize: 16 }}
            placeholder='Add a comment...' className='bodytext comment-input' value={newComment} onChange={(e) => { getNewComment(e.target.value) }}
          />
        </form>
        <img src={require('../../assets/messageSymbol.svg').default} alt='commentIcon' className='comment-icon absolute top-50 left-0' />
      </div>
      <div className='mt-6 px-6 flex flex-column gap-3'>
        {comments.map((comment, index) => {
          return (
            <div key={index}>
              <p>{comment.authorName}</p>
              <p>{comment.body}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
