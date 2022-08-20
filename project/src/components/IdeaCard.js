import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import ConditionalLink from './ConditionalLink'
import axios from '../axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId, hearted, upvoteCount, comments, disabled, fixedWidth, masonry, authorId }) {
  const auth = useSelector(state => state.auth)

  const [heartFull, setHeartFull] = useState(hearted)
  const [upvoteCountNum, setUpvoteCountNum] = useState(upvoteCount)
  const [userId, setUserId] = useState('')

  const mentionReplacement = (match) => {
    let mention = JSON.parse(match.slice(2,match.length-2))
    return `@ <span class='green'>${mention.value}</span>`
  }

  function doRegex(input) {
    let regex = /\[\[\{([^}]+)\}]]/gm;
    if (regex.test(input)) {
      return input.replaceAll(regex, mentionReplacement);
    } else {
      return input
    }
  }

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

  useEffect(() => {
    setUserId(auth._id)
    if (comments) {
      for (let i = 0; i<comments.length ; i++) {
        comments[i].body = doRegex(comments[i].body);
        console.log(comments[i].body)
      }
    }
  }, [auth])

  date = dayjs(date).format('DD-MM-YYYY')
  return (
    <div className={`${masonry ? 'xl:w-3 lg:w-4 md:w-6 w-12 p-3' : null}`}>
    <ConditionalLink condition={!disabled} to={`/ideas/${ideaId}`}>
    <div className={`flex-grow-1 border-round-xl py-4 px-5 bg-white ideacard relative h-full`}>
      {!disabled ?
      <div className='flex flex-row gap-2 absolute top-0 right-0 m-3'>
        <p style={{ color: '#FF6B6B' }}>{upvoteCountNum}</p>
        {heartFull ? <img onClick={(e) => {e.stopPropagation();e.preventDefault();sendVote(0);
        }} src={require('../assets/fullHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} /> : <img onClick={(e) => {e.stopPropagation();e.preventDefault();sendVote(1)}} src={require('../assets/hollowHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} />}
      </div> : null}
      {author && authorId === userId && <Link className='flex absolute bottom-0 right-0 m-3' to={`/ideas/edit/${ideaId}`}>
        <img className='pl-2 m-auto' src={require('../assets/edit-icon.svg').default} alt='edit'></img>
      </Link>}
      {author ? 
      <div className='bodytext font-16 grid gap-1 md:w-11 w-8 flex-row align-items-center mb-3'>
        <p>{author}</p>
        <p>|</p>
        <p className='font-16 datetext'>{date}</p>
      </div> :null }
      <p className='md:font-24 font-20'>{name}</p>
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
                <span dangerouslySetInnerHTML={{__html:comment.body}} className='mt-1 bodytext font-16'></span>
              </div>
            </div>
          )
        })}
      </div> : null}
    </div>
    </ConditionalLink>
    </div>
  )
}
