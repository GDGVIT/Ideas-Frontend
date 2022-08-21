import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import ConditionalLink from './ConditionalLink'
import axios from '../axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useCallback } from 'react'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId, hearted, upvoteCount, comments, disabled, fixedWidth, masonry, authorId, ideaspage }) {
  const auth = useSelector(state => state.auth)

  const [heartFull, setHeartFull] = useState(hearted)
  const [upvoteCountNum, setUpvoteCountNum] = useState(upvoteCount)
  const [userId, setUserId] = useState('')
  const [mentionComments, setMentionComments] = useState([])

  const mentionReplacement = (match) => {
    let mention = JSON.parse(match.slice(2,match.length-2))
    return `@ <span class='green'>${mention.value}</span>`
  }

  const doRegex = useCallback((input) => {
    let regex = /\[\[\{([^}]+)\}]]/gm;
    if (regex.test(input)) {
      return input.replaceAll(regex, mentionReplacement);
    } else {
      return input
    }
  },[])

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
  }, [auth])

  useEffect(() => {
    if (comments) {
      for (let i = 0; i<comments.length ; i++) {
        comments[i].body = doRegex(comments[i].body);
        setMentionComments(mentionComments => [...mentionComments,comments[i]])
        setMentionComments(mentionComments => new Set(mentionComments))
        setMentionComments(mentionComments => Array.from(mentionComments))
      }
    }
  },[])

  date = dayjs(date).format('DD-MM-YYYY')
  return (
    <div className={`${masonry ? 'xl:w-3 lg:w-4 md:w-6 w-12 md:px-3 py-3' : null}`}>
    <ConditionalLink condition={!disabled} to={`/ideas/${ideaId}`}>
    <div className={`flex-grow-1 border-round-xl py-4 px-5 bg-white ideacard relative ${ideaspage ? 'h-25rem' : 'h-full'}`}>
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
      <p className='md:font-24 font-20 g-med'>{name}</p>
      {description ? 
      <p style={{ fontSize: 16 }} className='mt-3 font-16 bodytext'>{description.slice(0,150)}{description.length>150 ? '...' : ''}</p> : null}
      {!disabled ? 
      <div style={{ fontSize: 20 }} className='mt-3 flex flex-row flex-wrap gap-2'>
        {tags.slice(0,3).map((tag, index) => {
          return <p className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
        {tags.length > 3 ? <p className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }}>...</p> : null}
      </div> : null }
      {comments && mentionComments.length ? 
      <div className='mt-6 flex flex-column gap-4'>
        {mentionComments.map((comment, index) => {
          return (
            <div key={index} className='grid gap-3'>
              <img width={30} className='pfp' src={comment.author.picture} alt='pfp' referrerPolicy='no-referrer' />
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
