import React, { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import ConditionalLink from './ConditionalLink'
import axios from '../axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useVisibility } from 'reactjs-visibility'
import { setTrendingIndexEnd, setRealIndexEnd, setTrendingIndexStart, setRealIndexStart } from '../app/slices/slideshowSlice'

export default function IdeaCard ({ name, color, author, description, tags, date, ideaId, hearted, upvoteCount, comments, disabled, fixedWidth, masonry, authorId, ideaspage, horigrid, index, id, type, completed, unapproved, rejected, commNotif, showAdminButtons }) {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [heartFull, setHeartFull] = useState(hearted)
  const [upvoteCountNum, setUpvoteCountNum] = useState(upvoteCount)
  const [userId, setUserId] = useState('')
  const [mentionComments, setMentionComments] = useState([])

  const mentionReplacement = (match) => {
    const mention = JSON.parse(match.slice(2, match.length - 2))
    return `@ <span class='green'>${mention.value}</span>`
  }

  const visiOptions = {}

  const setIdeaStatus = (status) => {
    axios.post(`/admin/approve/${ideaId}`, {
      status
    }, {
      headers: {
        authorization: auth.token
      }
    })
  }
  const resetIdeaStatus = () => {
    axios.patch(`/admin/reset/${ideaId}`, {
      status: ""
    }, {
      headers: {
        authorization: auth.token
      }
    })
  }
  const makeReal = () => {
    
  }

  const handleChangeVisibility = (visible) => {
    if (visible) {
      if (type === 'trending') {
        dispatch(setTrendingIndexEnd(index))
      } else {
        dispatch(setRealIndexEnd(index))
      }
    } else {
      if (type === 'trending') {
        dispatch(setTrendingIndexStart(index))
      } else {
        dispatch(setRealIndexStart(index))
      }
    }
  }

  /* eslint-disable no-unused-vars */
  const { ref, visible } = useVisibility({
    onChangeVisibility: handleChangeVisibility,
    options: visiOptions
  })
  /* eslint-enable no-unused-vars */

  const doRegex = useCallback((input) => {
    const regex = /\[\[\{([^}]+)\}]]/gm
    if (regex.test(input)) {
      return input.replaceAll(regex, mentionReplacement)
    } else {
      return input
    }
  }, [])

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
      for (let i = 0; i < comments.length; i++) {
        comments[i].body = doRegex(comments[i].body)
        setMentionComments(mentionComments => [...mentionComments, comments[i]])
        setMentionComments(mentionComments => new Set(mentionComments))
        setMentionComments(mentionComments => Array.from(mentionComments))
      }
    }
  }, [])

  date = dayjs(date).format('DD-MM-YYYY')
  return (
    <div id={id} className={`${masonry ? 'xl:w-3 lg:w-4 md:w-6 w-12 md:px-3 py-3' : null}`}>
      {horigrid ? <span ref={ref} /> : null}
      <ConditionalLink condition={!disabled} to={`/ideas/${ideaId}`}>
        <div className={`flex-grow-1 border-round-xl py-4 px-5 bg-white ideacard relative ${ideaspage ? (showAdminButtons) ? 'h-29rem' : 'h-27rem' : 'h-full'} ${horigrid ? 'sm:w-20rem w-17rem sm:h-27rem h-30rem' : null}`}>
          {!disabled
            ? (
              <div className='flex flex-row gap-2 align-items-center absolute top-0 right-0 m-3'>
                {unapproved
                  ? (
                    <p className='p-1 px-3 font-12 text-white tag' style={{ backgroundColor: '#575757' }}>Unapproved</p>
                    )
                  : null}
                {completed
                  ? (
                    <p className='p-1 px-3 font-12 text-white tag' style={{ backgroundColor: '#6bcb77' }}>Made Real</p>
                    )
                  : null}
                {!unapproved && !completed
                  ? (
                    <p className='p-1 px-3 font-12 text-white tag' style={{ backgroundColor: '#3994ff' }}>In Progress</p>
                    )
                  : null}
                {rejected
                  ? (
                    <p className='p-1 px-3 font-12 text-white tag' style={{ backgroundColor: '#ff6b6b' }}>Rejected</p>
                    )
                  : null}
                <p style={{ color: '#FF6B6B' }}>{upvoteCountNum}</p>
                {heartFull
                  ? (
                    <img
                      onClick={(e) => {
                        e.stopPropagation(); e.preventDefault(); sendVote(0)
                      }} src={require('../assets/fullHeart.svg').default} alt='heart' style={{ height: '1.5rem' }}
                    />
                    )
                  : (
                    <img onClick={(e) => { e.stopPropagation(); e.preventDefault(); sendVote(1) }} src={require('../assets/hollowHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} />
                    )}
              </div>
              )
            : null}
          {author && authorId === userId &&
            <Link className='flex absolute bottom-0 right-0 m-3' to={`/ideas/edit/${ideaId}`}>
              <img className='pl-2 m-auto' src={require('../assets/edit-icon.svg').default} alt='edit' />
            </Link>}
          {author
            ? (
              <div className='bodytext font-16 grid gap-1 md:w-11 w-8 flex-row align-items-center mb-3 mt-5'>
                <p>{author}</p>
                <p>|</p>
                <p className='font-16 datetext'>{date}</p>
              </div>
              )
            : null}
          <p style={{ overflowWrap: 'break-word' }} className={`${commNotif ? 'mt-5' : null} md:font-24 font-20 g-med`}>{name}</p>
          {description
            ? <p style={{ fontSize: 16, wordBreak: 'break-word' }} className='mt-3 font-16 bodytext'>{!horigrid ? description.slice(0, 120) : description.slice(0, 75)}{description.length > 150 ? '...' : ''}</p>
            : null}
          {!disabled
            ? (
              <div style={{ fontSize: 20 }} className='mt-3 flex flex-row flex-wrap gap-2'>
                {tags.slice(0, 3).map((tag, index) => {
                  return <p className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
                })}
                {tags.length > 3
                  ? (
                    <p className='p-1 text-white font-16 px-3 tag' style={{ backgroundColor: '#F0B501' }}>
                      ...
                    </p>)
                  : null}
              </div>
              )
            : null}
          {comments && mentionComments.length
            ? (
              <div className='mt-6 flex flex-column gap-4'>
                {mentionComments.map((comment, index) => {
                  return (
                    <div key={index} className='grid gap-3'>
                      <img width={30} className='pfp' src={comment.author.picture} alt='pfp' referrerPolicy='no-referrer' />
                      <div className='flex-grow-1 col p-0'>
                        <p className='font-16'>{comment.authorName}</p>
                        <span style={{ wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: comment.body }} className='mt-1 bodytext font-16' />
                      </div>
                    </div>
                  )
                })}
              </div>
              )
            : null}
          {showAdminButtons
            ? (
              <div className='mt-6 absolute bottom-0 left-0 right-0 mb-3 w-full'>
                {rejected
                  ? (
                    <div className='flex flex-column align-items-center'>
                      <p className='font-16 red'>This idea was rejected.</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          resetIdeaStatus()
                        }}
                        className='blue flex-shrink-0 p-2 button text-button'
                      >Reset
                      </button>
                    </div>
                    )
                  : !unapproved
                      ? (
                        <div className='flex flex-column align-items-center'>
                          <p className='font-16 green'>This idea was approved.</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              resetIdeaStatus()
                            }}
                            className='blue flex-shrink-0 p-2 button text-button'
                          >Reset
                          </button>
                        </div>
                        )
                      : (
                        <span className='flex flex-row justify-content-evenly gap-5'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setIdeaStatus("approved")
                            }}
                            className='green flex-shrink-0 p-2 button text-button'
                          >Accept &#10003;
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setIdeaStatus("rejected")
                            }}
                            style={{ width: 'max-content' }}
                            className='red p-2 flex-shrink-0 button text-button'
                          >Reject &#x2718;
                          </button>
                        </span>
                        )}
              </div>
              )
            : null}
        </div>
      </ConditionalLink>
    </div>
  )
}
