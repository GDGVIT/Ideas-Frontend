import axios from '../../axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export default function SingleIdea () {
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [idea, setIdea] = useState({ tags: [] })
  const [upvotes, setUpvotes] = useState([])
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [date, setDate] = useState('')
  const [hearted, setHearted] = useState(false)
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
          setDate(dayjs(res.data.idea.createdOn).format('DD-MM-YYYY'))
          setUpvotes(res.data.idea.upvotes)
          setUpvoteCount(res.data.idea.upvotes.length)
          if (res.data.idea.upvotes.includes(auth._id)) {
            setHearted(true)
          }
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

  const sendVote = (add) => {
    let voteType
    if (add) {
      voteType = 1;
      setHearted(true)
      setUpvoteCount(upvoteCount+1)
    } else {
      voteType = 0;
      setUpvoteCount(upvoteCount-1)
      setHearted(false)
    }
    axios.patch(`/ideas/${id}/vote`, {
      voteType
    }, {
      headers: {
        authorization: auth.token
      }
    })
  }

  useEffect(() => {
    if (auth.token) {
      getIdea()
    }
  }, [auth, id, getIdea])

  return (
    <div className='border-round-xl p-8 bg-white ideacard relative'>
      <Link to='/ideas'>
        <img className='absolute top-0 left-0 m-5' src={require('../../assets/backArrow.svg').default} alt='back-arrow' />
      </Link>
      <div className='flex flex-row gap-8'>
        <div>
          <div className='flex gap-1 flex-row align-items-center'>
            <p className='bodytext font-20'>{idea.authorName}</p>
            <p className='font-20 bodytext'>|</p>
            <p className='font-16 datetext'>{date}</p>
          </div>
          <h1 className='font-bold'>{idea.title}</h1>
        </div>
        <div className='flex flex-row gap-2 h-min mt-auto'>
          <p style={{color:'#FF6B6B'}}>{upvoteCount}</p>
          { hearted ? <img onClick={() => sendVote(0)} src={require(`../../assets/fullHeart.svg`).default} alt='heart' /> : <img onClick={() => sendVote(1)} src={require(`../../assets/hollowHeart.svg`).default} alt='heart' />}
        </div>
      </div>
      <p className='mt-4 bodytext font-16'>{idea.description}</p>
      <div className='font-20 text-white mt-5 flex flex-row flex-wrap gap-2'>
        {idea.tags.map((tag, index) => {
          return <p className='p-1 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
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
      <div className='mt-6 px-6 flex flex-column gap-4'>
        {comments.map((comment, index) => {
          return (
            <div key={index}>
              <p className='font-20'>{comment.authorName}</p>
              <p className='mt-1 bodytext font-16'>{comment.body}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
