import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from '../axios'
import { useSelector } from 'react-redux'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId, hearted, upvoteCount, comments, disabled }) {
  const auth = useSelector(state => state.auth)

  const [heartFull, setHeartFull] = useState(hearted)
  const [upvoteCountNum, setUpvoteCountNum] = useState(upvoteCount)

  const sendVote = (add) => {
    let voteType
    if (add) {
      voteType = 1
      setHeartFull(true)
      setUpvoteCountNum(upvoteCountNum + 1)
    } else {
      voteType = 0
      setUpvoteCountNum(upvoteCountNum - 1)
      setHeartFull(false)
    }
    axios.patch(`/ideas/${ideaId}/vote`, {
      voteType
    }, {
      headers: {
        authorization: auth.token
      }
    })
  }

  date = dayjs(date).format('DD-MM-YYYY')
  return (
    <div className='flex-grow-1 border-round-xl py-4 px-5 bg-white ideacard relative'>
      {!disabled ?
      <div className='flex flex-row gap-2 absolute top-0 right-0 m-3'>
        <p style={{ color: '#FF6B6B' }}>{upvoteCountNum}</p>
        {heartFull ? <img onClick={() => sendVote(0)} src={require('../assets/fullHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} /> : <img onClick={() => sendVote(1)} src={require('../assets/hollowHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} />}
      </div> : null}
      {author ? 
      <div className='bodytext font-16 grid gap-1 md:w-11 w-8 flex-row align-items-center mb-3'>
        <p>{author}</p>
        <p>|</p>
        <p className='font-16 datetext'>{date}</p>
      </div> :null }
      {!disabled ?
      <Link to={`/ideas/${ideaId}`}><p className='font-24'>{name}</p></Link> : <p className='font-24'>{name}</p>}
      {description ? 
      <p style={{ fontSize: 16 }} className='mt-3 font-16 bodytext'>{description}</p> : null}
      {!disabled ? 
      <div style={{ fontSize: 20 }} className='mt-3 flex flex-row flex-wrap gap-2'>
        {tags.map((tag, index) => {
          return <p className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
      </div> : null }
      {comments && comments.length ? 
      <div className='mt-6 flex flex-column gap-4'>
        {comments.map((comment, index) => {
          return (
            <div key={index} className='grid gap-4'>
              <img width={20} className='pfp' src={comment.author.picture} alt='pfp' referrerPolicy='no-referrer' />
              <div className='flex-grow-1'>
                <p className='font-16'>{comment.authorName}</p>
                <p className='mt-1 bodytext font-16'>{comment.body}</p>
              </div>
            </div>
          )
        })}
      </div> : null}
    </div>
  )
}
