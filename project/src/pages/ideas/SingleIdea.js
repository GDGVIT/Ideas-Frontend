import axios from '../../axios'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import styles from './singleIdea.css'
import { MixedTags } from '@yaireo/tagify/dist/react.tagify'
import { setStatus } from '../../app/slices/notifSlice'

export default function SingleIdea () {
  /* eslint-disable no-unused-vars */
  const dispatch = useDispatch()
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [idea, setIdea] = useState({ tags: [] })
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [date, setDate] = useState('')
  const [hearted, setHearted] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, getNewComment] = useState('')
  const [submitCommentLoading, setSubmitCommentLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()
  const [userStrings, setUserStrings] = useState([])
  const [users, setUsers] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [warned, setWarned] = useState(false)
  const commentRef = useRef(newComment)
  const authRef = useRef(auth)
  const [userMentions, setUserMentions] = useState([])
  const mentionsRef = useRef(userMentions)

  const tagifyRef = useRef()
  const enterRef = useRef(true)

  const [tagSettings, setTagSettings] = useState({
    pattern: /@/,
    dropdown: {
      enabled: 1,
      position: 'text'
    }
  })
  /* eslint-enable no-unused-vars */

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

  const onInput = (e) => {
    const prefix = e.detail.prefix
    if (prefix === '@') {
      enterRef.current = false
    }
    getNewComment(e.detail.textContent)
    commentRef.current = e.detail.textContent
  }

  const onChange = (e) => {
    getNewComment(e.detail.value)
    commentRef.current = e.detail.value
  }

  const fetchUsers = useCallback(async () => {
    await axios
      .get('/user', {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setUsers(res.data.users)
        setUserStrings(res.data.users.map(a => a.name))
        setUserStrings(state => {
          tagifyRef.current.whitelist = state
          return state
        })
      })
  }, [auth])

  const mentionReplacement = (match) => {
    const mention = JSON.parse(match.slice(2, match.length - 2))
    return `@ <span class='green'>${mention.value}</span>`
  }

  function doRegex (input) {
    const regex = /\[\[\{([^}]+)\}]]/gm
    if (regex.test(input)) {
      return input.replaceAll(regex, mentionReplacement)
    } else {
      return input
    }
  }

  const doSubmitRegex = (input) => {
    const regex = /\{([^}]+)\}/gm
    const mentions = input.matchAll(regex)
    for (const mention of mentions) {
      const mentionedName = JSON.parse(mention[0]).value
      const mentionId = users.find(u => u.name === mentionedName)
      setUserMentions(userMentions => [...userMentions, { _id: mentionId._id, userName: mentionedName }])
      mentionsRef.current.push({ _id: mentionId._id, username: mentionedName })
    }
  }

  const getIdea = useCallback(
    async (e) => {
      await axios
        .get(`/ideas/${id}`)
        .then(res => {
          if (e) e.target.src = require('../../assets/trash-bin.svg').default
          setIdea(res.data.idea)
          setDate(dayjs(res.data.idea.createdOn).format('DD-MM-YYYY'))
          setUpvoteCount(res.data.idea.upvotes.length)
          if (res.data.idea.upvotes.includes(auth._id)) {
            setHearted(true)
          }
          for (let i = 0; i < res.data.comments.length; i++) {
            res.data.comments[i].body = doRegex(res.data.comments[i].body)
          }
          setComments(res.data.comments.reverse())
          setCommentsLoading(false)
          setSubmitCommentLoading(false)
        })
    }, [auth, id]
  )

  const submitComment = async (e) => {
    setSubmitCommentLoading(true)
    e.preventDefault()
    doSubmitRegex(commentRef.current)
    const commentObject = {
      commentBody: commentRef.current,
      mentions: mentionsRef.current
    }
    if (commentObject.commentBody !== '') {
      axios
        .post(`/ideas/${id}/comments`, commentObject, {
          headers: {
            authorization: authRef.current.token
          }
        }).then(() => {
          getNewComment('')
          getIdea()
          document.getElementsByClassName('tagify__input')[0].innerHTML = null
          toast.success('Comment submitted!')
          // setUserMentions([])
        }).catch((e) => {
          if (e.response.status === 401) {
            toast.error('You need to be logged in to comment.')
          }
          setSubmitCommentLoading(false)
        })
    } else {
      setSubmitCommentLoading(false)
    }
  }

  const sendVote = (add) => {
    let voteType
    if (add) {
      voteType = 1
      setHearted(true)
      setUpvoteCount(upvoteCount + 1)
    } else {
      voteType = 0
      setUpvoteCount(upvoteCount - 1)
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

  const deleteWarn = () => {
    toast.warn('Click again to delete.')
    setWarned(true)
  }

  const deleteIdea = async () => {
    await axios.delete(`/ideas/${id}`, {
      headers: {
        authorization: auth.token
      }
    })
      .then(() => {
        toast.success('Idea deleted :(')
        navigate('/ideas')
      })
  }

  const deleteComment = async (commentId, e) => {
    e.target.src = require('../../assets/spinner.gif')
    await axios.delete(`/ideas/comments/${commentId}`, {
      headers: {
        authorization: auth.token
      }
    })
      .then(() => {
        getIdea(e)
      })
  }

  useEffect(() => {
    document.getElementsByClassName('tagify__input')[0].addEventListener('keydown', (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        return false
      }
    })
  }, [])

  useEffect(() => {
    getIdea()
    if (auth.token) {
      authRef.current = auth
      setUserId(auth._id)
      fetchUsers()
    }
  }, [auth, id, getIdea, fetchUsers])

  return (
    <div className='negmar-ideas border-round-xl py-7  md:px-8 sm:px-7 px-5 bg-white ideacard relative'>
      <Link to='/ideas'>
        <img className='absolute top-0 left-0 m-5' src={require('../../assets/backArrow.svg').default} alt='back-arrow' />
      </Link>
      <div className='flex flex-row'>
        <div className='flex-grow-1'>
          <div className='flex gap-1 sm:flex-row flex-column sm:align-items-center'>
            <p className='bodytext md:font-20 font-16'>{idea.authorName}</p>
            <p className='font-20 sm:block hidden bodytext'>{idea.authorName ? '|' : null}</p>
            <p className='font-16 datetext'>{date}</p>
          </div>
          <div className='flex flex-row justify-content-between'>
            <h1 style={{ wordBreak: 'break-all' }} className='font-bold'>{idea.title || <Skeleton className='w-100' />}</h1>
            <div className='flex flex-row gap-2 h-min my-auto align-items-center'>
              <p style={{ color: '#FF6B6B' }}>{upvoteCount}</p>
              {hearted ? <img className='button' onClick={() => sendVote(0)} src={require('../../assets/fullHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} /> : <img onClick={() => sendVote(1)} className='button' src={require('../../assets/hollowHeart.svg').default} style={{ height: '1.5rem' }} alt='heart' />}
              {idea.author && idea.author._id === userId &&
                <Link className='flex' to={`/ideas/edit/${id}`}>
                  <img className='pl-2 m-auto' src={require('../../assets/edit-icon.svg').default} alt='edit' />
                </Link>}
              {idea.author && idea.author._id === userId && (warned
                ? <img onClick={deleteIdea} className='pl-2 button' height={28} src={require('../../assets/trash-bin.svg').default} alt='trash' />
                : <img onClick={deleteWarn} className='pl-2 button' height={28} src={require('../../assets/trash-bin.svg').default} alt='trash' />)}
            </div>
          </div>
        </div>
      </div>
      <p style={{ overflowWrap: 'break-word' }} className='mt-4 bodytext font-16'>{idea.description || <Skeleton />}</p>
      <div className='md:font-20 font-16 text-white mt-5 flex flex-row flex-wrap gap-2'>
        {idea.tags.map((tag, index) => {
          return <p className='p-1 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
      </div>
      <div className='relative mt-7'>
        <MixedTags
          autoFocus
          settings={tagSettings}
          onInput={onInput}
          placeholder='Add a comment...'
          tagifyRef={tagifyRef}
          className={styles.tagifyComments}
          id='comment-input'
          onChange={onChange}
        />
        {!submitCommentLoading
          ? <img
              src={require('../../assets/messageSymbol.svg').default} alt='tickIcon'
              onClick={submitComment}
              className='button comment-icon absolute top-50 right-0 pr-1'
            />
          : <img
              src={require('../../assets/spinner.gif')} height={28} alt='spinnerIcon'
              className='comment-icon absolute top-50 right-0 pr-1'
            />}
      </div>
      {!commentsLoading
        ? (
          <div className='mt-6 flex flex-column gap-4'>
            {comments.length
              ? (
                  comments.map((comment, index) => {
                    return (
                      <div key={index} className='comment flex flex-row md:gap-4 gap-2'>
                        <img className='md:w-3rem w-2rem pfp' src={comment.author.picture} alt='pfp' referrerPolicy='no-referrer' />
                        <div className='flex-grow-1'>
                          <p className='md:font-20 font-16'>{comment.authorName}</p>
                          <span className='mt-1 bodytext font-16' dangerouslySetInnerHTML={{ __html: comment.body }} />
                        </div>
                        {comment.author && comment.author._id === userId &&
                          <img
                            onClick={(e) => {
                              deleteComment(comment._id, e)
                            }} className='pl-2 button comment-delete' height={25} src={require('../../assets/trash-bin.svg').default} alt='trash'
                          />}
                      </div>
                    )
                  }))
              : (
                <p className='bodytext'>
                  No comments yet 😔
                </p>
                )}
          </div>
          )
        : <div className='mt-6'><Skeleton height={45} className='mt-3' count={10} /></div>}
    </div>
  )
}
